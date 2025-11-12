import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import ResponsiveButton from '@/components/ui/ResponsiveButton';
import { cn } from '@/lib/utils';

import videoSource from '@/assets/app-onboarding.mp4';
import starImage from '@/assets/Star 1 (1).png';


type IntroStep = 'initial_loading' | 'splash_screen' | 'chat_sequence';


const VIDEO_DIMENSIONS = {
  width: 393,
  height: 312,
};

const VIDEO_ASPECT_RATIO = `${VIDEO_DIMENSIONS.width} / ${VIDEO_DIMENSIONS.height}`;

export default function IntroSequencePage() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<IntroStep>('initial_loading');
  const [displayedMessages, setDisplayedMessages] = useState<{ id: number; text: string; sender: 'user' | 'other' }[]>([]);
  const [isChatComplete, setIsChatComplete] = useState(false);
  const videoContainerRef = useRef<HTMLDivElement | null>(null);
  const [mediaHeight, setMediaHeight] = useState(VIDEO_DIMENSIONS.height);

  useEffect(() => {
    if (!videoContainerRef.current) return;

    const updateHeight = () => {
      if (!videoContainerRef.current) return;
      const rect = videoContainerRef.current.getBoundingClientRect();
      setMediaHeight(rect.height || VIDEO_DIMENSIONS.height);
    };

    updateHeight();

    const resizeObserver = typeof ResizeObserver !== 'undefined'
      ? new ResizeObserver(updateHeight)
      : null;

    if (resizeObserver && videoContainerRef.current) {
      resizeObserver.observe(videoContainerRef.current);
    }

    window.addEventListener('resize', updateHeight);

    return () => {
      window.removeEventListener('resize', updateHeight);
      if (resizeObserver && videoContainerRef.current) {
        resizeObserver.unobserve(videoContainerRef.current);
        resizeObserver.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    if (currentStep === 'initial_loading') {
      const timer = setTimeout(() => {
        setCurrentStep('splash_screen');
      }, 1500);
      return () => clearTimeout(timer);
    } else if (currentStep === 'splash_screen') {
      const timer = setTimeout(() => {
        setCurrentStep('chat_sequence');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [currentStep]);

  // Schedule chat messages to appear over time (aligned with video)
  useEffect(() => {
    if (currentStep !== 'chat_sequence') return;

    const script = [
      { id: 1, text: 'Hey! How are you?', sender: 'user' as const, at: 2000 },
      { id: 2, text: 'I’m good... don’t hate me 😅', sender: 'other' as const, at: 5000 },
      { id: 3, text: 'How’s this week going?', sender: 'user' as const, at: 8000 },
      { id: 4, text: 'Not bad! You?', sender: 'other' as const, at: 11000 },
      { id: 5, text: 'You too! 👍', sender: 'user' as const, at: 14000 },
      { id: 6, text: 'Let’s catch up soon!', sender: 'other' as const, at: 17000 },
      { id: 7, text: 'Sure! Let’s do it! 😊', sender: 'user' as const, at: 20000 },
    ];

    setDisplayedMessages([]);
    setIsChatComplete(false);

    const timeouts: number[] = [];
    script.forEach(msg => {
      const t = window.setTimeout(() => {
        setDisplayedMessages(prev => [...prev, { id: msg.id, text: msg.text, sender: msg.sender }]);
        if (msg.id === script[script.length - 1].id) setIsChatComplete(true);
      }, msg.at);
      timeouts.push(t);
    });

    return () => timeouts.forEach(clearTimeout);
  }, [currentStep]);

  const handleContinue = () => {
    if (!isChatComplete) return;
    navigate('/onboarding');
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
        <div className="flex flex-col items-center justify-center h-full bg-black text-white px-6 text-center">
          <img
            src={starImage}
            alt="Citadel Star"
            className="mx-auto w-[180px] h-[180px] sm:w-[227px] sm:h-[227px]"
          />
          <h1 className="mt-4 text-3xl font-bold sm:text-4xl">Citadel</h1>
        </div>
      );
    } else if (currentStep === 'chat_sequence') {
      return (
        <div className="relative flex flex-col h-full bg-black text-white overflow-hidden px-0">
          {/* Video section */}
          <div
            ref={videoContainerRef}
            className="relative flex-shrink-0 w-full mt-[0px]"
            style={{
              width: '100%',
              aspectRatio: VIDEO_ASPECT_RATIO,
              border: '2px solid #111111',
              borderRadius: '5px',
              overflow: 'hidden'
            }}
          >
            <video autoPlay muted playsInline className="w-full h-full object-cover">
              <source src={videoSource} type="video/mp4" />
            </video>
          </div>

          {/* Chat messages */}
          <div className="relative flex-1 w-full flex justify-center">
            <div
              className="w-full max-w-[393px] px-0 py-6 space-y-4 overflow-y-auto"
              style={{
                maxHeight: `${mediaHeight}px`,
              }}
            >
              {displayedMessages.map((msg) => (
                <div key={msg.id} className={cn('flex', msg.sender === 'user' ? 'justify-end' : 'justify-start')}>
                  <div
                    className={cn('px-4 py-3 rounded-[18px] text-[#E5E5E5] max-w-[70%]')}
                    style={{
                      backgroundColor: msg.sender === 'user' ? '#1A1A1A' : '#000000',
                      border: `1px solid ${msg.sender === 'user' ? '#3A3A3A' : '#2A2A2A'}`,
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '18px',
                      lineHeight: '28px',
                      marginRight: msg.sender === 'user' ? '0px' : undefined,
                      marginLeft: msg.sender === 'user' ? undefined : '0px',
                      borderTopRightRadius: msg.sender === 'user' ? 0 : undefined,
                      borderBottomRightRadius: msg.sender === 'user' ? 0 : undefined,
                      borderTopLeftRadius: msg.sender === 'user' ? undefined : 0,
                      borderBottomLeftRadius: msg.sender === 'user' ? undefined : 0,
                    }}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Continue Button */}
          <div className="p-4 bg-black z-10 flex-shrink-0 flex justify-center">
            <ResponsiveButton
              onClick={handleContinue}
              disabled={!isChatComplete}
              className={cn(
                'transition-all duration-300',
                'flex items-center justify-center',
                isChatComplete ? '' : 'cursor-not-allowed'
              )}
              style={{
                width: '100%',
                maxWidth: '361px',
                height: '50px',
                borderRadius: '48px',
                padding: '14.5px 16px',
                backgroundColor: isChatComplete ? '#1BEA7B' : '#2C2C2C',
                color: isChatComplete ? '#000000' : '#9A9A9A',
                fontFamily: 'Inter, sans-serif',
                fontSize: '20px',
                fontWeight: 600,
                gap: '8px',
              }}
            >
              Continue
            </ResponsiveButton>
          </div>
        </div>
      );
    }
    return null;
  };

  

  return (
    <div className="min-h-screen w-full bg-black flex items-center justify-center p-4">
      <div className="w-[390px] h-[844px] bg-black rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
        <div className="flex flex-col h-full">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}
