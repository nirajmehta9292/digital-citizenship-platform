# Project Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                         BYT Education Platform                       │
│                  Digital Citizenship & AI Literacy                   │
└─────────────────────────────────────────────────────────────────────┘

┌──────────────┐       ┌──────────────┐       ┌──────────────┐
│   Students   │       │   Teachers   │       │   Parents    │
│   Browsers   │       │   Browsers   │       │   Browsers   │
└──────┬───────┘       └──────┬───────┘       └──────┬───────┘
       │                      │                       │
       └──────────────────────┼───────────────────────┘
                              │
                    ┌─────────▼─────────┐
                    │  Next.js Frontend  │
                    │   (Port 3000)     │
                    │  - React 18       │
                    │  - Tailwind CSS   │
                    │  - TypeScript     │
                    └─────────┬─────────┘
                              │
                    ┌─────────▼─────────┐
                    │   FastAPI Backend  │
                    │   (Port 8000)     │
                    │  - Python 3.11+   │
                    │  - JWT Auth       │
                    │  - Pydantic       │
                    └─────────┬─────────┘
                              │
                    ┌─────────▼─────────┐
                    │   MongoDB Atlas    │
                    │   (Port 27017)    │
                    │  - Document DB    │
                    │  - Motor Driver   │
                    └───────────────────┘
```

## Component Architecture

### Frontend (Next.js)

```
frontend/
├── app/
│   ├── layout.tsx                 # Root layout
│   ├── page.tsx                   # Landing page
│   ├── login/                     # Authentication
│   ├── register/
│   ├── student/
│   │   ├── dashboard/            # Student dashboard
│   │   └── lesson/[id]/          # Lesson player
│   ├── teacher/
│   │   └── dashboard/            # Gradebook & insights
│   ├── parent/
│   │   └── dashboard/            # Child monitoring
│   └── admin/
│       └── dashboard/            # Platform management
├── lib/
│   ├── api.ts                    # API client
│   ├── store.ts                  # State management
│   └── utils.ts                  # Helper functions
└── styles/
    └── globals.css               # Tailwind styles
```

**Key Technologies:**
- **Next.js 14**: App Router, Server Components, API Routes
- **React 18**: Hooks, Context, Suspense
- **Tailwind CSS**: Utility-first styling
- **Zustand**: Lightweight state management
- **Axios**: HTTP client with interceptors
- **React Query**: Data fetching and caching
- **Recharts**: Data visualization

### Backend (FastAPI)

```
backend/
├── main.py                       # FastAPI app
├── models.py                     # Pydantic models
├── auth.py                       # JWT authentication
├── database.py                   # MongoDB connection
├── routers/
│   ├── auth.py                  # Auth endpoints
│   ├── lessons.py               # Lesson CRUD
│   ├── quizzes.py               # Quiz management
│   ├── progress.py              # Progress tracking
│   ├── teacher.py               # Teacher endpoints
│   ├── parent.py                # Parent endpoints
│   └── admin.py                 # Admin endpoints
└── seed_lessons.py              # Sample data
```

**Key Technologies:**
- **FastAPI**: Modern async web framework
- **Motor**: Async MongoDB driver
- **Pydantic**: Data validation
- **PyJWT**: JWT token handling
- **Passlib**: Password hashing (bcrypt)
- **Python-JOSE**: Cryptographic operations

### Database (MongoDB)

```
Collections:
├── users                        # All user accounts
├── schools                      # School information
├── lessons                      # Lesson content
├── quizzes                      # Quiz questions
├── quiz_results                 # Student submissions
└── student_progress             # Progress tracking
```

## Data Flow

### Student Taking a Lesson

```
1. Student → Frontend: Click lesson
   ↓
2. Frontend → Backend: GET /lessons/{id}
   ↓
3. Backend → MongoDB: Find lesson
   ↓
4. MongoDB → Backend: Return lesson data
   ↓
5. Backend → Frontend: Lesson with story
   ↓
6. Student reads story → Frontend
   ↓
7. Frontend → Backend: GET /quizzes/lesson/{id}
   ↓
8. Backend → MongoDB: Find quiz
   ↓
9. Student answers → Frontend
   ↓
10. Frontend → Backend: POST /quizzes/submit
   ↓
11. Backend: Grade quiz, calculate score
   ↓
12. Backend → MongoDB: Save quiz_result & update progress
   ↓
13. Backend → Frontend: Return results
   ↓
14. Frontend: Display score and feedback
```

### Teacher Viewing Gradebook

```
1. Teacher → Frontend: View gradebook
   ↓
2. Frontend → Backend: GET /teacher/gradebook
   ↓
3. Backend → MongoDB: Aggregate student data
   ↓
4. MongoDB: Join users + quiz_results
   ↓
5. Backend: Calculate averages
   ↓
6. Backend → Frontend: Return gradebook data
   ↓
