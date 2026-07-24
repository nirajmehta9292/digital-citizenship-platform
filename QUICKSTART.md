# 🚀 QUICK START GUIDE

## ⚡ Fastest Way to Run (2 minutes)

```bash
cd digital-citizenship-platform
./start.sh
```

Then open: **http://localhost:3000**

Login with:
- Email: `admin@byt.education`
- Password: `admin123`

---

## 📱 What You Can Do Immediately

### As Admin (Default Login)
1. View platform analytics
2. See total users, lessons, average scores
3. Monitor system health

### Create Other Users
Go to: http://localhost:8000/docs

Use `/auth/register` to create:

**Student:**
```json
{
  "email": "student@school.com",
  "full_name": "Alex Student",
  "role": "student",
  "password": "student123",
  "grade_level": "grade_5"
}
```

**Teacher:**
```json
{
  "email": "teacher@school.com",
  "full_name": "Jane Teacher",
  "role": "teacher",
  "password": "teacher123"
}
```

**Parent:**
```json
{
  "email": "parent@school.com",
  "full_name": "Parent Smith",
  "role": "parent",
  "password": "parent123"
}
```

### Load Sample Lessons

```bash
cd backend
source venv/bin/activate  # If using manual setup
python seed_lessons.py
```

This creates 3 ready-to-use lessons:
1. Creating Strong Passwords (Grade 4)
2. Understanding AI Assistants (Grade 5)
3. Digital Footprint Basics (Grade 3)

---

## 🎯 Test Complete Flow

### 1. Student Journey
```
Login as student → Dashboard → Click a lesson → 
Read story → Take quiz → View results with explanations
```

### 2. Teacher Journey
```
Login as teacher → View Gradebook → 
See all students and scores → Check Class Insights
```

### 3. Parent Journey
```
Login as parent → View children → 
Monitor progress and scores
```

---

## 🔗 Important URLs

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs (Interactive!)
- **Health Check**: http://localhost:8000/health

---

## 🛑 Stop & Manage

```bash
# View logs
docker-compose logs -f

# Stop all services
docker-compose down

# Restart
docker-compose up -d

# Rebuild after changes
docker-compose build
docker-compose up -d
```

---

## 📖 Full Documentation

- **Complete Setup**: [SETUP.md](./SETUP.md)
- **Project Overview**: [README.md](./README.md)
- **Architecture**: [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md)
- **API Reference**: [docs/API.md](./docs/API.md)

---

## 🆘 Quick Troubleshooting

**Can't connect to frontend?**
```bash
docker-compose logs frontend
```

**Can't connect to backend?**
```bash
docker-compose logs backend
```

**Database issues?**
```bash
docker-compose logs mongodb
```

**Reset everything:**
```bash
docker-compose down -v
./start.sh
```

---

## ✅ Feature Checklist

- [x] Student lesson player with quizzes
- [x] Teacher gradebook and analytics
- [x] Parent progress monitoring
- [x] Admin platform management
- [x] JWT authentication
- [x] Role-based access control
- [x] Auto-graded quizzes
- [x] Progress tracking
- [x] Sample lessons included
- [x] Docker deployment
- [x] API documentation
- [x] Security (bcrypt, JWT)
- [x] Responsive design

---

## 🎓 Sample Content Included

✅ **3 Complete Lessons** with stories, quizzes, and explanations
✅ **12 Quiz Questions** with detailed feedback
✅ **Multi-grade content** (Grades 3, 4, 5)
✅ **Both curriculum tracks** (Digital Safety + Responsible AI)

---

**Ready to teach digital citizenship!** 🎉
