'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth, analytics } from '@/lib/api';
import { Users, BookOpen, School, TrendingUp, Activity, Award } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = auth.getCurrentUser();
    if (!currentUser || currentUser.role !== 'admin') {
      router.push('/login');
      return;
    }
    setUser(currentUser);
    loadStats();
  }, [router]);

  const loadStats = async () => {
    try {
      const data = await analytics.getOverview();
      setStats(data);
    } catch (error: any) {
      toast.error('Failed to load analytics');
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
          <p className="text-gray-600">Loading admin dashboard...</p>
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
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600">Welcome, {user?.full_name}</p>
            </div>
            <button onClick={handleLogout} className="btn-secondary">
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard
            icon={<Users className="w-10 h-10 text-blue-600" />}
            label="Total Users"
            value={stats?.total_users || 0}
            sublabel={`${stats?.total_students || 0} students, ${stats?.total_teachers || 0} teachers`}
            color="bg-gradient-to-br from-blue-50 to-blue-100"
          />
          <StatCard
            icon={<BookOpen className="w-10 h-10 text-purple-600" />}
            label="Published Lessons"
            value={stats?.total_lessons || 0}
            sublabel={`${stats?.total_quizzes_completed || 0} quizzes completed`}
            color="bg-gradient-to-br from-purple-50 to-purple-100"
          />
          <StatCard
            icon={<TrendingUp className="w-10 h-10 text-green-600" />}
            label="Platform Average"
            value={`${stats?.platform_average_score || 0}%`}
            sublabel="Overall student performance"
            color="bg-gradient-to-br from-green-50 to-green-100"
          />
        </div>

        {/* Admin Actions */}
        <div className="card mb-8">
          <h2 className="text-2xl font-bold mb-6">Quick Actions</h2>
          <div className="grid md:grid-cols-4 gap-4">
            <ActionCard
              icon={<School className="w-8 h-8" />}
              title="Manage Schools"
              description="Add or edit school accounts"
              color="bg-blue-50 text-blue-700 hover:bg-blue-100"
            />
            <ActionCard
              icon={<BookOpen className="w-8 h-8" />}
              title="Publish Lessons"
              description="Review and publish content"
              color="bg-purple-50 text-purple-700 hover:bg-purple-100"
            />
            <ActionCard
              icon={<Users className="w-8 h-8" />}
              title="User Management"
              description="Manage user accounts"
              color="bg-green-50 text-green-700 hover:bg-green-100"
            />
            <ActionCard
              icon={<Activity className="w-8 h-8" />}
              title="View Analytics"
              description="Detailed platform metrics"
              color="bg-orange-50 text-orange-700 hover:bg-orange-100"
            />
          </div>
        </div>

        {/* Platform Health */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="card">
            <h3 className="text-xl font-bold mb-4">Platform Health</h3>
            <div className="space-y-4">
              <HealthMetric label="API Status" value="Healthy" status="success" />
              <HealthMetric label="Database" value="Connected" status="success" />
              <HealthMetric label="Active Sessions" value={stats?.total_users || 0} status="info" />
            </div>
          </div>

          <div className="card">
            <h3 className="text-xl font-bold mb-4">Recent Activity</h3>
            <div className="space-y-3">
              <ActivityItem 
                icon={<Users className="w-5 h-5 text-blue-600" />}
                text="New student registered"
                time="2 minutes ago"
              />
              <ActivityItem 
                icon={<BookOpen className="w-5 h-5 text-purple-600" />}
                text="Lesson completed"
                time="5 minutes ago"
              />
              <ActivityItem 
                icon={<Award className="w-5 h-5 text-yellow-600" />}
                text="Quiz passed with 95%"
                time="10 minutes ago"
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function StatCard({ icon, label, value, sublabel, color }: any) {
  return (
    <div className={`card ${color} border-0`}>
      <div className="flex items-start justify-between mb-4">
        <div>{icon}</div>
      </div>
      <div>
        <p className="text-sm font-medium text-gray-600 mb-1">{label}</p>
        <p className="text-3xl font-bold text-gray-900 mb-1">{value}</p>
        <p className="text-xs text-gray-600">{sublabel}</p>
      </div>
    </div>
  );
}

function ActionCard({ icon, title, description, color }: any) {
  return (
    <button className={`p-6 rounded-lg transition-colors text-left ${color}`}>
      <div className="mb-3">{icon}</div>
      <h3 className="font-bold mb-1">{title}</h3>
      <p className="text-sm opacity-80">{description}</p>
    </button>
  );
}

function HealthMetric({ label, value, status }: any) {
  const colors = {
    success: 'bg-green-100 text-green-800',
    info: 'bg-blue-100 text-blue-800',
    warning: 'bg-yellow-100 text-yellow-800',
  };

  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
      <span className="font-medium text-gray-700">{label}</span>
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${colors[status as keyof typeof colors]}`}>
        {value}
      </span>
    </div>
  );
}

function ActivityItem({ icon, text, time }: any) {
  return (
    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
      <div>{icon}</div>
      <div className="flex-1">
        <p className="text-sm font-medium">{text}</p>
        <p className="text-xs text-gray-500">{time}</p>
      </div>
    </div>
  );
}
