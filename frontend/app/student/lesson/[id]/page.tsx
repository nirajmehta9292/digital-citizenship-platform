'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { auth, lessons, quizzes, progress } from '@/lib/api';
import { ArrowLeft, Play, Pause, CheckCircle, XCircle } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function LessonPage() {
  const router = useRouter();
  const params = useParams();
  const lessonId = params.id as string;

  const [user, setUser] = useState<any>(null);
  const [lesson, setLesson] = useState<any>(null);
  const [quiz, setQuiz] = useState<any>(null);
  const [currentStep, setCurrentStep] = useState<'story' | 'quiz' | 'results'>('story');
  const [quizAnswers, setQuizAnswers] = useState<number[]>([]);
  const [quizResult, setQuizResult] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const currentUser = auth.getCurrentUser();
    if (!currentUser || currentUser.role !== 'student') {
      router.push('/login');
      return;
    }
    setUser(currentUser);
    loadLesson();
  }, [lessonId, router]);

  const loadLesson = async () => {
    try {
      const [lessonData, quizData] = await Promise.all([
        lessons.getById(lessonId),
        quizzes.getByLesson(lessonId),
      ]);
      setLesson(lessonData);
      setQuiz(quizData);
      setQuizAnswers(new Array(quizData.questions.length).fill(-1));
    } catch (error: any) {
      toast.error('Failed to load lesson');
    } finally {
      setLoading(false);
    }
  };

  const handleStartQuiz = async () => {
    // Update progress
    try {
      await progress.updateProgress({
        student_id: user.id,
        lesson_id: lessonId,
        status: 'in_progress',
        time_spent_minutes: 10,
      });
    } catch (error) {
      console.error('Failed to update progress');
    }
    setCurrentStep('quiz');
  };

  const handleSubmitQuiz = async () => {
    if (quizAnswers.includes(-1)) {
      toast.error('Please answer all questions');
      return;
    }

    try {
      const result = await quizzes.submit({
        lesson_id: lessonId,
        quiz_id: quiz.id,
        student_id: user.id,
        answers: quizAnswers,
      });
      setQuizResult(result);
      setCurrentStep('results');
      toast.success(result.passed ? '🎉 Great job!' : 'Keep practicing!');
    } catch (error: any) {
      toast.error('Failed to submit quiz');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading lesson...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/student/dashboard" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4">
            <ArrowLeft className="w-5 h-5" />
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">{lesson?.title}</h1>
          <p className="text-gray-600 mt-2">{lesson?.description}</p>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className={`text-sm font-medium ${currentStep === 'story' ? 'text-primary-600' : 'text-gray-400'}`}>
              1. Story
            </span>
            <span className={`text-sm font-medium ${currentStep === 'quiz' ? 'text-primary-600' : 'text-gray-400'}`}>
              2. Quiz
            </span>
            <span className={`text-sm font-medium ${currentStep === 'results' ? 'text-primary-600' : 'text-gray-400'}`}>
              3. Results
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-primary-600 h-2 rounded-full transition-all duration-300"
              style={{ 
                width: currentStep === 'story' ? '33%' : currentStep === 'quiz' ? '66%' : '100%' 
              }}
            />
          </div>
        </div>

        {/* Story Section */}
        {currentStep === 'story' && (
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Story: "{lesson?.title}"</h2>
              <button 
                onClick={() => setIsPlaying(!isPlaying)}
                className="flex items-center gap-2 px-4 py-2 bg-primary-100 text-primary-700 rounded-lg hover:bg-primary-200"
              >
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                {isPlaying ? 'Pause Audio' : 'Play Audio'}
              </button>
            </div>

            <div className="prose max-w-none">
              <p className="text-lg leading-relaxed text-gray-700 whitespace-pre-wrap">
                {lesson?.story_content}
              </p>
            </div>

            <div className="mt-8 pt-6 border-t">
              <h3 className="text-lg font-bold mb-3">Learning Objectives:</h3>
              <ul className="space-y-2">
                {lesson?.learning_objectives?.map((objective: string, index: number) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{objective}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8">
              <button onClick={handleStartQuiz} className="btn-primary w-full">
                Continue to Quiz →
              </button>
            </div>
          </div>
        )}

        {/* Quiz Section */}
        {currentStep === 'quiz' && (
          <div className="card">
            <h2 className="text-2xl font-bold mb-6">Assessment Quiz</h2>
            <div className="space-y-6">
              {quiz?.questions?.map((question: any, qIndex: number) => (
                <div key={qIndex} className="p-6 bg-gray-50 rounded-lg">
                  <h3 className="font-bold mb-4">
                    Question {qIndex + 1}: {question.question_text}
                  </h3>
                  <div className="space-y-3">
                    {question.options.map((option: string, oIndex: number) => (
                      <label
                        key={oIndex}
                        className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all ${
                          quizAnswers[qIndex] === oIndex
                            ? 'border-primary-600 bg-primary-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name={`question-${qIndex}`}
                          checked={quizAnswers[qIndex] === oIndex}
                          onChange={() => {
                            const newAnswers = [...quizAnswers];
                            newAnswers[qIndex] = oIndex;
                            setQuizAnswers(newAnswers);
                          }}
                          className="mr-3"
                        />
                        <span>{option}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 flex gap-4">
              <button onClick={() => setCurrentStep('story')} className="btn-secondary flex-1">
                ← Back to Story
              </button>
              <button onClick={handleSubmitQuiz} className="btn-primary flex-1">
                Submit Quiz
              </button>
            </div>
          </div>
        )}

        {/* Results Section */}
        {currentStep === 'results' && quizResult && (
          <div className="card">
            <div className="text-center mb-8">
              <div className={`w-24 h-24 mx-auto mb-4 rounded-full flex items-center justify-center ${
                quizResult.passed ? 'bg-green-100' : 'bg-yellow-100'
              }`}>
                {quizResult.passed ? (
                  <CheckCircle className="w-12 h-12 text-green-600" />
                ) : (
                  <XCircle className="w-12 h-12 text-yellow-600" />
                )}
              </div>
              <h2 className="text-3xl font-bold mb-2">
                {quizResult.passed ? 'Congratulations!' : 'Good Effort!'}
              </h2>
              <p className="text-xl text-gray-600">
                You scored {quizResult.score} out of {quizResult.total_questions} ({quizResult.percentage}%)
              </p>
            </div>

            <div className="space-y-6">
              {quizResult.answers.map((answer: any, index: number) => (
                <div key={index} className={`p-6 rounded-lg ${
                  answer.is_correct ? 'bg-green-50 border-2 border-green-200' : 'bg-red-50 border-2 border-red-200'
                }`}>
                  <div className="flex items-start gap-3 mb-3">
                    {answer.is_correct ? (
                      <CheckCircle className="w-6 h-6 text-green-600 mt-0.5" />
                    ) : (
                      <XCircle className="w-6 h-6 text-red-600 mt-0.5" />
                    )}
                    <div className="flex-1">
                      <h3 className="font-bold mb-2">Question {answer.question_number}: {answer.question}</h3>
                      <div className="space-y-2">
                        <p className="text-sm">
                          <span className="font-medium">Your answer:</span>{' '}
                          <span className={answer.is_correct ? 'text-green-700' : 'text-red-700'}>
                            {answer.student_answer}
                          </span>
                        </p>
                        {!answer.is_correct && (
                          <p className="text-sm">
                            <span className="font-medium">Correct answer:</span>{' '}
                            <span className="text-green-700">{answer.correct_answer}</span>
                          </p>
                        )}
                        {answer.explanation && (
                          <p className="text-sm text-gray-700 mt-2 p-3 bg-white rounded">
                            💡 {answer.explanation}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8">
              <Link href="/student/dashboard" className="btn-primary w-full block text-center">
                Back to Dashboard
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
