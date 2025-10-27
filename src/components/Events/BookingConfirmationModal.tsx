import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

interface BookingConfirmationModalProps {
  onClose: () => void;
}

export default function BookingConfirmationModal({ onClose }: BookingConfirmationModalProps) {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Format time as HH:MM
  const formatTime = (date: Date) => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const handleViewTicket = () => {
    onClose();
    navigate('/settings');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col">
      {/* Top bar (time, wifi, battery) */}
      <div className="flex justify-between items-center p-4 bg-black text-white">
        <span className="text-sm">{formatTime(currentTime)}</span>
        <div className="flex items-center space-x-1">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        </div>
      </div>

      {/* Content - Centered */}
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        {/* Success Icon with wavy border */}
        <div className="mb-8 relative">
          <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Wavy circle background */}
            <path
              d="M60 10 C 65 8, 70 10, 75 12 C 80 14, 85 16, 88 20 C 92 25, 95 30, 97 35 C 100 42, 102 48, 102 55 C 102 62, 100 68, 97 75 C 95 80, 92 85, 88 90 C 85 94, 80 96, 75 98 C 68 101, 62 102, 55 102 C 48 102, 42 100, 35 97 C 30 95, 25 92, 20 88 C 16 85, 14 80, 12 75 C 9 68, 8 62, 8 55 C 8 48, 9 42, 12 35 C 14 30, 16 25, 20 20 C 25 16, 30 14, 35 12 C 42 9, 48 8, 55 8 C 57 8, 58.5 9, 60 10 Z"
              fill="#1BEA7B"
              stroke="#1BEA7B"
              strokeWidth="2"
            />
            {/* Checkmark */}
            <path
              d="M 35 60 L 50 75 L 85 40"
              stroke="black"
              strokeWidth="6"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </svg>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-white mb-3">
          Dinner Booked!
        </h2>

        {/* View ticket link */}
        <button
          onClick={handleViewTicket}
          className="text-white/60 text-sm underline hover:text-white/80 transition-colors"
        >
          View ticket
        </button>
      </div>
    </div>
  );
}

