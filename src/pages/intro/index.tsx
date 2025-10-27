import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '@/components/UI/LoadingSpinner';
import ResponsiveButton from '@/components/UI/ResponsiveButton';
import { cn } from '@/lib/utils';

type IntroStep = 'initial_loading' | 'splash_screen' | 'chat_sequence';

interface ChatMessage {
  id: number;
  text: string;
  sender: 'user' | 'other';
}

const chatMessages: ChatMessage[] = [
  { id: 1, text: 'Hey! Deepesh or Anamul?', sender: 'other' },
  { id: 2, text: 'Anamul... don\'t hate me 😅', sender: 'other' },
  { id: 3, text: 'Deepesh! How\'s this week?', sender: 'user' },
  { id: 4, text: 'Not bad! You?', sender: 'other' },
  { id: 5, text: 'You too! 👍', sender: 'user' },
  { id: 6, text: 'Let\'s catch up soon!', sender: 'other' },
  { id: 7, text: 'Sure! Let\'s do it! 😊', sender: 'user' },
];

export default function IntroSequencePage() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<IntroStep>('initial_loading');
  const [displayedMessages, setDisplayedMessages] = useState<ChatMessage[]>([]);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  useEffect(() => {
    if (currentStep === 'initial_loading') {
      const timer = setTimeout(() => {
        setCurrentStep('splash_screen');
      }, 1500); // Short delay for initial loading
      return () => clearTimeout(timer);
    } else if (currentStep === 'splash_screen') {
      const timer = setTimeout(() => {
        setCurrentStep('chat_sequence');
        // Start displaying the first chat message immediately after splash
        if (chatMessages.length > 0) {
          setDisplayedMessages([chatMessages[0]]);
          setCurrentMessageIndex(1);
        }
      }, 2000); // Delay for splash screen
      return () => clearTimeout(timer);
    }
  }, [currentStep]);

  const handleContinue = () => {
    if (currentMessageIndex < chatMessages.length) {
      // Display next message
      setDisplayedMessages((prev) => [...prev, chatMessages[currentMessageIndex]]);
      setCurrentMessageIndex((prev) => prev + 1);
    } else {
      // All messages displayed, navigate to quiz
      navigate('/quiz');
    }
  };

  const renderContent = () => {
    if (currentStep === 'initial_loading') {
      return (
        <div className="flex flex-col items-center justify-center h-full bg-black text-white">
          <LoadingSpinner />
          <p className="mt-4 text-lg text-gray-400">Loading...</p>
        </div>
      );
    } else if (currentStep === 'splash_screen') {
      return (
        <div className="flex flex-col items-center justify-center h-full bg-black text-white">
          <svg className="w-24 h-24 text-green-500 animate-pulse" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
          </svg>
          <h1 className="mt-4 text-4xl font-bold">Citadel</h1>
        </div>
      );
    } else if (currentStep === 'chat_sequence') {
      const isLastMessage = currentMessageIndex === chatMessages.length;
      const buttonVariant = isLastMessage ? 'primary' : 'secondary';

      return (
        <div className="relative flex flex-col h-full bg-black text-white overflow-hidden">
          {/* Green dotted background pattern */}
          <div className="absolute inset-0 z-0 opacity-20" style={{
            backgroundImage: `radial-gradient(circle, #10B981 1px, transparent 1px)`,
            backgroundSize: '20px 20px',
            maskImage: 'linear-gradient(to bottom, transparent, black 20%, black 80%, transparent)'
          }} />

          <div className="flex-grow p-4 space-y-3 overflow-y-auto z-10">
            {displayedMessages.map((msg) => (
              <div
                key={msg.id}
                className={cn(
                  'flex',
                  msg.sender === 'user' ? 'justify-end' : 'justify-start'
                )}
              >
                <div
                  className={cn(
                    'max-w-[70%] p-3 rounded-lg',
                    msg.sender === 'user'
                      ? 'bg-gray-700 text-white'
                      : 'bg-gray-800 text-white'
                  )}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 bg-black z-10">
            <ResponsiveButton
              onClick={handleContinue}
              fullWidth
              variant={buttonVariant}
            >
              {isLastMessage ? 'Continue to Quiz' : 'Continue'}
            </ResponsiveButton>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-screen w-screen flex flex-col">
      {/* Top bar (time, wifi, battery) */}
      <div className="flex justify-between items-center p-4 bg-black text-white z-20">
        <span className="text-sm">12:45</span>
        <div className="flex items-center space-x-1">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        </div>
      </div>
      {renderContent()}
    </div>
  );
}
