# API Documentation

## Base URL

**Development:** `http://localhost:8000`  
**Production:** `https://api.yoursite.com`

All endpoints are prefixed with the base URL.

## Authentication

Most endpoints require JWT authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

Get a token by logging in via `/auth/login`.

## Response Format

### Success Response
```json
{
  "data": { ... },
  "message": "Success"
}
```

### Error Response
```json
{
  "detail": "Error message"
}
```

## Endpoints

### Authentication

#### Register User
```
POST /auth/register
```

**Request Body:**
```json
{
  "email": "student@school.com",
  "full_name": "John Doe",
  "role": "student",
  "password": "SecurePassword123!",
  "grade_level": "grade_5"
}
```

**Response:** User object

---

#### Login
```
POST /auth/login
```

**Request Body:**
```json
{
  "email": "student@school.com",
  "password": "SecurePassword123!"
}
```

**Response:**
```json
{
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "token_type": "bearer",
  "user": { ... }
}
```

---

#### Get Current User
```
GET /auth/me
```

**Headers:** Authorization required

**Response:** Current user object

---

### Lessons

#### Get All Lessons
```
GET /lessons
```

**Query Parameters:**
- `lesson_type` (optional): `digital_safety` or `responsible_ai`
- `grade_level` (optional): `grade_1` to `grade_8`

**Response:**
```json
{
  "lessons": [ ... ],
  "total": 10
}
```

---

#### Get Lesson by ID
```
GET /lessons/{lesson_id}
```

**Response:** Lesson object with full content

---

#### Create Lesson (Teacher/Admin)
```
POST /lessons
```

**Request Body:**
```json
{
  "title": "Understanding Passwords",
  "description": "Learn about password security",
  "lesson_type": "digital_safety",
  "grade_level": "grade_4",
  "module_number": 1,
  "lesson_number": 1,
  "story_content": "...",
  "learning_objectives": ["..."],
  "standards_alignment": { ... }
}
```

---

### Quizzes

#### Get Quiz for Lesson
```
GET /quizzes/lesson/{lesson_id}
```

**Response:** Quiz object (correct answers hidden for students)

---

#### Submit Quiz
```
POST /quizzes/submit
```

**Request Body:**
```json
{
  "lesson_id": "...",
  "quiz_id": "...",
  "student_id": "...",
  "answers": [0, 2, 1, 3]
}
```

**Response:**
```json
{
  "score": 3,
  "total_questions": 4,
  "percentage": 75.0,
  "passed": true,
  "answers": [ ... ]
}
```

---

### Progress

#### Get Student Progress
```
GET /progress/student/{student_id}
```

**Response:**
```json
{
  "progress": [ ... ],
  "total_lessons": 10
}
```

---

### Teacher Dashboard

#### Get Gradebook
```
GET /teacher/gradebook
```

**Response:**
```json
{
  "students": [ ... ],
  "total": 25
}
```

---

#### Get Class Insights
```
GET /teacher/class-insights/{class_id}
```

**Response:**
```json
{
  "insights": [ ... ],
  "total_students": 25
}
```

---

### Parent Dashboard

#### Get Children
```
GET /parent/children
```

**Response:**
```json
{
  "children": [ ... ]
}
```

---

### Analytics (Admin)

#### Get Platform Overview
```
GET /analytics/overview
```

**Response:**
```json
{
  "total_users": 500,
  "total_students": 400,
  "total_teachers": 50,
  "total_lessons": 50,
  "platform_average_score": 82.5
}
```

---

## Interactive Documentation

Visit http://localhost:8000/docs for interactive Swagger documentation where you can test all endpoints.
