'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth, parent } from '@/lib/api';
import { Users, TrendingUp, Clock, Award, BookOpen } from 'lucide-react';
import toast from 'react-hot-toast';
import { getScoreBadge } from '@/lib/utils';

export default function ParentDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [children, setChildren] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = auth.getCurrentUser();
    if (!currentUser || currentUser.role !== 'parent') {
      router.push('/login');
      return;
    }
    setUser(currentUser);
    loadChildren();
  }, [router]);

  const loadChildren = async () => {
    try {
      const data = await parent.getChildren();
      setChildren(data.children || []);
    } catch (error: any) {
      toast.error('Failed to load children data');
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
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Parent Dashboard</h1>
              <p className="text-gray-600">Welcome, {user?.full_name}</p>
            </div>
            <button onClick={handleLogout} className="btn-secondary">
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Your Children's Progress</h2>
          <p className="text-gray-600">
            Track your children's learning journey and stay connected with their digital citizenship education.
          </p>
        </div>

        {children.length === 0 ? (
          <div className="card text-center py-12">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">No Children Linked</h3>
            <p className="text-gray-600">Contact your school administrator to link your children's accounts.</p>
          </div>
        ) : (
          <div className="space-y-8">
            {children.map((child) => (
              <ChildCard key={child.id} child={child} />
            ))}
          </div>
        )}

        {/* Conversation Starters */}
        <div className="mt-12 card bg-gradient-to-br from-primary-50 to-secondary-50">
          <h2 className="text-2xl font-bold mb-6">Conversation Starters 💬</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 bg-white rounded-lg">
              <h3 className="font-bold mb-2">About Digital Safety</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• What would you do if someone you don't know tries to message you online?</li>
                <li>• How do you keep your passwords safe?</li>
                <li>• What information is okay to share online and what isn't?</li>
              </ul>
            </div>
            <div className="p-4 bg-white rounded-lg">
              <h3 className="font-bold mb-2">About AI & Technology</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• Where do you see AI being used in your daily life?</li>
                <li>• How can we tell if information from AI is accurate?</li>
                <li>• What are some good and not-so-good uses of AI?</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function ChildCard({ child }: { child: any }) {
  const completedLessons = child.progress?.filter((p: any) => p.status === 'completed').length || 0;
  const totalTimeSpent = child.progress?.reduce((acc: number, p: any) => acc + (p.time_spent_minutes || 0), 0) || 0;

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-2xl font-bold">{child.full_name}</h3>
          <p className="text-gray-600">{child.email}</p>
        </div>
        <div className="text-right">
          <div className={`text-3xl font-bold ${getScoreBadge(child.average_score).color} px-4 py-2 rounded-lg`}>
            {Math.round(child.average_score)}%
          </div>
          <p className="text-sm text-gray-600 mt-1">Average Score</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center p-4 bg-blue-50 rounded-lg">
          <BookOpen className="w-8 h-8 text-blue-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-blue-900">{completedLessons}</div>
          <div className="text-sm text-blue-700">Lessons</div>
        </div>
        <div className="text-center p-4 bg-green-50 rounded-lg">
          <Clock className="w-8 h-8 text-green-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-green-900">{totalTimeSpent}</div>
          <div className="text-sm text-green-700">Minutes</div>
        </div>
        <div className="text-center p-4 bg-purple-50 rounded-lg">
          <Award className="w-8 h-8 text-purple-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-purple-900">
            {child.quiz_results?.filter((r: any) => r.passed).length || 0}
          </div>
          <div className="text-sm text-purple-700">Passed</div>
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h4 className="font-bold mb-3">Recent Activity</h4>
        <div className="space-y-2">
          {child.quiz_results?.slice(0, 5).map((result: any) => (
            <div key={result.quiz_id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <BookOpen className="w-5 h-5 text-gray-400" />
                <span className="text-sm">Quiz completed</span>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getScoreBadge(result.percentage).color}`}>
                {result.percentage}%
              </span>
            </div>
          ))}
          {(!child.quiz_results || child.quiz_results.length === 0) && (
            <p className="text-gray-500 text-sm text-center py-4">No recent activity</p>
          )}
        </div>
      </div>
    </div>
  );
}
