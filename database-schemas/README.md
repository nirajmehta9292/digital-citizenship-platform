# Database Schemas - BYT Education Platform

## Collections Overview

The platform uses MongoDB with the following collections:

1. **users** - All platform users (students, teachers, parents, admins)
2. **schools** - School/institution information
3. **lessons** - Lesson content and metadata
4. **quizzes** - Quiz questions and configurations
5. **quiz_results** - Student quiz submissions and scores
6. **student_progress** - Lesson progress tracking

---

## 1. Users Collection

Stores all user accounts with role-based access.

```json
{
  "_id": ObjectId("..."),
  "email": "student@school.com",
  "full_name": "John Doe",
  "password_hash": "$2b$12$...",
  "role": "student",
  "school_id": "school_id",
  "grade_level": "grade_5",
  "parent_email": "parent@example.com",
  "created_at": ISODate("2026-01-15T10:00:00Z"),
  "is_active": true,
  "last_login": ISODate("2026-07-24T14:30:00Z")
}
```

### Fields
- `_id`: Unique identifier
- `email`: User email (unique index)
- `full_name`: Full name
- `password_hash`: Bcrypt hashed password
- `role`: Enum - `student`, `teacher`, `parent`, `admin`
- `school_id`: Reference to school (optional)
- `grade_level`: Enum - `grade_1` to `grade_8` (students only)
- `parent_email`: Parent's email for linking (students only)
- `created_at`: Registration timestamp
- `is_active`: Account status
- `last_login`: Last login timestamp

### Indexes
```javascript
db.users.createIndex({ email: 1 }, { unique: true })
db.users.createIndex({ role: 1 })
db.users.createIndex({ school_id: 1 })
```

---

## 2. Schools Collection

School/institution information and subscription details.

```json
{
  "_id": ObjectId("..."),
  "name": "Springfield Elementary",
  "address": "123 Main St, Springfield",
  "admin_email": "admin@springfield.edu",
  "subscription_plan": "premium",
  "max_students": 500,
  "created_at": ISODate("2026-01-01T00:00:00Z"),
  "subscription_expires": ISODate("2027-01-01T00:00:00Z"),
  "features": ["digital_safety", "responsible_ai"],
  "contact_phone": "+1-555-0100",
  "country": "USA"
}
```

### Fields
- `_id`: Unique identifier
- `name`: School name
- `address`: Physical address
- `admin_email`: Primary administrator email
- `subscription_plan`: `free`, `basic`, `premium`
- `max_students`: Student capacity limit
- `created_at`: Registration date
- `subscription_expires`: Subscription end date
- `features`: Enabled curriculum tracks
- `contact_phone`: Contact number
- `country`: Country code

---

## 3. Lessons Collection

Lesson content with stories and learning objectives.

```json
{
  "_id": ObjectId("..."),
  "title": "Adding Two-Step Verification",
  "description": "Learn how to secure your accounts with 2FA",
  "lesson_type": "digital_safety",
  "grade_level": "grade_5",
  "module_number": 4,
  "lesson_number": 11,
  "duration_minutes": 15,
  "story_content": "Byte was playing his favorite game when...",
  "story_audio_url": "https://storage/lessons/grade5-m4-l11.mp3",
  "learning_objectives": [
    "Understand what two-factor authentication is",
    "Recognize the benefits of using 2FA",
    "Learn how to enable 2FA on common platforms"
  ],
  "standards_alignment": {
    "ISTE": ["1.2.a", "1.2.b"],
    "CASEL": ["Self-management"],
    "UNESCO": ["Digital Safety 3.1"]
  },
  "is_published": true,
  "created_by": "user_id",
  "created_at": ISODate("2026-06-01T00:00:00Z"),
  "published_at": ISODate("2026-06-15T00:00:00Z"),
  "updated_at": ISODate("2026-07-01T00:00:00Z")
}
```

### Fields
- `_id`: Unique identifier
- `title`: Lesson title
- `description`: Brief description
- `lesson_type`: `digital_safety` or `responsible_ai`
- `grade_level`: Target grade (`grade_1` to `grade_8`)
- `module_number`: Module/unit number
- `lesson_number`: Lesson sequence number
- `duration_minutes`: Expected duration (default: 15)
- `story_content`: Story text content
- `story_audio_url`: URL to audio file (optional)
- `learning_objectives`: Array of learning goals
- `standards_alignment`: Mapping to education frameworks
- `is_published`: Publication status
- `created_by`: Author user ID
- `created_at`: Creation timestamp
- `published_at`: Publication timestamp
- `updated_at`: Last update timestamp

### Indexes
```javascript
db.lessons.createIndex({ lesson_type: 1, grade_level: 1 })
db.lessons.createIndex({ is_published: 1 })
db.lessons.createIndex({ module_number: 1, lesson_number: 1 })
```

---

## 4. Quizzes Collection

Quiz questions and answer configurations.

```json
{
  "_id": ObjectId("..."),
  "lesson_id": "lesson_object_id",
  "questions": [
    {
      "question_text": "What does 2FA stand for?",
      "options": [
        "Two-Factor Authentication",
        "Two-File Access",
        "Two-Factor Authorization",
        "Two-Form Application"
      ],
      "correct_answer_index": 0,
      "explanation": "2FA stands for Two-Factor Authentication, which adds an extra layer of security to your accounts."
    },
    {
      "question_text": "Which of these is an example of a second factor?",
      "options": [
        "Your password",
        "A code sent to your phone",
        "Your username",
        "Your email address"
      ],
      "correct_answer_index": 1,
      "explanation": "A code sent to your phone is a second factor because it's something you have, in addition to something you know (your password)."
    }
  ],
  "passing_score": 75,
  "created_by": "user_id",
  "created_at": ISODate("2026-06-15T00:00:00Z")
}
```

