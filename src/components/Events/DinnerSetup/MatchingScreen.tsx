import { useEffect, useState } from 'react';

interface MatchingScreenProps {
  onComplete: () => void;
}

export default function MatchingScreen({ onComplete }: MatchingScreenProps) {
  const [score, setScore] = useState(0);

  useEffect(() => {
    const targetScore = 95; // Always 95%
    const duration = 2000; // 2 seconds
    const steps = 60; // Number of animation steps for smooth animation
    const increment = targetScore / steps;
    const stepDuration = duration / steps;

    let currentScore = 0;
    let completed = false;

    const interval = setInterval(() => {
      currentScore += increment;

      if (currentScore >= targetScore && !completed) {
        completed = true;
        setScore(targetScore);
        clearInterval(interval);

        // Immediately proceed to next page
        setTimeout(() => {
          onComplete();
        }, 100);
      } else if (currentScore < targetScore) {
        setScore(Math.floor(currentScore));
      }
    }, stepDuration);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center px-6">
      {/* Top Text */}
      <div className="text-center mb-16">
        <h1 className="text-2xl font-bold text-white">
          Finding compatible
        </h1>
        <h1 className="text-2xl font-bold text-green-400">
          PROFILES!
        </h1>
      </div>

      {/* Rotating Ring with Score */}
      <div className="relative w-64 h-64 flex items-center justify-center">
        {/* Rotating green ring */}
        <svg
          className="absolute inset-0 w-full h-full"
          style={{
            animation: 'spin 2s linear infinite',
            transform: 'rotate(-90deg)'
          }}
          viewBox="0 0 100 100"
        >
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="#22c55e"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeDasharray="220 283"
            opacity="0.8"
          />
        </svg>

        {/* Score in center */}
        <div className="relative z-10 flex items-center justify-center">
          <span className="text-7xl font-bold text-white">
            {score}%
          </span>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          from {
            transform: rotate(-90deg);
          }
          to {
            transform: rotate(270deg);
          }
        }
      `}</style>
    </div>
  );
}

