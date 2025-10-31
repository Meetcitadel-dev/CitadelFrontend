import { useState, useEffect } from 'react';
import { ChevronLeft } from 'lucide-react';
import { getAuthToken } from '@/lib/utils';
import { apiClient } from '@/lib/apiClient';

interface PersonalityQuizProps {
  setupData: any;
  onComplete: () => void;
  onBack: () => void;
}

interface QuizQuestion {
  questionId: string;
  question: string;
  options: string[];
  category: string;
}

export default function PersonalityQuiz({ setupData, onComplete, onBack }: PersonalityQuizProps) {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<{ questionId: string; question: string; answer: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const token = getAuthToken();
      const response = await apiClient<{
        success: boolean;
        data: { questions: QuizQuestion[]; totalQuestions: number };
      }>('/api/v1/dinner-preferences/personality-quiz', {
        method: 'GET',
        token: token || undefined
      });

      if (response.success) {
        setQuestions(response.data.questions);
      }
    } catch (error) {
      console.error('Error fetching quiz questions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = async (answer: string) => {
    const currentQuestion = questions[currentQuestionIndex];
    const newAnswers = [
      ...answers.filter(a => a.questionId !== currentQuestion.questionId),
      {
        questionId: currentQuestion.questionId,
        question: currentQuestion.question,
        answer
      }
    ];
    setAnswers(newAnswers);

    // Calculate progress
    const newProgress = ((currentQuestionIndex + 1) / questions.length) * 100;
    setProgress(newProgress);

    // Move to next question or submit
    if (currentQuestionIndex < questions.length - 1) {
      // Move to next question after a short delay
      setTimeout(() => {
        setCurrentQuestionIndex(prev => prev + 1);
      }, 200);
    } else {
      // Last question answered - submit quiz
      await submitQuiz(newAnswers);
    }
  };

  const submitQuiz = async (finalAnswers: any[]) => {
    console.log('🚀 Starting quiz submission...');
    setSubmitting(true);
    setProgress(10);

    try {
      const token = getAuthToken();

      if (!token) {
        throw new Error('No authentication token found');
      }

      console.log('📝 Saving initial preferences...', setupData);
      setProgress(30);

      // First save initial preferences
      const prefsResponse = await apiClient('/api/v1/dinner-preferences/initial', {
        method: 'POST',
        token,
        body: setupData
      });

      console.log('✅ Initial preferences saved:', prefsResponse);
      setProgress(60);

      console.log('📝 Submitting quiz answers...', finalAnswers);

      // Then submit quiz
      const quizResponse = await apiClient('/api/v1/dinner-preferences/personality-quiz', {
        method: 'POST',
        token: token || undefined,
        body: { answers: finalAnswers }
      });

      console.log('✅ Quiz submitted:', quizResponse);
      setProgress(90);

      // Complete
      setProgress(100);

      console.log('🎉 Setup complete! Calling onComplete...');

      // Wait a bit to show 100% before completing
      setTimeout(() => {
        onComplete();
      }, 800);
    } catch (error: any) {
      console.error('❌ Error submitting quiz:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response,
        stack: error.stack
      });

      setSubmitting(false);
      setProgress(0);

      alert(`Failed to save preferences: ${error.message || 'Please try again.'}`);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
      setProgress(((currentQuestionIndex - 1) / questions.length) * 100);
    } else {
      onBack();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white/70">Loading questions...</p>
        </div>
      </div>
    );
  }

  if (submitting) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white font-medium mb-2">Finding compatible PROFILES...</p>
          <div className="text-4xl font-bold text-white mb-2">{Math.floor(progress)}%</div>
          <div className="w-full max-w-xs mx-auto h-2 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-green-400 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-white/70">No questions available</p>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const currentAnswer = answers.find(a => a.questionId === currentQuestion.questionId)?.answer;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <button
          onClick={handlePrevious}
          className="flex items-center gap-2 text-white/70 hover:text-white transition-colors mb-4"
        >
          <ChevronLeft className="w-5 h-5" />
          <span>Back</span>
        </button>

        <div className="mb-4">
          <div className="flex justify-between text-sm text-white/70 mb-2">
            <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
            <span>{Math.floor(progress)}%</span>
          </div>
          <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-green-400 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <h2 className="text-xl font-bold text-white mb-2">
          {currentQuestion.question}
        </h2>
      </div>

      {/* Options */}
      <div className="space-y-3">
        {currentQuestion.options.map((option) => (
          <button
            key={option}
            onClick={() => handleAnswer(option)}
            className={`w-full py-4 px-6 rounded-xl text-left font-medium transition-all ${
              currentAnswer === option
                ? 'bg-green-400 text-black'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}

