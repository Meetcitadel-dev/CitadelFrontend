import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import QuizWelcome from '@/components/Quiz/QuizWelcome';
import QuizInterface from '@/components/Quiz/QuizInterface';
import QuizResults from '@/components/Quiz/QuizResults';
import LoadingSpinner from '@/components/UI/LoadingSpinner';
import { getAuthToken } from '@/lib/utils';

type QuizStep = 'welcome' | 'quiz' | 'results' | 'loading';

interface QuizAnswer {
  quizId: string;
  selectedAnswer: number;
  timeSpent: number;
}

export default function QuizPage() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<QuizStep>('loading');
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  const [results, setResults] = useState<{
    totalQuestions: number;
    correctAnswers: number;
    totalPoints: number;
    percentage: number;
  } | null>(null);

  useEffect(() => {
    checkAuthAndQuizStatus();
  }, []);

  const checkAuthAndQuizStatus = async () => {
    const token = getAuthToken();

    if (token) {
      // User is authenticated, check if they already completed quiz
      try {
        const response = await fetch('/api/v1/quiz/results', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        // Check if response is OK and is JSON
        if (!response.ok) {
          // If 400 (user hasn't completed quiz), continue with quiz
          if (response.status === 400) {
            console.log('User has not completed quiz yet');
            setCurrentStep('welcome');
            return;
          }
          // For other errors, just continue with quiz
          console.log('Error checking quiz status, continuing with quiz');
          setCurrentStep('welcome');
          return;
        }

        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          console.error('Response is not JSON, continuing with quiz');
          setCurrentStep('welcome');
          return;
        }

        const data = await response.json();

        if (data.success && data.data.hasCompletedQuiz) {
          // User already completed quiz, redirect to main app
          navigate('/explore');
          return;
        }
      } catch (error) {
        console.error('Error checking quiz status:', error);
        // Continue with quiz on error
      }
    }

    // User needs to complete quiz (whether authenticated or not)
    setCurrentStep('welcome');
  };

  const handleStartQuiz = () => {
    setCurrentStep('quiz');
  };

  const handleSkipQuiz = () => {
    navigate('/onboarding');
  };

  const handleQuizComplete = async (quizAnswers: QuizAnswer[]) => {
    setCurrentStep('loading');
    setAnswers(quizAnswers);

    const token = localStorage.getItem('token');
    
    if (token) {
      // User is authenticated, submit to backend
      try {
        const response = await fetch('/api/v1/quiz/submit', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ answers: quizAnswers })
        });

        const data = await response.json();

        if (data.success) {
          setResults({
            totalQuestions: data.data.totalQuestions,
            correctAnswers: data.data.correctAnswers,
            totalPoints: data.data.totalPoints,
            percentage: data.data.percentage
          });
          setCurrentStep('results');
        } else {
          console.error('Failed to submit quiz:', data.error);
          // Still show results even if submission failed
          setResults({
            totalQuestions: quizAnswers.length,
            correctAnswers: 0,
            totalPoints: 0,
            percentage: 0
          });
          setCurrentStep('results');
        }
      } catch (error) {
        console.error('Error submitting quiz:', error);
        // Show results even if there was an error
        setResults({
          totalQuestions: quizAnswers.length,
          correctAnswers: 0,
          totalPoints: 0,
          percentage: 0
        });
        setCurrentStep('results');
      }
    } else {
      // User is not authenticated, just show results and proceed to onboarding
      setResults({
        totalQuestions: quizAnswers.length,
        correctAnswers: 0,
        totalPoints: 0,
        percentage: 0
      });
      setCurrentStep('results');
    }
  };

  const handleContinue = () => {
    const token = getAuthToken();

    // If user is authenticated and completed quiz, go to explore
    if (token && results) {
      navigate('/explore');
    } else {
      // If not authenticated, continue with onboarding
      navigate('/onboarding');
    }
  };

  const handleRetake = () => {
    setCurrentStep('welcome');
    setAnswers([]);
    setResults(null);
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'welcome':
        return (
          <QuizWelcome
            onStart={handleStartQuiz}
            onSkip={handleSkipQuiz}
          />
        );
      
      case 'quiz':
        return (
          <QuizInterface
            onComplete={handleQuizComplete}
            onSkip={handleSkipQuiz}
          />
        );
      
      case 'results':
        return results ? (
          <QuizResults
            totalQuestions={results.totalQuestions}
            correctAnswers={results.correctAnswers}
            totalPoints={results.totalPoints}
            percentage={results.percentage}
            onContinue={handleContinue}
            onRetake={handleRetake}
            isAuthenticated={!!getAuthToken()}
          />
        ) : null;
      
      case 'loading':
        return (
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <LoadingSpinner size="lg" />
              <p className="text-white/70 mt-4">Processing your results...</p>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-black">
      {renderCurrentStep()}
    </div>
  );
}
