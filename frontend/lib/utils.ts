import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date) {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function formatPercentage(value: number) {
  return `${Math.round(value)}%`;
}

export function getGradeLevelLabel(gradeLevel: string) {
  const labels: Record<string, string> = {
    grade_1: 'Grade 1',
    grade_2: 'Grade 2',
    grade_3: 'Grade 3',
    grade_4: 'Grade 4',
    grade_5: 'Grade 5',
    grade_6: 'Grade 6',
    grade_7: 'Grade 7',
    grade_8: 'Grade 8',
  };
  return labels[gradeLevel] || gradeLevel;
}

export function getLessonTypeLabel(lessonType: string) {
  const labels: Record<string, string> = {
    digital_safety: 'Digital Safety',
    responsible_ai: 'Responsible AI',
  };
  return labels[lessonType] || lessonType;
}

export function getLessonTypeColor(lessonType: string) {
  const colors: Record<string, string> = {
    digital_safety: 'bg-blue-100 text-blue-800',
    responsible_ai: 'bg-purple-100 text-purple-800',
  };
  return colors[lessonType] || 'bg-gray-100 text-gray-800';
}

export function getScoreColor(score: number) {
  if (score >= 90) return 'text-green-600';
  if (score >= 75) return 'text-blue-600';
  if (score >= 60) return 'text-yellow-600';
  return 'text-red-600';
}

export function getScoreBadge(score: number) {
  if (score >= 90) return { label: 'Excellent', color: 'bg-green-100 text-green-800' };
  if (score >= 75) return { label: 'Good', color: 'bg-blue-100 text-blue-800' };
  if (score >= 60) return { label: 'Pass', color: 'bg-yellow-100 text-yellow-800' };
  return { label: 'Needs Improvement', color: 'bg-red-100 text-red-800' };
}
