import React from 'react';
import ResponsiveCard from '../UI/ResponsiveCard';
import ResponsiveButton from '../UI/ResponsiveButton';
import { 
  AcademicCapIcon,
  LightBulbIcon,
  UserGroupIcon,
  ClockIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';

interface QuizWelcomeProps {
  onStart: () => void;
  onSkip: () => void;
}

export default function QuizWelcome({ onStart, onSkip }: QuizWelcomeProps) {
  const features = [
    {
      icon: <LightBulbIcon className="w-8 h-8 text-blue-400" />,
      title: "Personality Insights",
      description: "Help us understand your personality and preferences"
    },
    {
      icon: <UserGroupIcon className="w-8 h-8 text-green-400" />,
      title: "Better Matches",
      description: "Get matched with people who share your interests"
    },
    {
      icon: <AcademicCapIcon className="w-8 h-8 text-purple-400" />,
      title: "Academic Focus",
      description: "Questions about your academic and career interests"
    },
    {
      icon: <ClockIcon className="w-8 h-8 text-yellow-400" />,
      title: "Quick & Easy",
      description: "Takes only 5-10 minutes to complete"
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white p-4">
      <div className="max-w-2xl mx-auto">
        <ResponsiveCard className="text-center">
          <div className="p-8">
            {/* Welcome Header */}
            <div className="mb-8">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <AcademicCapIcon className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">Welcome to Your Quiz!</h1>
              <p className="text-white/70 text-lg">
                Let's get to know you better with a quick personality quiz
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {features.map((feature, index) => (
                <div key={index} className="bg-white/5 rounded-lg p-4 text-left">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                      {feature.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-white mb-1">{feature.title}</h3>
                      <p className="text-sm text-white/70">{feature.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Quiz Info */}
            <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg p-6 mb-8">
              <h3 className="text-lg font-semibold text-white mb-3">What to Expect</h3>
              <div className="space-y-2 text-left">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <span className="text-white/70">10 simple questions about your personality</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-white/70">Multiple choice answers - no right or wrong</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                  <span className="text-white/70">Results help us find better connections for you</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                  <span className="text-white/70">Takes about 5-10 minutes to complete</span>
                </div>
              </div>
            </div>

            {/* Privacy Note */}
            <div className="bg-white/5 rounded-lg p-4 mb-8">
              <p className="text-sm text-white/70">
                <strong className="text-white">Privacy:</strong> Your quiz responses are private and will only be used 
                to improve your matching experience. We never share your personal information.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <ResponsiveButton
                onClick={onStart}
                variant="primary"
                className="flex-1 flex items-center justify-center gap-2"
              >
                Start Quiz
                <ArrowRightIcon className="w-4 h-4" />
              </ResponsiveButton>
              
              <ResponsiveButton
                onClick={onSkip}
                variant="ghost"
                className="flex-1 text-white/70"
              >
                Skip for Now
              </ResponsiveButton>
            </div>

            {/* Progress Indicator */}
            <div className="mt-8">
              <div className="flex justify-center items-center gap-2 text-sm text-white/50">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="w-2 h-2 bg-white/20 rounded-full"></div>
                <div className="w-2 h-2 bg-white/20 rounded-full"></div>
                <span className="ml-2">Step 1 of 3</span>
              </div>
            </div>
          </div>
        </ResponsiveCard>
      </div>
    </div>
  );
}