### Fields
- `_id`: Unique identifier
- `lesson_id`: Reference to lesson
- `questions`: Array of question objects
  - `question_text`: Question prompt
  - `options`: Array of answer choices
  - `correct_answer_index`: Index of correct answer (0-based)
  - `explanation`: Explanation of correct answer
- `passing_score`: Minimum percentage to pass (default: 75)
- `created_by`: Quiz creator user ID
- `created_at`: Creation timestamp

### Indexes
```javascript
db.quizzes.createIndex({ lesson_id: 1 }, { unique: true })
```

---

## 5. Quiz Results Collection

Student quiz submissions and scores.

```json
{
  "_id": ObjectId("..."),
  "quiz_id": "quiz_object_id",
  "student_id": "student_object_id",
  "lesson_id": "lesson_object_id",
  "score": 3,
  "total_questions": 4,
  "percentage": 75.0,
  "passed": true,
  "answers": [
    {
      "question_number": 1,
      "question": "What does 2FA stand for?",
      "student_answer": "Two-Factor Authentication",
      "correct_answer": "Two-Factor Authentication",
      "is_correct": true,
      "explanation": "..."
    },
    {
      "question_number": 2,
      "question": "Which of these is an example of a second factor?",
      "student_answer": "Your password",
      "correct_answer": "A code sent to your phone",
      "is_correct": false,
      "explanation": "..."
    }
  ],
  "completed_at": ISODate("2026-07-24T15:00:00Z"),
  "time_taken_seconds": 320
}
```

### Fields
- `_id`: Unique identifier
- `quiz_id`: Reference to quiz
- `student_id`: Reference to student user
- `lesson_id`: Reference to lesson
- `score`: Number of correct answers
- `total_questions`: Total number of questions
- `percentage`: Score as percentage
- `passed`: Whether student passed (score >= passing_score)
- `answers`: Detailed answer breakdown
- `completed_at`: Submission timestamp
- `time_taken_seconds`: Time to complete (optional)

### Indexes
```javascript
db.quiz_results.createIndex({ student_id: 1, lesson_id: 1 })
db.quiz_results.createIndex({ quiz_id: 1 })
db.quiz_results.createIndex({ completed_at: -1 })
```

---

## 6. Student Progress Collection

Tracks student progress through lessons.

```json
{
  "_id": ObjectId("..."),
  "student_id": "student_object_id",
  "lesson_id": "lesson_object_id",
  "status": "completed",
  "quiz_score": 75.0,
  "time_spent_minutes": 18,
  "last_accessed": ISODate("2026-07-24T15:00:00Z"),
  "started_at": ISODate("2026-07-24T14:42:00Z"),
  "completed_at": ISODate("2026-07-24T15:00:00Z"),
  "attempts": 1
}
```

### Fields
- `_id`: Unique identifier
- `student_id`: Reference to student
- `lesson_id`: Reference to lesson
- `status`: `not_started`, `in_progress`, `completed`
- `quiz_score`: Latest quiz score (percentage)
- `time_spent_minutes`: Total time spent on lesson
- `last_accessed`: Last access timestamp
- `started_at`: First access timestamp
- `completed_at`: Completion timestamp
- `attempts`: Number of quiz attempts

### Indexes
```javascript
db.student_progress.createIndex({ student_id: 1, lesson_id: 1 }, { unique: true })
db.student_progress.createIndex({ student_id: 1, status: 1 })
```

---

## Sample Data Generation

### Create Sample Student
```javascript
db.users.insertOne({
  email: "alice@school.com",
  full_name: "Alice Johnson",
  password_hash: "$2b$12$hashedpassword",
  role: "student",
  grade_level: "grade_5",
  school_id: "school_123",
  created_at: new Date(),
  is_active: true
})
```

### Create Sample Lesson
```javascript
db.lessons.insertOne({
  title: "Understanding Digital Footprints",
  description: "Learn what information you leave online",
  lesson_type: "digital_safety",
  grade_level: "grade_4",
  module_number: 2,
  lesson_number: 5,
  duration_minutes: 15,
  story_content: "Spark discovered that everything she did online left a trace...",
  learning_objectives: [
    "Define digital footprint",
    "Identify what creates a digital footprint",
    "Make smart choices about online activity"
  ],
  standards_alignment: {
    ISTE: ["1.2.d"],
    CASEL: ["Self-awareness"]
  },
  is_published: true,
  created_at: new Date()
})
```

---

## Relationships

```
users (students) ─┬─ quiz_results
                  └─ student_progress

lessons ─┬─ quizzes
         ├─ quiz_results
         └─ student_progress

schools ──── users

quizzes ──── quiz_results
```

---

## Data Retention

- **Users**: Retained until account deletion
- **Lessons**: Retained indefinitely
- **Quiz Results**: Retained for academic year + 2 years
- **Progress**: Retained for academic year + 1 year
- **Schools**: Retained until subscription cancellation + 90 days

---

## Privacy & Security

- All password fields use bcrypt hashing
- PII (Personally Identifiable Information) is encrypted at rest
- Access controlled via role-based permissions
- Audit logs maintained for all data modifications
- GDPR-compliant data export and deletion available
