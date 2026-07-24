# BYT Education Platform

A comprehensive end-to-end Digital Citizenship & AI Literacy platform for primary and middle schools. Built to teach students how to stay safe online, use AI responsibly, and make smart digital choices.

![Platform Overview](https://img.shields.io/badge/Status-Production%20Ready-success)
![License](https://img.shields.io/badge/License-Proprietary-blue)
![Tech Stack](https://img.shields.io/badge/Stack-Next.js%20%7C%20FastAPI%20%7C%20MongoDB-orange)

## 🎯 Features

### For Students
- 📚 **Interactive 15-minute lessons** with character-driven stories
- 🎮 **Auto-graded quizzes** with instant feedback
- 🏆 **Progress tracking** across digital safety and AI literacy
- 🎧 **Audio story playback** for accessible learning

### For Teachers
- 📊 **Live gradebook** with class analytics
- 📈 **Class insights** showing student performance
- 🎯 **Standards alignment** (ISTE, CASEL, UNESCO, CBSE)
- ⚡ **Zero prep** - ready-to-teach lessons

### For Parents
- 👨‍👩‍👧 **Child progress monitoring** with detailed metrics
- 💬 **Conversation starters** for digital safety discussions
- 📱 **Activity history** and performance tracking
- 🔒 **Privacy-first** design (GDPR, COPPA compliant)

### For Administrators
- 🏫 **School management** with multi-tenant support
- 📊 **Platform analytics** and reporting
- 👥 **User management** across all roles
- 🎓 **Curriculum publishing** and quality control

## 🏗️ Architecture

```
digital-citizenship-platform/
├── frontend/          # Next.js 14 (React + TypeScript)
├── backend/           # FastAPI (Python 3.11+)
├── database-schemas/  # MongoDB schemas and documentation
├── docs/              # Additional documentation
├── docker-compose.yml # Full stack orchestration
└── README.md          # This file
```

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18+ and npm
- **Python** 3.11+
- **MongoDB** 7.0+
- **Docker** (optional, for containerized deployment)

### Option 1: Docker (Recommended)

```bash
# Clone the repository
git clone <repository-url>
cd digital-citizenship-platform

# Start all services with Docker Compose
docker-compose up -d

# Access the application
Frontend: http://localhost:3000
Backend API: http://localhost:8000
API Docs: http://localhost:8000/docs
```

### Option 2: Manual Setup

#### 1. Start MongoDB

```bash
# Using Docker
docker run -d -p 27017:27017 --name mongodb mongo:7.0

# Or install MongoDB locally
brew install mongodb-community  # macOS
```

#### 2. Setup Backend

```bash
cd backend

# Create virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env with your settings

# Run the server
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Backend will be available at: **http://localhost:8000**

#### 3. Setup Frontend

```bash
cd frontend

# Install dependencies
npm install

# Configure environment
cp .env.local.example .env.local
# Edit .env.local with API URL

# Run development server
npm run dev
```

Frontend will be available at: **http://localhost:3000**

## 📚 Documentation

- **[Backend API Documentation](./backend/README.md)** - FastAPI endpoints and usage
- **[Frontend Documentation](./frontend/README.md)** - Next.js app structure and components
- **[Database Schemas](./database-schemas/README.md)** - MongoDB collections and relationships
- **[API Reference](http://localhost:8000/docs)** - Interactive Swagger docs (when running)

## 🔐 Default Credentials

After initializing the database, you can log in with:

```
Email: admin@byt.education
Password: admin123
```

**⚠️ Change this password immediately in production!**

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **UI Library**: React 18
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Data Fetching**: Axios + React Query
- **Charts**: Recharts
- **TypeScript**: Full type safety

### Backend
- **Framework**: FastAPI 0.104+
- **Database**: MongoDB with Motor (async driver)
- **Authentication**: JWT with bcrypt
- **Validation**: Pydantic v2
- **API Docs**: Auto-generated with Swagger/OpenAPI

### Database
- **MongoDB** 7.0 - NoSQL document database
- **Collections**: users, schools, lessons, quizzes, quiz_results, student_progress

### Infrastructure
- **Containerization**: Docker + Docker Compose
- **Deployment**: Ready for cloud deployment (AWS, GCP, Azure)

## 📖 User Guide

### Student Workflow
1. **Register/Login** with student role
2. **Browse lessons** in dashboard by grade level and type
3. **Start lesson** - read/listen to story
4. **Take quiz** - answer questions
5. **View results** - get instant feedback with explanations
6. **Track progress** - see completion percentage and scores

### Teacher Workflow
1. **Login** as teacher
2. **View gradebook** - see all student scores
3. **Monitor class insights** - identify struggling students
4. **Create lessons/quizzes** (if admin-approved)
5. **Generate reports** - export class performance

### Parent Workflow
1. **Login** as parent
2. **View children** - see all linked student accounts
3. **Monitor progress** - track lesson completion and scores
4. **Use conversation starters** - discuss digital safety at home

### Admin Workflow
1. **Login** as admin
2. **Manage schools** - create/edit school accounts
3. **Publish lessons** - review and approve content
4. **View analytics** - platform-wide metrics
5. **Manage users** - create/disable accounts

## 🔒 Security & Privacy

- ✅ **Bcrypt password hashing** (12 rounds)
- ✅ **JWT authentication** with token expiration
- ✅ **Role-based access control (RBAC)**
- ✅ **CORS protection** with allowed origins
- ✅ **Data minimization** (GDPR principle)
- ✅ **COPPA compliant** design
- ✅ **TLS 1.3** for production (recommended)
- ✅ **Input validation** with Pydantic
- ✅ **SQL injection protection** (NoSQL database)

## 📊 Curriculum

### Digital Safety Track
- Module 1: Passwords & Account Security
- Module 2: Privacy & Personal Information
- Module 3: Digital Footprint
- Module 4: Online Safety & Cyberbullying
- Module 5: Critical Thinking Online

### Responsible AI Track
- Module 1: What is AI?
- Module 2: AI in Daily Life
- Module 3: Bias & Fairness
- Module 4: Ethical AI Use
- Module 5: Evaluating AI Outputs

## 🧪 Testing

### Backend Tests
```bash
cd backend
pytest
```

### Frontend Tests
```bash
cd frontend
npm test
```

## 📦 Deployment

### Production Checklist

#### Backend
- [ ] Change `SECRET_KEY` in production
- [ ] Set `DEBUG=False`
- [ ] Use production MongoDB (e.g., MongoDB Atlas)
- [ ] Enable HTTPS/TLS
- [ ] Configure CORS for production domain
- [ ] Set up monitoring (Sentry, etc.)
- [ ] Enable rate limiting
- [ ] Set up automated backups

#### Frontend
- [ ] Set `NEXT_PUBLIC_API_URL` to production API
- [ ] Build optimized production bundle
- [ ] Configure CDN for static assets
- [ ] Enable analytics (if desired)
- [ ] Set up error tracking

### Docker Production Deployment

```bash
# Build production images
docker-compose -f docker-compose.prod.yml build

# Deploy with production config
docker-compose -f docker-compose.prod.yml up -d
```

### Cloud Deployment Options

- **Vercel** (Frontend) + **Railway/Render** (Backend) + **MongoDB Atlas** (Database)
- **AWS**: ECS + RDS + CloudFront
- **GCP**: Cloud Run + Cloud SQL + CDN
- **Azure**: App Service + Cosmos DB + CDN

## 🤝 Contributing

This is a proprietary educational platform. For contribution guidelines, please contact the development team.

## 📄 License

Proprietary - BYT Education Platform. All rights reserved.

## 📞 Support

- **Email**: support@byt.education
- **Documentation**: [docs](./docs/)
- **API Issues**: [backend/README.md](./backend/README.md)
- **Frontend Issues**: [frontend/README.md](./frontend/README.md)

## 🎓 Standards Alignment

The curriculum is aligned with:
- **ISTE** (International Society for Technology in Education)
- **CASEL** (Collaborative for Academic, Social, and Emotional Learning)
- **UNESCO** Digital Literacy Framework
- **CBSE** (Central Board of Secondary Education) - India
- **Common Sense** Media Digital Citizenship
- **UNICEF** Digital Literacy Standards

## 🚧 Roadmap

- [ ] Mobile app (React Native)
- [ ] Audio file upload for lessons
- [ ] Video content support
- [ ] Advanced analytics with AI insights
- [ ] Multi-language support
- [ ] Parent mobile app
- [ ] Gamification (badges, leaderboards)
- [ ] Social learning features
- [ ] Export reports (PDF/CSV)
- [ ] SSO integration (Google, Microsoft)

## 💡 Inspiration

Built to replicate and enhance the capabilities of [byt.education](https://byt.education/), this platform empowers schools to teach digital citizenship and AI literacy effectively.

---

**Built with ❤️ for the next generation of digital citizens**
