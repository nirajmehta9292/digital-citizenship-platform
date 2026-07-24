# BYT Education - Backend API

FastAPI-based backend for the Digital Citizenship & AI Literacy platform.

## Features

- ✅ **Multi-role Authentication**: Students, Teachers, Parents, Admin
- ✅ **Lesson Management**: Create, publish, and manage lessons
- ✅ **Quiz System**: Auto-graded quizzes with detailed feedback
- ✅ **Progress Tracking**: Real-time student progress monitoring
- ✅ **Analytics Dashboard**: Class insights and performance metrics
- ✅ **Gradebook**: Comprehensive gradebook for teachers
- ✅ **Parent Portal**: View children's progress and scores
- ✅ **Standards Alignment**: Map to ISTE, CASEL, UNESCO frameworks

## Tech Stack

- **Framework**: FastAPI 0.104+
- **Database**: MongoDB with Motor (async driver)
- **Auth**: JWT with bcrypt password hashing
- **Validation**: Pydantic v2
- **Python**: 3.11+

## Installation

### 1. Create Virtual Environment

```bash
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Configure Environment

```bash
cp .env.example .env
# Edit .env with your configuration
```

### 4. Start MongoDB

```bash
# Using Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest

# Or install MongoDB locally
brew install mongodb-community  # macOS
```

### 5. Run the Server

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

API will be available at: http://localhost:8000

Interactive API docs: http://localhost:8000/docs

## API Endpoints

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login and get JWT token
- `GET /auth/me` - Get current user info

### Schools
- `POST /schools` - Create school (admin)
- `GET /schools/{school_id}` - Get school details

### Lessons
- `POST /lessons` - Create lesson (teacher/admin)
- `GET /lessons` - List lessons (with filters)
- `GET /lessons/{lesson_id}` - Get lesson details
- `PATCH /lessons/{lesson_id}/publish` - Publish lesson (admin)

### Quizzes
- `POST /quizzes` - Create quiz (teacher/admin)
- `GET /quizzes/lesson/{lesson_id}` - Get quiz for lesson
- `POST /quizzes/submit` - Submit quiz answers (student)

### Progress
- `GET /progress/student/{student_id}` - Get student progress
- `POST /progress/update` - Update progress

### Teacher Dashboard
- `GET /teacher/class-insights/{class_id}` - Get class insights
- `GET /teacher/gradebook` - Get complete gradebook

### Parent Dashboard
- `GET /parent/children` - Get children and their progress

### Analytics
- `GET /analytics/overview` - Platform analytics (admin)

## Database Collections

### users
```json
{
  "_id": "ObjectId",
  "email": "student@example.com",
  "full_name": "John Doe",
  "role": "student",
  "password_hash": "bcrypt_hash",
  "school_id": "school_id",
  "grade_level": "grade_5",
  "created_at": "datetime",
  "is_active": true
}
```

### lessons
```json
{
  "_id": "ObjectId",
  "title": "Adding Two-Step Verification",
  "lesson_type": "digital_safety",
  "grade_level": "grade_5",
  "module_number": 4,
  "lesson_number": 11,
  "duration_minutes": 15,
  "story_content": "Story text...",
  "story_audio_url": "url",
  "learning_objectives": ["..."],
  "standards_alignment": {"ISTE": ["..."], "CASEL": ["..."]},
  "is_published": true,
  "created_by": "user_id",
  "created_at": "datetime"
}
```

### quizzes
```json
{
  "_id": "ObjectId",
  "lesson_id": "lesson_id",
  "questions": [
    {
      "question_text": "What is 2FA?",
      "options": ["...", "...", "..."],
      "correct_answer_index": 0,
      "explanation": "..."
    }
  ],
  "passing_score": 75,
  "created_by": "user_id"
}
```

### quiz_results
```json
{
  "_id": "ObjectId",
  "quiz_id": "quiz_id",
  "student_id": "student_id",
  "lesson_id": "lesson_id",
  "score": 3,
  "total_questions": 4,
  "percentage": 75.0,
  "passed": true,
  "answers": [...],
  "completed_at": "datetime"
}
```

### student_progress
```json
{
  "_id": "ObjectId",
  "student_id": "student_id",
  "lesson_id": "lesson_id",
  "status": "completed",
  "quiz_score": 75.0,
  "time_spent_minutes": 15,
  "last_accessed": "datetime"
}
```

## Docker Deployment

### Build Image

```bash
docker build -t byt-education-backend .
```

### Run Container

```bash
docker run -d \
  -p 8000:8000 \
  -e MONGO_URI=mongodb://host.docker.internal:27017 \
  -e SECRET_KEY=your-secret-key \
  --name byt-backend \
  byt-education-backend
```

## Testing

```bash
# Install test dependencies
pip install pytest pytest-asyncio httpx

# Run tests
pytest
```

## Security Features

- ✅ JWT-based authentication
- ✅ Bcrypt password hashing
- ✅ Role-based access control (RBAC)
- ✅ CORS protection
- ✅ Data minimization (GDPR/COPPA compliant design)
- ✅ Secure password requirements

## Development

```bash
# Format code
black main.py

# Type checking
mypy main.py

# Linting
flake8 main.py
```

## Production Checklist

- [ ] Change SECRET_KEY in production
- [ ] Set DEBUG=False
- [ ] Use production-grade MongoDB (Atlas)
- [ ] Enable HTTPS/TLS
- [ ] Set up rate limiting
- [ ] Configure monitoring (Sentry, etc.)
- [ ] Set up backups
- [ ] Review CORS origins
- [ ] Enable audit logging

## License

Proprietary - BYT Education Platform
