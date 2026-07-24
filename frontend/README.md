# BYT Education - Frontend

Next.js frontend for the Digital Citizenship & AI Literacy platform.

## Features

- ✅ **Multi-role Dashboards**: Student, Teacher, Parent, Admin
- ✅ **Interactive Lesson Player**: Audio stories with quizzes
- ✅ **Real-time Progress Tracking**: Live updates and analytics
- ✅ **Responsive Design**: Works on desktop, tablet, and mobile
- ✅ **Auto-graded Assessments**: Instant feedback and explanations
- ✅ **Analytics & Insights**: Performance metrics and class insights
- ✅ **Parent Portal**: Track children's progress

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **UI**: React 18 + Tailwind CSS
- **State**: Zustand
- **Data Fetching**: Axios + React Query
- **Charts**: Recharts
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **TypeScript**: Full type safety

## Installation

### 1. Install Dependencies

```bash
npm install
# or
yarn install
```

### 2. Configure Environment

```bash
cp .env.local.example .env.local
# Edit .env.local with your API URL
```

### 3. Run Development Server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
frontend/
├── app/
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Landing page
│   ├── login/              # Login page
│   ├── register/           # Registration page
│   ├── student/            # Student dashboard & lessons
│   ├── teacher/            # Teacher dashboard & gradebook
│   ├── parent/             # Parent dashboard
│   └── admin/              # Admin dashboard
├── components/             # Reusable components
├── lib/
│   ├── api.ts              # API client
│   ├── store.ts            # Zustand store
│   └── utils.ts            # Utility functions
├── styles/
│   └── globals.css         # Global styles
└── public/                 # Static assets
```

## User Roles & Routes

### Student
- `/student/dashboard` - View available lessons and progress
- `/student/lesson/[id]` - Complete lessons and quizzes

### Teacher
- `/teacher/dashboard` - View class insights and gradebook
- Tabs: Overview, Gradebook, Class Insights

### Parent
- `/parent/dashboard` - Monitor children's progress
- View conversation starters for digital safety

### Admin
- `/admin/dashboard` - Platform analytics and management
- User and school management

## Key Components

### Lesson Player
- Audio story playback
- Interactive quiz with multiple choice
- Real-time grading with explanations
- Progress tracking

### Dashboards
- Role-specific views
- Performance metrics
- Visual analytics (charts)
- Quick actions

### Authentication
- JWT-based auth
- Automatic token refresh
- Protected routes
- Role-based access

## API Integration

The frontend connects to the FastAPI backend via the API client (`lib/api.ts`).

### Authentication
```typescript
import { auth } from '@/lib/api';

// Login
const data = await auth.login(email, password);

// Get current user
const user = auth.getCurrentUser();

// Logout
auth.logout();
```

### Lessons
```typescript
import { lessons } from '@/lib/api';

// Get all lessons
const data = await lessons.getAll();

// Get specific lesson
const lesson = await lessons.getById(lessonId);
```

### Quizzes
```typescript
import { quizzes } from '@/lib/api';

// Get quiz for lesson
const quiz = await quizzes.getByLesson(lessonId);

// Submit quiz
const result = await quizzes.submit({ 
  lesson_id, 
  quiz_id, 
  student_id, 
  answers 
});
```

## Styling

Uses Tailwind CSS with custom components:

```tsx
// Buttons
<button className="btn-primary">Primary</button>
<button className="btn-secondary">Secondary</button>

// Inputs
<input className="input-field" />

// Cards
<div className="card">Content</div>
<div className="lesson-card">Lesson</div>
```

## Development

```bash
# Run dev server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

## Building for Production

```bash
# Create optimized build
npm run build

# Test production build locally
npm start
```

## Docker Deployment

```bash
# Build image
docker build -t byt-education-frontend .

# Run container
docker run -d -p 3000:3000 \
  -e NEXT_PUBLIC_API_URL=https://api.yoursite.com \
  --name byt-frontend \
  byt-education-frontend
```

## Environment Variables

```bash
NEXT_PUBLIC_API_URL=http://localhost:8000  # Backend API URL
NEXT_PUBLIC_APP_NAME=BYT Education
NEXT_PUBLIC_APP_VERSION=1.0.0
```

## Features Roadmap

- [ ] Audio file uploads for lessons
- [ ] Video support
- [ ] Advanced analytics with filters
- [ ] Export reports (PDF/CSV)
- [ ] Bulk user import
- [ ] Email notifications
- [ ] Mobile app (React Native)
- [ ] Offline mode

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

Proprietary - BYT Education Platform
