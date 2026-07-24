'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth, teacher, lessons } from '@/lib/api';
import { Users, BookOpen, TrendingUp, Award, Clock, Target } from 'lucide-react';
import toast from 'react-hot-toast';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function TeacherDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [gradebook, setGradebook] = useState<any>(null);
  const [insights, setInsights] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'gradebook' | 'insights'>('overview');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = auth.getCurrentUser();
    if (!currentUser || currentUser.role !== 'teacher') {
      router.push('/login');
      return;
    }
    setUser(currentUser);
    loadData();
  }, [router]);

  const loadData = async () => {
    try {
      const [gradebookData, insightsData] = await Promise.all([
        teacher.getGradebook(),
        teacher.getClassInsights('default-class'), // In real app, would have actual class IDs
      ]);
      setGradebook(gradebookData);
      setInsights(insightsData);
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
          <p className="text-gray-600">Loading teacher dashboard...</p>
        </div>
      </div>
    );
  }

  const totalStudents = gradebook?.students?.length || 0;
  const averageScore = gradebook?.students?.reduce((acc: number, s: any) => acc + s.average_score, 0) / (totalStudents || 1);
  const totalLessons = insights?.insights?.length || 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Teacher Dashboard</h1>
              <p className="text-gray-600">Welcome, {user?.full_name}</p>
            </div>
            <button onClick={handleLogout} className="btn-secondary">
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-8">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-4 px-2 border-b-2 font-medium transition-colors ${
                activeTab === 'overview'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('gradebook')}
              className={`py-4 px-2 border-b-2 font-medium transition-colors ${
                activeTab === 'gradebook'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Gradebook
            </button>
            <button
              onClick={() => setActiveTab('insights')}
              className={`py-4 px-2 border-b-2 font-medium transition-colors ${
                activeTab === 'insights'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Class Insights
            </button>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <StatCard
                icon={<Users className="w-8 h-8 text-blue-600" />}
                label="Total Students"
                value={totalStudents}
                color="bg-blue-50"
              />
              <StatCard
                icon={<BookOpen className="w-8 h-8 text-purple-600" />}
                label="Lessons Published"
                value={totalLessons}
                color="bg-purple-50"
              />
              <StatCard
                icon={<TrendingUp className="w-8 h-8 text-green-600" />}
                label="Class Average"
                value={`${Math.round(averageScore)}%`}
                color="bg-green-50"
              />
              <StatCard
                icon={<Award className="w-8 h-8 text-yellow-600" />}
                label="Top Performers"
                value={gradebook?.students?.filter((s: any) => s.average_score >= 90).length || 0}
                color="bg-yellow-50"
              />
            </div>

            {/* Performance Chart */}
            <div className="card mb-8">
              <h2 className="text-2xl font-bold mb-6">Student Performance Overview</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={gradebook?.students?.slice(0, 10) || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="full_name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="average_score" fill="#0ea5e9" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Quick Actions */}
            <div className="card">
              <h2 className="text-2xl font-bold mb-6">Quick Actions</h2>
              <div className="grid md:grid-cols-3 gap-4">
                <button className="p-6 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors text-left">
                  <BookOpen className="w-8 h-8 text-primary-600 mb-3" />
                  <h3 className="font-bold mb-1">Create Lesson</h3>
                  <p className="text-sm text-gray-600">Add a new lesson to the curriculum</p>
                </button>
                <button className="p-6 bg-green-50 rounded-lg hover:bg-green-100 transition-colors text-left">
                  <Target className="w-8 h-8 text-green-600 mb-3" />
                  <h3 className="font-bold mb-1">Create Quiz</h3>
                  <p className="text-sm text-gray-600">Design assessments for students</p>
                </button>
                <button className="p-6 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors text-left">
                  <TrendingUp className="w-8 h-8 text-purple-600 mb-3" />
                  <h3 className="font-bold mb-1">View Reports</h3>
                  <p className="text-sm text-gray-600">Generate detailed analytics</p>
                </button>
              </div>
            </div>
          </>
        )}

        {/* Gradebook Tab */}
        {activeTab === 'gradebook' && (
          <div className="card">
            <h2 className="text-2xl font-bold mb-6">Student Gradebook</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b-2">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Student Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Lessons Completed
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Average Score
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {gradebook?.students?.map((student: any) => (
                    <tr key={student.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">{student.full_name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {student.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {student.quiz_results?.length || 0}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`font-bold ${getScoreColor(student.average_score)}`}>
                          {Math.round(student.average_score)}%
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          student.average_score >= 90
                            ? 'bg-green-100 text-green-800'
                            : student.average_score >= 75
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {student.average_score >= 90 ? 'Excellent' : student.average_score >= 75 ? 'Good' : 'Needs Support'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Insights Tab */}
        {activeTab === 'insights' && (
          <div className="space-y-6">
            {insights?.insights?.map((insight: any) => (
              <div key={insight.lesson_id} className="card">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold">{insight.lesson_title}</h3>
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary-600">{insight.average_score}%</div>
                      <div className="text-sm text-gray-600">Avg Score</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{insight.completion_rate}%</div>
                      <div className="text-sm text-gray-600">Completion</div>
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Progress</p>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-600 h-2 rounded-full"
                          style={{ width: `${insight.completion_rate}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium">
                        {insight.completed}/{insight.total_students}
                      </span>
                    </div>
                  </div>

                  {insight.students_struggled.length > 0 && (
                    <div>
                      <p className="text-sm text-gray-600 mb-2">Students needing support:</p>
                      <div className="flex flex-wrap gap-2">
                        {insight.students_struggled.slice(0, 3).map((s: any) => (
                          <span key={s.student_id} className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">
                            {s.score}%
                          </span>
                        ))}
                        {insight.students_struggled.length > 3 && (
                          <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                            +{insight.students_struggled.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
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

function getScoreColor(score: number) {
  if (score >= 90) return 'text-green-600';
  if (score >= 75) return 'text-blue-600';
  if (score >= 60) return 'text-yellow-600';
  return 'text-red-600';
}
