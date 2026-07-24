'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth, lessons, progress } from '@/lib/api';
import { BookOpen, Trophy, Clock, TrendingUp, Shield, Brain } from 'lucide-react';
import { getLessonTypeLabel, getLessonTypeColor, getScoreBadge } from '@/lib/utils';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function StudentDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [availableLessons, setAvailableLessons] = useState<any[]>([]);
  const [studentProgress, setStudentProgress] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = auth.getCurrentUser();
    if (!currentUser || currentUser.role !== 'student') {
      router.push('/login');
      return;
    }
    setUser(currentUser);
    loadData(currentUser.id);
  }, [router]);

  const loadData = async (studentId: string) => {
    try {
      const [lessonsData, progressData] = await Promise.all([
        lessons.getAll(),
        progress.getStudentProgress(studentId),
      ]);
      setAvailableLessons(lessonsData.lessons || []);
      setStudentProgress(progressData);
    } catch (error: any) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    auth.logout();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const completedLessons = studentProgress?.progress?.filter((p: any) => p.status === 'completed').length || 0;
  const totalLessons = availableLessons.length;
  const averageScore = studentProgress?.progress?.reduce((acc: number, p: any) => 
    acc + (p.quiz_score || 0), 0) / (completedLessons || 1);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user?.full_name}!</h1>
              <p className="text-gray-600">Ready to learn something new today?</p>
            </div>
            <button onClick={handleLogout} className="btn-secondary">
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={<BookOpen className="w-8 h-8 text-blue-600" />}
            label="Lessons Completed"
            value={`${completedLessons}/${totalLessons}`}
            color="bg-blue-50"
          />
          <StatCard
            icon={<Trophy className="w-8 h-8 text-yellow-600" />}
            label="Average Score"
            value={`${Math.round(averageScore)}%`}
            color="bg-yellow-50"
          />
          <StatCard
            icon={<TrendingUp className="w-8 h-8 text-green-600" />}
            label="Progress"
            value={`${Math.round((completedLessons / totalLessons) * 100)}%`}
            color="bg-green-50"
          />
          <StatCard
            icon={<Clock className="w-8 h-8 text-purple-600" />}
            label="Time Spent"
            value={`${completedLessons * 15} min`}
            color="bg-purple-50"
          />
        </div>

        {/* Lessons Grid */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6">Available Lessons</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableLessons.map((lesson) => {
              const lessonProgress = studentProgress?.progress?.find((p: any) => p.lesson_id === lesson.id);
              return (
                <LessonCard key={lesson.id} lesson={lesson} progress={lessonProgress} />
              );
            })}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="card">
          <h2 className="text-2xl font-bold mb-6">Recent Activity</h2>
          <div className="space-y-4">
            {studentProgress?.progress?.slice(0, 5).map((p: any) => (
              <div key={p.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <BookOpen className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="font-medium">{p.lesson_title}</p>
                    <p className="text-sm text-gray-600">{p.status}</p>
                  </div>
                </div>
                {p.quiz_score && (
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreBadge(p.quiz_score).color}`}>
                    {p.quiz_score}%
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

function StatCard({ icon, label, value, color }: any) {
  return (
    <div className={`card ${color}`}>
      <div className="flex items-center gap-4">
        <div>{icon}</div>
        <div>
          <p className="text-sm text-gray-600 font-medium">{label}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  );
}

function LessonCard({ lesson, progress }: any) {
  const isCompleted = progress?.status === 'completed';
  const inProgress = progress?.status === 'in_progress';

  return (
    <Link href={`/student/lesson/${lesson.id}`}>
      <div className="lesson-card relative">
        {isCompleted && (
          <div className="absolute top-4 right-4">
            <Trophy className="w-6 h-6 text-yellow-500" />
          </div>
        )}
        
        <div className="mb-4">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getLessonTypeColor(lesson.lesson_type)}`}>
            {getLessonTypeLabel(lesson.lesson_type)}
          </span>
        </div>

        <h3 className="text-xl font-bold mb-2">{lesson.title}</h3>
        <p className="text-gray-600 mb-4 line-clamp-2">{lesson.description}</p>

        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>{lesson.duration_minutes} min</span>
          </div>
          <div>
            Module {lesson.module_number} · Lesson {lesson.lesson_number}
          </div>
        </div>

        {progress?.quiz_score && (
          <div className="mt-4 pt-4 border-t">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Your score:</span>
              <span className={`font-bold ${getScoreBadge(progress.quiz_score).color} px-3 py-1 rounded-full text-sm`}>
                {progress.quiz_score}%
              </span>
            </div>
          </div>
        )}

        <div className="mt-4">
          <button className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
            isCompleted 
              ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' 
              : 'bg-primary-600 text-white hover:bg-primary-700'
          }`}>
            {isCompleted ? 'Review Lesson' : inProgress ? 'Continue' : 'Start Lesson'}
          </button>
        </div>
      </div>
    </Link>
  );
}
