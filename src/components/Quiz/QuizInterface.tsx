import { useState, useEffect } from 'react';
import ResponsiveCard from '../ui/ResponsiveCard';
import ResponsiveButton from '../ui/ResponsiveButton';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { 
  CheckCircleIcon, 
  XCircleIcon,
  ArrowRightIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline';

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  category: string;
  difficulty: string;
}

interface QuizAnswer {
  quizId: string;
  selectedAnswer: number;
  timeSpent: number;
}

interface QuizInterfaceProps {
  onComplete: (answers: QuizAnswer[], score: number, percentage: number) => void;
  onSkip: () => void;
}

export default function QuizInterface({ onComplete, onSkip }: QuizInterfaceProps) {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // Track question start time only
  const [questionStartTime, setQuestionStartTime] = useState<number>(Date.now());

  useEffect(() => {
    loadQuestions();
  }, []);

  useEffect(() => {
    setQuestionStartTime(Date.now());
  }, [currentQuestion]);

  const loadQuestions = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('token');
      const headers: any = {
        'Content-Type': 'application/json'
      };
      
      // Only add authorization header if token exists
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch('/api/v1/quiz/questions', {
        method: 'GET',
        headers
      });

      const data = await response.json();

      if (data.success) {
        setQuestions(data.data.questions);
      } else {
        setError(data.error || 'Failed to load quiz questions');
      }
    } catch (err) {
      setError('Failed to load quiz questions. Please try again.');
      console.error('Error loading quiz questions:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
  };

  const handleNext = () => {
    if (selectedAnswer === null) return;

    const timeSpent = Math.floor((Date.now() - questionStartTime) / 1000);
    const newAnswer: QuizAnswer = {
      quizId: questions[currentQuestion].id,
      selectedAnswer,
      timeSpent
    };

    const newAnswers = [...answers, newAnswer];
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
    } else {
      // Quiz completed
      onComplete(newAnswers, 0, 0); // Score will be calculated by backend
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setSelectedAnswer(answers[currentQuestion - 1]?.selectedAnswer || null);
    }
  };

  const handleSkip = () => {
    onSkip();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <ResponsiveCard className="text-center p-8">
          <XCircleIcon className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Error Loading Quiz</h2>
          <p className="text-white/70 mb-4">{error}</p>
          <ResponsiveButton onClick={loadQuestions} variant="primary">
            Try Again
          </ResponsiveButton>
        </ResponsiveCard>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <ResponsiveCard className="text-center p-8">
          <CheckCircleIcon className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">No Quiz Available</h2>
          <p className="text-white/70 mb-4">There are no quiz questions available at the moment.</p>
          <ResponsiveButton onClick={onSkip} variant="primary">
            Continue
          </ResponsiveButton>
        </ResponsiveCard>
      </div>
    );
  }

  const question = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-black text-white p-4">
      <div className="max-w-2xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-white/70">Question {currentQuestion + 1} of {questions.length}</span>
            <span className="text-sm text-white/70">{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-2">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question Card */}
        <ResponsiveCard className="mb-6">
          <div className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="px-3 py-1 bg-blue-500/20 text-blue-400 text-sm rounded-full">
                {question.category}
              </span>
              <span className="px-3 py-1 bg-green-500/20 text-green-400 text-sm rounded-full">
                {question.difficulty}
              </span>
            </div>
            
            <h2 className="text-xl font-bold text-white mb-6">
              {question.question}
            </h2>

            {/* Answer Options */}
            <div className="space-y-3">
              {question.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  className={`w-full p-4 text-left rounded-lg border-2 transition-all duration-200 ${
                    selectedAnswer === index
                      ? 'border-blue-500 bg-blue-500/20 text-blue-400'
                      : 'border-white/20 bg-white/5 hover:border-white/40 hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      selectedAnswer === index
                        ? 'border-blue-500 bg-blue-500'
                        : 'border-white/40'
                    }`}>
                      {selectedAnswer === index && (
                        <div className="w-2 h-2 bg-white rounded-full" />
                      )}
                    </div>
                    <span className="text-white">{option}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </ResponsiveCard>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <ResponsiveButton
            onClick={handlePrevious}
            variant="outline"
            disabled={currentQuestion === 0}
            className="flex items-center gap-2"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            Previous
          </ResponsiveButton>

          <div className="flex gap-3">
            <ResponsiveButton
              onClick={handleSkip}
              variant="ghost"
              className="text-white/70"
            >
              Skip Quiz
            </ResponsiveButton>
            
            <ResponsiveButton
              onClick={handleNext}
              variant="primary"
              disabled={selectedAnswer === null}
              className="flex items-center gap-2"
            >
              {currentQuestion === questions.length - 1 ? 'Finish' : 'Next'}
              <ArrowRightIcon className="w-4 h-4" />
            </ResponsiveButton>
          </div>
        </div>
      </div>
    </div>
  );
}
