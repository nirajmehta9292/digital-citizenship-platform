'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/api';
import { Shield, Brain, Users, TrendingUp, BookOpen, Award } from 'lucide-react';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Check if user is already logged in
    const user = auth.getCurrentUser();
    if (user) {
      // Redirect to appropriate dashboard
      switch (user.role) {
        case 'student':
          router.push('/student/dashboard');
          break;
        case 'teacher':
          router.push('/teacher/dashboard');
          break;
        case 'parent':
          router.push('/parent/dashboard');
          break;
        case 'admin':
          router.push('/admin/dashboard');
          break;
      }
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 animate-fade-in">
            Raise a generation that's{' '}
            <span className="text-primary-600">safe</span>,{' '}
            <span className="text-secondary-600">smart</span> & ready for the digital world.
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto animate-slide-up">
            One platform to teach digital citizenship and AI literacy — end to end.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/login" className="btn-primary text-lg px-8 py-4">
              Get Started
            </Link>
            <Link href="/register" className="btn-secondary text-lg px-8 py-4">
              Register School
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mt-24 grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureCard
            icon={<Shield className="w-12 h-12 text-blue-600" />}
            title="Digital Safety"
            description="Passwords, privacy, safe choices, digital footprint, and online wellbeing."
          />
          <FeatureCard
            icon={<Brain className="w-12 h-12 text-purple-600" />}
            title="Responsible AI"
            description="How AI works, bias and fairness, ethical use, and evaluating AI outputs critically."
          />
          <FeatureCard
            icon={<BookOpen className="w-12 h-12 text-green-600" />}
            title="15-Minute Lessons"
            description="Bite-size lessons with character-driven stories and interactive practice."
          />
          <FeatureCard
            icon={<TrendingUp className="w-12 h-12 text-orange-600" />}
            title="Live Progress Tracking"
            description="Real-time class mastery and standards alignment for leadership."
          />
          <FeatureCard
            icon={<Users className="w-12 h-12 text-pink-600" />}
            title="Multi-Role Support"
            description="Tailored experiences for students, teachers, parents, and administrators."
          />
          <FeatureCard
            icon={<Award className="w-12 h-12 text-indigo-600" />}
            title="Standards Aligned"
            description="Mapped to ISTE, CASEL, UNESCO, and CBSE frameworks."
          />
        </div>

        {/* Curriculum Tracks */}
        <div className="mt-24">
          <h2 className="text-4xl font-bold text-center mb-12">Two tracks. One thread. Every grade.</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="card bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
              <div className="flex items-center mb-4">
                <Shield className="w-10 h-10 text-blue-600 mr-3" />
                <h3 className="text-2xl font-bold text-blue-900">Digital Safety</h3>
              </div>
              <p className="text-blue-800 mb-4">
                Passwords, privacy, safe choices, digital footprint, online wellbeing and threat recognition.
              </p>
              <span className="text-sm font-semibold text-blue-700 bg-blue-200 px-3 py-1 rounded-full">
                PRIMARY & MIDDLE SCHOOL
              </span>
            </div>
            <div className="card bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
              <div className="flex items-center mb-4">
                <Brain className="w-10 h-10 text-purple-600 mr-3" />
                <h3 className="text-2xl font-bold text-purple-900">Responsible AI</h3>
              </div>
              <p className="text-purple-800 mb-4">
                How AI works, bias and fairness, ethical use, and evaluating AI outputs critically.
              </p>
              <span className="text-sm font-semibold text-purple-700 bg-purple-200 px-3 py-1 rounded-full">
                PRIMARY & MIDDLE SCHOOL
              </span>
            </div>
          </div>
        </div>

        {/* Footer CTA */}
        <div className="mt-24 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to bring digital citizenship to your school?</h2>
          <div className="flex gap-4 justify-center">
            <Link href="/register" className="btn-primary text-lg px-8 py-4">
              Register Now
            </Link>
            <Link href="/login" className="btn-secondary text-lg px-8 py-4">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="card hover:shadow-xl transition-shadow duration-300">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}
