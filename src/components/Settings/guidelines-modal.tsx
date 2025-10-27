import { X } from "lucide-react"
import { useState, useEffect } from "react"

interface GuidelinesModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function GuidelinesModal({ isOpen, onClose }: GuidelinesModalProps) {
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

  if (!isOpen) return null

  const guidelines = [
    {
      number: 1,
      text: "Find your ticket in ",
      highlight: "settings → event bookings",
      suffix: ".",
    },
    {
      number: 2,
      text: "Restaurant name will be available ",
      highlight: "12 hours before the dinner",
      suffix: ".",
    },
    {
      number: 3,
      text: "This price includes ",
      highlight: "one time Citadel dinner experience",
      suffix: " with like-minded people.",
    },
    {
      number: 4,
      text: "The ",
      highlight: "meal cost is to be paid",
      suffix: " at the restaurant.",
    },
    {
      number: 5,
      text: "Free ",
      highlight: "reschedule up to 48 hours",
      suffix: " before the dinner.",
    },
  ]

  return (
    <div className="fixed inset-0 bg-black flex flex-col z-50">
      {/* Top bar (time, wifi, battery) */}
      <div className="flex justify-between items-center p-4 bg-black text-white">
        <span className="text-sm">{formatTime(currentTime)}</span>
        <div className="flex items-center space-x-1">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-6 pt-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-white text-xl font-normal">Guidelines</h2>
          <button onClick={onClose} className="text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-5">
          {guidelines.map((guideline) => (
            <div key={guideline.number} className="flex gap-3">
              <span className="text-white/70 text-base">{guideline.number}.</span>
              <p className="text-base leading-relaxed">
                <span className="text-white/70">{guideline.text}</span>
                <span className="text-white font-semibold">{guideline.highlight}</span>
                {guideline.suffix && <span className="text-white/70">{guideline.suffix}</span>}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
