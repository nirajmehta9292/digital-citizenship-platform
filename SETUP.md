# Setup Guide - BYT Education Platform

Complete step-by-step instructions to get the platform running.

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 18+ ([Download](https://nodejs.org/))
- **Python** 3.11+ ([Download](https://www.python.org/))
- **MongoDB** 7.0+ ([Download](https://www.mongodb.com/try/download/community))
- **Docker** (Optional, recommended) ([Download](https://www.docker.com/get-started))
- **Git** ([Download](https://git-scm.com/))

## 🚀 Quick Start (Docker - Recommended)

This is the fastest way to get everything running:

```bash
# 1. Navigate to project directory
cd digital-citizenship-platform

# 2. Run the quick start script
./start.sh
```

The script will:
- Build all Docker images
- Start MongoDB, Backend, and Frontend
- Initialize the database
- Display access URLs

**Access the platform:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Documentation: http://localhost:8000/docs

**Default login:**
- Email: `admin@byt.education`
- Password: `admin123` (⚠️ Change immediately!)

## 🔧 Manual Setup (Without Docker)

If you prefer to run services individually:

### Step 1: Setup MongoDB

#### Option A: Using Docker
```bash
docker run -d -p 27017:27017 --name mongodb mongo:7.0
```

#### Option B: Install Locally

**macOS:**
```bash
brew tap mongodb/brew
brew install mongodb-community@7.0
brew services start mongodb-community
```

**Ubuntu/Debian:**
```bash
wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org
sudo systemctl start mongod
```

**Windows:**
Download and install from [MongoDB Download Center](https://www.mongodb.com/try/download/community)

### Step 2: Setup Backend (FastAPI)

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python3 -m venv venv

# Activate virtual environment
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Copy environment template
cp .env.example .env

# Edit .env file with your settings
# At minimum, update:
# - SECRET_KEY (use a secure random string)
# - MONGO_URI (if not using localhost)

# Initialize database (create indexes and admin user)
python -c "from main import app; print('Database will be initialized on first run')"

# Run the development server
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Backend will be available at: **http://localhost:8000**

Interactive API docs: **http://localhost:8000/docs**

### Step 3: Seed Sample Data (Optional but Recommended)

In a new terminal, with the backend virtual environment activated:

```bash
cd backend
python seed_lessons.py
```

This will create 3 sample lessons with quizzes that you can use immediately.

### Step 4: Setup Frontend (Next.js)

```bash
# Navigate to frontend directory (new terminal)
cd frontend

# Install dependencies
npm install

# Copy environment template
cp .env.local.example .env.local

# Edit .env.local
# Update NEXT_PUBLIC_API_URL if backend is not on localhost:8000

# Run development server
npm run dev
```

Frontend will be available at: **http://localhost:3000**

## 🧪 Verify Installation

### 1. Check Backend Health

```bash
curl http://localhost:8000/health
```

Expected response:
```json
{
  "status": "healthy",
  "service": "BYT Education API",
  "timestamp": "2026-07-24T..."
}
```

### 2. Check Frontend

Open http://localhost:3000 in your browser. You should see the landing page with:
- Hero section
- Feature cards
- Curriculum tracks

### 3. Test Login

1. Go to http://localhost:3000/login
2. Enter credentials:
   - Email: `admin@byt.education`
   - Password: `admin123`
3. You should be redirected to the admin dashboard

## 📦 Production Deployment

### Build for Production

#### Frontend
```bash
cd frontend
npm run build
npm start  # Test production build
```

#### Backend
```bash
cd backend
# Update .env with production values
# Set DEBUG=False
# Use production MongoDB URL
# Change SECRET_KEY

# Install production server
pip install gunicorn

# Run with Gunicorn
gunicorn -w 4 -k uvicorn.workers.UvicornWorker main:app --bind 0.0.0.0:8000
```

### Docker Production Build

```bash
# Build images
docker-compose build

# Run in production mode
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## 🔑 Create Additional Users

### Using API (Recommended)

Use the API docs at http://localhost:8000/docs

1. Go to `/auth/register` endpoint
2. Click "Try it out"
3. Fill in user details:

```json
{
  "email": "teacher@school.com",
  "full_name": "Jane Smith",
  "role": "teacher",
  "password": "SecurePassword123!",
  "school_id": null,
  "grade_level": null
}
```

4. Click "Execute"

### Using Python Script

Create a file `create_user.py`:

```python
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

async def create_user():
    client = AsyncIOMotorClient("mongodb://localhost:27017")
    db = client["byt_education"]
    
    user = {
        "email": "student@school.com",
        "full_name": "John Doe",
        "role": "student",
        "password_hash": pwd_context.hash("student123"),
        "grade_level": "grade_5",
        "created_at": datetime.utcnow(),
        "is_active": True
    }
    
    await db.users.insert_one(user)
    print(f"✅ Created user: {user['email']}")
    client.close()

asyncio.run(create_user())
```

## 🐛 Troubleshooting

### Backend won't start

**Error: "ModuleNotFoundError"**
- Solution: Make sure virtual environment is activated and dependencies are installed
```bash
source venv/bin/activate
pip install -r requirements.txt
```

**Error: "Connection refused" (MongoDB)**
- Solution: Ensure MongoDB is running
```bash
# Check if MongoDB is running
ps aux | grep mongod  # Linux/macOS
# Or
docker ps | grep mongo  # Docker
```

### Frontend won't start

**Error: "Module not found"**
- Solution: Delete node_modules and reinstall
```bash
rm -rf node_modules package-lock.json
npm install
```

**Error: "Port 3000 already in use"**
- Solution: Kill the process or use a different port
```bash
lsof -ti:3000 | xargs kill -9  # macOS/Linux
# Or run on different port
PORT=3001 npm run dev
```

### Database Issues

**Error: "Collection not found"**
- Solution: Initialize database by starting the backend once
```bash
cd backend
source venv/bin/activate
uvicorn main:app --reload
# Wait for startup, then Ctrl+C
```

**Need to reset database?**
```bash
# Drop all collections
mongosh
use byt_education
db.dropDatabase()
exit

# Restart backend to reinitialize
```

### Docker Issues

**Error: "Cannot connect to Docker daemon"**
- Solution: Start Docker Desktop

**Containers won't start**
```bash
# View logs
docker-compose logs

# Rebuild from scratch
docker-compose down -v
docker-compose build --no-cache
docker-compose up
```

## 📊 Next Steps

After installation:

1. **Change default password**
   - Log in as admin
   - Change password immediately

2. **Create school accounts**
   - Use admin dashboard to create schools

3. **Add teachers and students**
   - Use registration or admin panel

4. **Create lessons**
   - Use the lesson creation interface
   - Or seed sample lessons

5. **Customize branding**
   - Update logos and colors in frontend
   - Modify `tailwind.config.js` for theme

6. **Configure email (optional)**
   - Set up SMTP in backend `.env`
   - Enable email notifications

## 📚 Additional Resources

- **Backend API Docs**: http://localhost:8000/docs
- **Project README**: [README.md](./README.md)
- **Frontend Docs**: [frontend/README.md](./frontend/README.md)
- **Backend Docs**: [backend/README.md](./backend/README.md)
- **Database Schemas**: [database-schemas/README.md](./database-schemas/README.md)

## 💬 Support

If you encounter issues:

1. Check this setup guide
2. Review error logs (`docker-compose logs` or terminal output)
3. Check the troubleshooting section
4. Review the README files for specific components

## ✅ Installation Checklist

- [ ] Prerequisites installed (Node.js, Python, MongoDB)
- [ ] MongoDB running
- [ ] Backend running (http://localhost:8000/health returns OK)
- [ ] Frontend running (http://localhost:3000 accessible)
- [ ] Can log in with default credentials
- [ ] Sample lessons seeded (optional)
- [ ] Changed default admin password
- [ ] Created test student/teacher accounts

---

**Congratulations! Your BYT Education platform is ready! 🎉**
