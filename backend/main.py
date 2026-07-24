"""
BYT Education Clone - Backend API
Digital Citizenship & AI Literacy Platform
Built with FastAPI, MongoDB, and JWT Authentication
"""

from fastapi import FastAPI, HTTPException, Depends, status, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List, Dict, Any
from datetime import datetime, timedelta
from motor.motor_asyncio import AsyncIOMotorClient
from passlib.context import CryptContext
import jwt
import os
from bson import ObjectId
from enum import Enum
import secrets

# Configuration
SECRET_KEY = os.getenv("SECRET_KEY", secrets.token_urlsafe(32))
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30
MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
DB_NAME = "byt_education"

# Initialize FastAPI
app = FastAPI(
    title="BYT Education API",
    description="Digital Citizenship & AI Literacy Platform API",
    version="1.0.0"
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Security
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
security = HTTPBearer()

# Database client
mongo_client: Optional[AsyncIOMotorClient] = None
db = None


# Enums
class UserRole(str, Enum):
    STUDENT = "student"
    TEACHER = "teacher"
    PARENT = "parent"
    ADMIN = "admin"


class LessonType(str, Enum):
    DIGITAL_SAFETY = "digital_safety"
    RESPONSIBLE_AI = "responsible_ai"


class GradeLevel(str, Enum):
    GRADE_1 = "grade_1"
    GRADE_2 = "grade_2"
    GRADE_3 = "grade_3"
    GRADE_4 = "grade_4"
    GRADE_5 = "grade_5"
    GRADE_6 = "grade_6"
    GRADE_7 = "grade_7"
    GRADE_8 = "grade_8"


# Pydantic Models
class UserBase(BaseModel):
    email: EmailStr
    full_name: str
    role: UserRole


class UserCreate(UserBase):
    password: str
    school_id: Optional[str] = None
    grade_level: Optional[GradeLevel] = None


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserResponse(UserBase):
    id: str
    school_id: Optional[str] = None
    grade_level: Optional[GradeLevel] = None
    created_at: datetime


class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse


class School(BaseModel):
    name: str
    address: str
    admin_email: EmailStr
    subscription_plan: str = "free"
    max_students: int = 50


class LessonContent(BaseModel):
    title: str
    description: str
    lesson_type: LessonType
    grade_level: GradeLevel
    duration_minutes: int = 15
    module_number: int
    lesson_number: int
    story_content: str
    story_audio_url: Optional[str] = None
    learning_objectives: List[str]
    standards_alignment: Dict[str, List[str]] = {}


class QuizQuestion(BaseModel):
    question_text: str
    options: List[str]
    correct_answer_index: int
    explanation: str


class Quiz(BaseModel):
    lesson_id: str
    questions: List[QuizQuestion]
    passing_score: int = 75


class QuizSubmission(BaseModel):
    lesson_id: str
    quiz_id: str
    student_id: str
    answers: List[int]  # Indices of selected answers
    submitted_at: datetime = Field(default_factory=datetime.utcnow)


class QuizResult(BaseModel):
    quiz_id: str
    student_id: str
    lesson_id: str
    score: int
    total_questions: int
    percentage: float
    passed: bool
    answers: List[Dict[str, Any]]
    completed_at: datetime


class StudentProgress(BaseModel):
    student_id: str
    lesson_id: str
    status: str = "not_started"  # not_started, in_progress, completed
    quiz_score: Optional[int] = None
    time_spent_minutes: int = 0
    last_accessed: datetime = Field(default_factory=datetime.utcnow)


class ClassInsights(BaseModel):
    class_id: str
    lesson_id: str
    average_score: float
    completion_rate: float
    students_struggled: List[Dict[str, Any]]


# Helper Functions
def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def serialize_doc(doc: dict) -> dict:
    """Convert MongoDB document to JSON-serializable dict"""
    if doc is None:
        return None
    if "_id" in doc:
        doc["id"] = str(doc["_id"])
        del doc["_id"]
    return doc


async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Validate JWT token and return current user"""
    token = credentials.credentials
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise HTTPException(status_code=401, detail="Invalid token")
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    user = await db.users.find_one({"email": email})
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    
    return serialize_doc(user)


# Startup and Shutdown
@app.on_event("startup")
async def startup_db_client():
    global mongo_client, db
    mongo_client = AsyncIOMotorClient(MONGO_URI)
    db = mongo_client[DB_NAME]
    print(f"✅ Connected to MongoDB: {DB_NAME}")
    
    # Create indexes
    await db.users.create_index("email", unique=True)
    await db.lessons.create_index([("lesson_type", 1), ("grade_level", 1)])
    await db.quiz_results.create_index([("student_id", 1), ("lesson_id", 1)])


@app.on_event("shutdown")
async def shutdown_db_client():
    if mongo_client:
        mongo_client.close()
        print("❌ MongoDB connection closed")


# Health Check
@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "service": "BYT Education API",
        "timestamp": datetime.utcnow()
    }


# Authentication Endpoints
@app.post("/auth/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register_user(user: UserCreate):
    """Register a new user (student, teacher, parent, or admin)"""
    # Check if user exists
    existing_user = await db.users.find_one({"email": user.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Create user
    user_doc = {
        "email": user.email,
        "full_name": user.full_name,
        "role": user.role,
        "password_hash": get_password_hash(user.password),
        "school_id": user.school_id,
        "grade_level": user.grade_level,
        "created_at": datetime.utcnow(),
        "is_active": True
    }
    
    result = await db.users.insert_one(user_doc)
    user_doc["_id"] = result.inserted_id
    
    return serialize_doc(user_doc)


@app.post("/auth/login", response_model=Token)
async def login(user_login: UserLogin):
    """Login and get JWT token"""
    user = await db.users.find_one({"email": user_login.email})
    if not user or not verify_password(user_login.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    if not user.get("is_active", True):
        raise HTTPException(status_code=403, detail="Account is disabled")
    
    # Create access token
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user["email"], "role": user["role"]},
        expires_delta=access_token_expires
    )
    
    user_response = serialize_doc(user)
    del user_response["password_hash"]
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user_response
    }


@app.get("/auth/me", response_model=UserResponse)
async def get_me(current_user: dict = Depends(get_current_user)):
    """Get current user info"""
    if "password_hash" in current_user:
        del current_user["password_hash"]
    return current_user


# School Management
@app.post("/schools", status_code=status.HTTP_201_CREATED)
async def create_school(school: School, current_user: dict = Depends(get_current_user)):
    """Create a new school (admin only)"""
    if current_user["role"] != UserRole.ADMIN:
        raise HTTPException(status_code=403, detail="Only admins can create schools")
    
    school_doc = school.dict()
    school_doc["created_at"] = datetime.utcnow()
    
    result = await db.schools.insert_one(school_doc)
    school_doc["_id"] = result.inserted_id
    
    return serialize_doc(school_doc)


@app.get("/schools/{school_id}")
async def get_school(school_id: str, current_user: dict = Depends(get_current_user)):
    """Get school details"""
    school = await db.schools.find_one({"_id": ObjectId(school_id)})
    if not school:
        raise HTTPException(status_code=404, detail="School not found")
    
    return serialize_doc(school)


# Lesson Management
@app.post("/lessons", status_code=status.HTTP_201_CREATED)
async def create_lesson(lesson: LessonContent, current_user: dict = Depends(get_current_user)):
    """Create a new lesson (teachers and admins only)"""
    if current_user["role"] not in [UserRole.TEACHER, UserRole.ADMIN]:
        raise HTTPException(status_code=403, detail="Only teachers and admins can create lessons")
    
    lesson_doc = lesson.dict()
    lesson_doc["created_by"] = current_user["id"]
    lesson_doc["created_at"] = datetime.utcnow()
    lesson_doc["is_published"] = False
    
    result = await db.lessons.insert_one(lesson_doc)
    lesson_doc["_id"] = result.inserted_id
    
    return serialize_doc(lesson_doc)


@app.get("/lessons")
async def get_lessons(
    lesson_type: Optional[LessonType] = None,
    grade_level: Optional[GradeLevel] = None,
    current_user: dict = Depends(get_current_user)
):
    """Get all lessons with optional filters"""
    query = {"is_published": True}
    
    if lesson_type:
        query["lesson_type"] = lesson_type
    
    if grade_level:
        query["grade_level"] = grade_level
    
    # If student, filter by their grade level
    if current_user["role"] == UserRole.STUDENT and current_user.get("grade_level"):
        query["grade_level"] = current_user["grade_level"]
    
    lessons = []
    async for lesson in db.lessons.find(query).sort("module_number", 1).sort("lesson_number", 1):
        lessons.append(serialize_doc(lesson))
    
    return {"lessons": lessons, "total": len(lessons)}


@app.get("/lessons/{lesson_id}")
async def get_lesson(lesson_id: str, current_user: dict = Depends(get_current_user)):
    """Get a specific lesson"""
    lesson = await db.lessons.find_one({"_id": ObjectId(lesson_id)})
    if not lesson:
        raise HTTPException(status_code=404, detail="Lesson not found")
    
    return serialize_doc(lesson)


@app.patch("/lessons/{lesson_id}/publish")
async def publish_lesson(lesson_id: str, current_user: dict = Depends(get_current_user)):
    """Publish a lesson (admin only)"""
    if current_user["role"] != UserRole.ADMIN:
        raise HTTPException(status_code=403, detail="Only admins can publish lessons")
    
    result = await db.lessons.update_one(
        {"_id": ObjectId(lesson_id)},
        {"$set": {"is_published": True, "published_at": datetime.utcnow()}}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Lesson not found")
    
    return {"message": "Lesson published successfully"}


# Quiz Management
@app.post("/quizzes", status_code=status.HTTP_201_CREATED)
async def create_quiz(quiz: Quiz, current_user: dict = Depends(get_current_user)):
    """Create a quiz for a lesson"""
    if current_user["role"] not in [UserRole.TEACHER, UserRole.ADMIN]:
        raise HTTPException(status_code=403, detail="Only teachers and admins can create quizzes")
    
    # Verify lesson exists
    lesson = await db.lessons.find_one({"_id": ObjectId(quiz.lesson_id)})
    if not lesson:
        raise HTTPException(status_code=404, detail="Lesson not found")
    
    quiz_doc = quiz.dict()
    quiz_doc["created_by"] = current_user["id"]
    quiz_doc["created_at"] = datetime.utcnow()
    
    result = await db.quizzes.insert_one(quiz_doc)
    quiz_doc["_id"] = result.inserted_id
    
    return serialize_doc(quiz_doc)


@app.get("/quizzes/lesson/{lesson_id}")
async def get_quiz_by_lesson(lesson_id: str, current_user: dict = Depends(get_current_user)):
    """Get quiz for a specific lesson"""
    quiz = await db.quizzes.find_one({"lesson_id": lesson_id})
    if not quiz:
        raise HTTPException(status_code=404, detail="Quiz not found for this lesson")
    
    # For students, don't send correct answers
    if current_user["role"] == UserRole.STUDENT:
        for question in quiz["questions"]:
            question.pop("correct_answer_index", None)
            question.pop("explanation", None)
    
    return serialize_doc(quiz)


@app.post("/quizzes/submit", response_model=QuizResult)
async def submit_quiz(submission: QuizSubmission, current_user: dict = Depends(get_current_user)):
    """Submit quiz answers and get results"""
    if current_user["role"] != UserRole.STUDENT:
        raise HTTPException(status_code=403, detail="Only students can submit quizzes")
    
    # Get quiz
    quiz = await db.quizzes.find_one({"_id": ObjectId(submission.quiz_id)})
    if not quiz:
        raise HTTPException(status_code=404, detail="Quiz not found")
    
    # Grade quiz
    total_questions = len(quiz["questions"])
    correct_answers = 0
    detailed_answers = []
    
    for idx, answer_index in enumerate(submission.answers):
        question = quiz["questions"][idx]
        is_correct = answer_index == question["correct_answer_index"]
        if is_correct:
            correct_answers += 1
        
        detailed_answers.append({
            "question_number": idx + 1,
            "question": question["question_text"],
            "student_answer": question["options"][answer_index],
            "correct_answer": question["options"][question["correct_answer_index"]],
            "is_correct": is_correct,
            "explanation": question.get("explanation", "")
        })
    
    percentage = (correct_answers / total_questions) * 100
    passed = percentage >= quiz.get("passing_score", 75)
    
    # Save result
    result_doc = {
        "quiz_id": submission.quiz_id,
        "student_id": current_user["id"],
        "lesson_id": submission.lesson_id,
        "score": correct_answers,
        "total_questions": total_questions,
        "percentage": percentage,
        "passed": passed,
        "answers": detailed_answers,
        "completed_at": datetime.utcnow()
    }
    
    await db.quiz_results.insert_one(result_doc)
    
    # Update student progress
    await db.student_progress.update_one(
        {"student_id": current_user["id"], "lesson_id": submission.lesson_id},
        {
            "$set": {
                "status": "completed",
                "quiz_score": percentage,
                "last_accessed": datetime.utcnow()
            }
        },
        upsert=True
    )
    
    result_doc.pop("_id")
    return result_doc


# Student Progress
@app.get("/progress/student/{student_id}")
async def get_student_progress(student_id: str, current_user: dict = Depends(get_current_user)):
    """Get student progress across all lessons"""
    # Authorization check
    if current_user["role"] == UserRole.STUDENT and current_user["id"] != student_id:
        raise HTTPException(status_code=403, detail="Can only view your own progress")
    
    progress_list = []
    async for progress in db.student_progress.find({"student_id": student_id}):
        # Get lesson details
        lesson = await db.lessons.find_one({"_id": ObjectId(progress["lesson_id"])})
        if lesson:
            progress_item = serialize_doc(progress)
            progress_item["lesson_title"] = lesson["title"]
            progress_item["lesson_type"] = lesson["lesson_type"]
            progress_list.append(progress_item)
    
    return {"progress": progress_list, "total_lessons": len(progress_list)}


@app.post("/progress/update")
async def update_progress(progress: StudentProgress, current_user: dict = Depends(get_current_user)):
    """Update student progress for a lesson"""
    if current_user["role"] == UserRole.STUDENT and current_user["id"] != progress.student_id:
        raise HTTPException(status_code=403, detail="Can only update your own progress")
    
    await db.student_progress.update_one(
        {"student_id": progress.student_id, "lesson_id": progress.lesson_id},
        {"$set": progress.dict()},
        upsert=True
    )
    
    return {"message": "Progress updated successfully"}


# Teacher Dashboard
@app.get("/teacher/class-insights/{class_id}")
async def get_class_insights(class_id: str, current_user: dict = Depends(get_current_user)):
    """Get class-wide insights for teachers"""
    if current_user["role"] != UserRole.TEACHER:
        raise HTTPException(status_code=403, detail="Only teachers can view class insights")
    
    # Get all students in class
    students = []
    async for student in db.users.find({"role": UserRole.STUDENT, "school_id": current_user.get("school_id")}):
        students.append(serialize_doc(student))
    
    # Get all quiz results for this class
    insights = []
    async for lesson in db.lessons.find({"is_published": True}):
        lesson_id = str(lesson["_id"])
        
        # Get all quiz results for this lesson
        results = []
        async for result in db.quiz_results.find({"lesson_id": lesson_id}):
            results.append(result)
        
        if results:
            avg_score = sum(r["percentage"] for r in results) / len(results)
            completion_rate = (len(results) / len(students)) * 100 if students else 0
            
            # Find students who struggled (< 75%)
            struggled = [
                {"student_id": r["student_id"], "score": r["percentage"]}
                for r in results if r["percentage"] < 75
            ]
            
            insights.append({
                "lesson_id": lesson_id,
                "lesson_title": lesson["title"],
                "average_score": round(avg_score, 2),
                "completion_rate": round(completion_rate, 2),
                "total_students": len(students),
                "completed": len(results),
                "students_struggled": struggled
            })
    
    return {"insights": insights, "total_students": len(students)}


@app.get("/teacher/gradebook")
async def get_gradebook(current_user: dict = Depends(get_current_user)):
    """Get complete gradebook for teacher"""
    if current_user["role"] != UserRole.TEACHER:
        raise HTTPException(status_code=403, detail="Only teachers can view gradebook")
    
    # Get all students
    students = []
    async for student in db.users.find({"role": UserRole.STUDENT, "school_id": current_user.get("school_id")}):
        student_data = serialize_doc(student)
        
        # Get their quiz results
        quiz_results = []
        async for result in db.quiz_results.find({"student_id": student_data["id"]}):
            quiz_results.append(serialize_doc(result))
        
        student_data["quiz_results"] = quiz_results
        student_data["average_score"] = (
            sum(r["percentage"] for r in quiz_results) / len(quiz_results)
            if quiz_results else 0
        )
        
        students.append(student_data)
    
    return {"students": students, "total": len(students)}


# Parent Dashboard
@app.get("/parent/children")
async def get_parent_children(current_user: dict = Depends(get_current_user)):
    """Get parent's children and their progress"""
    if current_user["role"] != UserRole.PARENT:
        raise HTTPException(status_code=403, detail="Only parents can view this")
    
    # Get linked children (in real app, would have parent-child relationships)
    # For now, return mock data structure
    children = []
    async for child in db.users.find({"role": UserRole.STUDENT, "parent_email": current_user["email"]}):
        child_data = serialize_doc(child)
        
        # Get progress
        progress = []
        async for prog in db.student_progress.find({"student_id": child_data["id"]}):
            progress.append(serialize_doc(prog))
        
        # Get quiz results
        quiz_results = []
        async for result in db.quiz_results.find({"student_id": child_data["id"]}):
            quiz_results.append(serialize_doc(result))
        
        child_data["progress"] = progress
        child_data["quiz_results"] = quiz_results
        child_data["average_score"] = (
            sum(r["percentage"] for r in quiz_results) / len(quiz_results)
            if quiz_results else 0
        )
        
        children.append(child_data)
    
    return {"children": children}


# Analytics
@app.get("/analytics/overview")
async def get_analytics_overview(current_user: dict = Depends(get_current_user)):
    """Get platform analytics (admin only)"""
    if current_user["role"] != UserRole.ADMIN:
        raise HTTPException(status_code=403, detail="Admin access required")
    
    total_users = await db.users.count_documents({})
    total_students = await db.users.count_documents({"role": UserRole.STUDENT})
    total_teachers = await db.users.count_documents({"role": UserRole.TEACHER})
    total_lessons = await db.lessons.count_documents({"is_published": True})
    total_quizzes = await db.quiz_results.count_documents({})
    
    # Calculate average platform score
    avg_scores = []
    async for result in db.quiz_results.find():
        avg_scores.append(result["percentage"])
    
    platform_avg = sum(avg_scores) / len(avg_scores) if avg_scores else 0
    
    return {
        "total_users": total_users,
        "total_students": total_students,
        "total_teachers": total_teachers,
        "total_lessons": total_lessons,
        "total_quizzes_completed": total_quizzes,
        "platform_average_score": round(platform_avg, 2)
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
