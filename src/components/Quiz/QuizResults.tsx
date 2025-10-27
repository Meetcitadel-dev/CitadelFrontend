import ResponsiveCard from '../UI/ResponsiveCard';
import ResponsiveButton from '../UI/ResponsiveButton';
import { 
  TrophyIcon, 
  StarIcon,
  CheckCircleIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline';

interface QuizResultsProps {
  totalQuestions: number;
  correctAnswers: number;
  totalPoints: number;
  percentage: number;
  onContinue: () => void;
  onRetake: () => void;
  isAuthenticated?: boolean;
}

export default function QuizResults({
  totalQuestions,
  correctAnswers,
  totalPoints,
  percentage,
  onContinue,
  onRetake,
  isAuthenticated = false
}: QuizResultsProps) {
  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return 'text-green-400';
    if (percentage >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getScoreMessage = (percentage: number) => {
    if (percentage >= 90) return "Excellent! You're a quiz master!";
    if (percentage >= 80) return "Great job! You did really well!";
    if (percentage >= 70) return "Good work! You're on the right track!";
    if (percentage >= 60) return "Not bad! Keep learning and improving!";
    return "Don't worry! Practice makes perfect!";
  };

  const getScoreIcon = (percentage: number) => {
    if (percentage >= 80) return <TrophyIcon className="w-16 h-16 text-yellow-400" />;
    if (percentage >= 60) return <StarIcon className="w-16 h-16 text-blue-400" />;
    return <CheckCircleIcon className="w-16 h-16 text-green-400" />;
  };

  return (
    <div className="min-h-screen bg-black text-white p-4">
      <div className="max-w-2xl mx-auto">
        <ResponsiveCard className="text-center">
          <div className="p-8">
            {/* Score Icon */}
            <div className="mb-6">
              {getScoreIcon(percentage)}
            </div>

            {/* Score Title */}
            <h1 className="text-3xl font-bold text-white mb-2">Quiz Complete!</h1>
            <p className="text-white/70 mb-8">{getScoreMessage(percentage)}</p>

            {/* Score Details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-white/5 rounded-lg p-4">
                <div className="text-2xl font-bold text-white mb-1">
                  {correctAnswers}/{totalQuestions}
                </div>
                <div className="text-sm text-white/70">Correct Answers</div>
              </div>
              
              <div className="bg-white/5 rounded-lg p-4">
                <div className={`text-2xl font-bold mb-1 ${getScoreColor(percentage)}`}>
                  {percentage}%
                </div>
                <div className="text-sm text-white/70">Score</div>
              </div>
              
              <div className="bg-white/5 rounded-lg p-4">
                <div className="text-2xl font-bold text-white mb-1">
                  {totalPoints}
                </div>
                <div className="text-sm text-white/70">Total Points</div>
              </div>
            </div>

            {/* Performance Breakdown */}
            <div className="bg-white/5 rounded-lg p-6 mb-8">
              <h3 className="text-lg font-semibold text-white mb-4">Performance Breakdown</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-white/70">Correct Answers</span>
                  <div className="flex items-center gap-2">
                    <CheckCircleIcon className="w-5 h-5 text-green-400" />
                    <span className="text-white font-semibold">{correctAnswers}</span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-white/70">Incorrect Answers</span>
                  <div className="flex items-center gap-2">
                    <XCircleIcon className="w-5 h-5 text-red-400" />
                    <span className="text-white font-semibold">{totalQuestions - correctAnswers}</span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-white/70">Accuracy</span>
                  <span className={`font-semibold ${getScoreColor(percentage)}`}>
                    {percentage}%
                  </span>
                </div>
              </div>
            </div>

            {/* Motivational Message */}
            <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg p-6 mb-8">
              <h3 className="text-lg font-semibold text-white mb-2">What's Next?</h3>
              <p className="text-white/70">
                Your quiz results help us understand your personality and preferences better. 
                This information will be used to find better matches and connections for you!
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <ResponsiveButton
                onClick={onContinue}
                variant="primary"
                className="flex-1"
              >
                {isAuthenticated ? 'Continue to Dashboard' : 'Continue to Profile Setup'}
              </ResponsiveButton>

              <ResponsiveButton
                onClick={onRetake}
                variant="outline"
                className="flex-1"
              >
                Retake Quiz
              </ResponsiveButton>
            </div>
          </div>
        </ResponsiveCard>
      </div>
    </div>
  );
}