7. Frontend: Display table with charts
```

## Authentication Flow

```
┌─────────┐                ┌─────────┐              ┌──────────┐
│ Browser │                │ Backend │              │ MongoDB  │
└────┬────┘                └────┬────┘              └────┬─────┘
     │                          │                        │
     │  POST /auth/login        │                        │
     │  {email, password}       │                        │
     ├─────────────────────────>│                        │
     │                          │                        │
     │                          │  Find user by email    │
     │                          ├───────────────────────>│
     │                          │                        │
     │                          │  Return user data      │
     │                          │<───────────────────────┤
     │                          │                        │
     │                          │  Verify password       │
     │                          │  (bcrypt compare)      │
     │                          │                        │
     │                          │  Generate JWT token    │
     │                          │  (sign with SECRET_KEY)│
     │                          │                        │
     │  Return token + user     │                        │
     │<─────────────────────────┤                        │
     │                          │                        │
     │  Store in localStorage   │                        │
     │                          │                        │
     │  Future requests:        │                        │
     │  Authorization: Bearer   │                        │
     │  <token>                 │                        │
     ├─────────────────────────>│                        │
     │                          │                        │
     │                          │  Verify JWT            │
     │                          │  Extract user info     │
     │                          │                        │
```

## Security Architecture

### Defense Layers

```
┌──────────────────────────────────────────────────┐
│                   HTTPS/TLS                       │
│              (Production Only)                    │
└────────────────────┬─────────────────────────────┘
                     │
┌────────────────────▼─────────────────────────────┐
│              CORS Protection                      │
│        (Allowed origins configured)               │
└────────────────────┬─────────────────────────────┘
                     │
┌────────────────────▼─────────────────────────────┐
│           JWT Authentication                      │
│     (Token validation on each request)            │
└────────────────────┬─────────────────────────────┘
                     │
┌────────────────────▼─────────────────────────────┐
│       Role-Based Access Control                   │
│    (Student/Teacher/Parent/Admin)                 │
└────────────────────┬─────────────────────────────┘
                     │
┌────────────────────▼─────────────────────────────┐
│          Input Validation                         │
│         (Pydantic models)                         │
└────────────────────┬─────────────────────────────┘
                     │
┌────────────────────▼─────────────────────────────┐
│         Password Hashing                          │
│          (Bcrypt, 12 rounds)                      │
└──────────────────────────────────────────────────┘
```

## Deployment Architecture

### Development
```
Laptop/Workstation
├── Frontend: localhost:3000
├── Backend: localhost:8000
└── MongoDB: localhost:27017
```

### Production (Recommended)

```
                    ┌──────────────┐
                    │  CloudFlare  │
                    │     CDN      │
                    └──────┬───────┘
                           │
            ┌──────────────┴──────────────┐
            │                             │
    ┌───────▼────────┐          ┌────────▼────────┐
    │    Vercel      │          │   Railway/      │
    │   (Frontend)   │          │   Render        │
    │   Next.js      │◄────────►│   (Backend)     │
    │   Static CDN   │   API    │   FastAPI       │
    └────────────────┘          └────────┬────────┘
                                         │
                                ┌────────▼────────┐
                                │  MongoDB Atlas  │
                                │   (Database)    │
                                │   Replicas      │
                                └─────────────────┘
```

## Scalability Considerations

### Horizontal Scaling
- **Frontend**: Static export to CDN (Vercel, Cloudflare)
- **Backend**: Multiple instances behind load balancer
- **Database**: MongoDB sharding for large datasets

### Caching Strategy
- **Browser**: LocalStorage for user data
- **API**: Redis for frequently accessed data (future)
- **Database**: Indexed queries for performance

### Performance Optimizations
- **Frontend**: Code splitting, lazy loading, image optimization
- **Backend**: Async operations, connection pooling
- **Database**: Compound indexes on frequent queries

## Monitoring & Logging

```
┌─────────────────────────────────────────────┐
│           Application Monitoring             │
├─────────────────────────────────────────────┤
│  Frontend: Browser console, Error tracking  │
│  Backend: Server logs, API metrics          │
│  Database: Query performance, indexes       │
└─────────────────────────────────────────────┘
```

**Recommended Tools:**
- **Sentry**: Error tracking
- **Datadog**: APM and metrics
- **MongoDB Atlas**: Built-in monitoring
- **Vercel Analytics**: Frontend performance

## Backup & Recovery

```
┌─────────────────────────────────────────────┐
│              Backup Strategy                 │
├─────────────────────────────────────────────┤
│  MongoDB: Daily automated backups            │
│  Retention: 30 days                          │
│  Testing: Monthly restore drills             │
│  Disaster Recovery: 4-hour RTO               │
└─────────────────────────────────────────────┘
```

---

## Tech Stack Summary

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Frontend Framework | Next.js 14 | React framework with SSR |
| UI Library | React 18 | Component-based UI |
| Styling | Tailwind CSS | Utility-first CSS |
| State Management | Zustand | Lightweight global state |
| Data Fetching | Axios + React Query | API client and caching |
| Charts | Recharts | Data visualization |
| Backend Framework | FastAPI | Modern async Python API |
| Database | MongoDB | NoSQL document database |
| ODM | Motor | Async MongoDB driver |
| Authentication | JWT + Bcrypt | Secure auth tokens |
| Validation | Pydantic | Data validation |
| Containerization | Docker | Consistent environments |
| Orchestration | Docker Compose | Multi-container apps |

---

This architecture is designed for:
- ✅ **Scalability**: Handle thousands of concurrent users
- ✅ **Security**: Multi-layer protection
- ✅ **Performance**: Async operations, caching
- ✅ **Maintainability**: Clean separation of concerns
- ✅ **Developer Experience**: Modern tooling, TypeScript
