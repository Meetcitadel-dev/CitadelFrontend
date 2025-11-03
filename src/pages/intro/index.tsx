import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import ResponsiveButton from '@/components/ui/ResponsiveButton';
import { cn } from '@/lib/utils';
import videoSource from '@/assets/app-onboarding.mp4';
import starImage from '@/assets/Star 1 (1).png';

type IntroStep = 'initial_loading' | 'splash_screen' | 'chat_sequence';

interface ChatMessage {
  id: number;
  text: string;
  sender: 'user' | 'other';
  videoTime: number; // Time in seconds when this message should appear
}

const chatMessages: ChatMessage[] = [
  { id: 1, text: 'Hey! How are you?', sender: 'user', videoTime: 2 },
  { id: 2, text: 'I’m good... don’t hate me 😅', sender: 'other', videoTime: 5 },
  { id: 3, text: 'How’s this week going?', sender: 'user', videoTime: 8 },
  { id: 4, text: 'Not bad! You?', sender: 'other', videoTime: 11 },
  { id: 5, text: 'You too! 👍', sender: 'user', videoTime: 14 },
  { id: 6, text: 'Let’s catch up soon!', sender: 'other', videoTime: 17 },
  { id: 7, text: 'Sure! Let’s do it! 😊', sender: 'user', videoTime: 20 },
];


export default function IntroSequencePage() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<IntroStep>('initial_loading');
  const [displayedMessages, setDisplayedMessages] = useState<ChatMessage[]>([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isChatComplete, setIsChatComplete] = useState(false);

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (currentStep === 'initial_loading') {
      const timer = setTimeout(() => {
        setCurrentStep('splash_screen');
      }, 1500); // Short delay for initial loading
      return () => clearTimeout(timer);
    } else if (currentStep === 'splash_screen') {
      const timer = setTimeout(() => {
        setCurrentStep('chat_sequence');
      }, 2000); // Delay for splash screen
      return () => clearTimeout(timer);
    }
  }, [currentStep]);

  // Auto-display messages based on video time - one at a time
  useEffect(() => {
    if (currentStep !== 'chat_sequence' || !videoRef.current) return;

    const video = videoRef.current;

    const checkAndShowMessage = (currentVideoTime: number) => {
      setDisplayedMessages((prev) => {
        // Find the next message that should be displayed based on video time
        const nextMessage = chatMessages.find(
          (msg) => currentVideoTime >= msg.videoTime && !prev.find((m) => m.id === msg.id)
        );

        if (nextMessage) {
          const newMessages = [...prev, nextMessage].sort((a, b) => a.id - b.id);
          
          // Check if all messages are displayed
          if (newMessages.length === chatMessages.length) {
            setIsChatComplete(true);
          }
          
          return newMessages;
        }

        return prev;
      });
    };

    const checkVideoTime = () => {
      const currentVideoTime = video.currentTime;
      checkAndShowMessage(currentVideoTime);
    };

    // When video ends, show remaining messages one by one
    const handleVideoEnd = () => {
      setDisplayedMessages((prev) => {
        if (prev.length < chatMessages.length) {
          // Show remaining messages one by one with delays
          const remainingMessages = chatMessages
            .filter(msg => !prev.find(m => m.id === msg.id))
            .sort((a, b) => a.id - b.id);

          remainingMessages.forEach((msg, index) => {
            setTimeout(() => {
              setDisplayedMessages((current) => {
                if (!current.find(m => m.id === msg.id)) {
                  const updated = [...current, msg].sort((a, b) => a.id - b.id);
                  
                  // Check if this is the last message
                  if (updated.length === chatMessages.length) {
                    setIsChatComplete(true);
                  }
                  
                  return updated;
                }
                return current;
              });
            }, index * 800); // 800ms delay between each message
          });
        }
        return prev;
      });
    };

    const interval = setInterval(checkVideoTime, 100); // Check every 100ms
    video.addEventListener('timeupdate', checkVideoTime);
    video.addEventListener('ended', handleVideoEnd);

    return () => {
      clearInterval(interval);
      video.removeEventListener('timeupdate', checkVideoTime);
      video.removeEventListener('ended', handleVideoEnd);
    };
  }, [currentStep]);

  const handleContinue = () => {
    if (isChatComplete) {
      // All messages displayed, navigate to quiz
      navigate('/onboarding');

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
          <img
            src={starImage}
            alt="Citadel Star"
            className="mx-auto w-[227px] h-[227px]"
          />
          <h1 className="mt-4 text-4xl font-bold">Citadel</h1>
        </div>
      );
    } else if (currentStep === 'chat_sequence') {
      return (
        <div className="relative flex flex-col h-full bg-black text-white overflow-hidden">
          {/* Video Player - Top Section (where star was) */}
          <div className="relative w-full flex-shrink-0" style={{ height: '50%', minHeight: '300px' }}>
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              className="w-full h-full object-cover"
              onLoadedMetadata={() => {
                // Check video duration
                if (videoRef.current) {
                  const duration = videoRef.current.duration;
                  const lastMessageTime = Math.max(...chatMessages.map(m => m.videoTime));
                  console.log('Video duration:', duration, 'Last message time:', lastMessageTime);
                }
              }}
              onLoadedData={() => {
                // Start video playback
                if (videoRef.current) {
                  videoRef.current.play().catch(console.error);
                }
              }}
            >
              <source src={videoSource} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>

          {/* Chat Section with Green Dotted Background */}
          <div className="relative flex-1 flex flex-col overflow-hidden">
            {/* Green dotted background pattern - behind chat */}
            <div className="absolute inset-0 z-0" style={{
              backgroundColor: 'black',
              backgroundSize: '20px 20px',
            }} />

            {/* Chat Messages */}
            <div className="relative flex-1 p-4 space-y-3 overflow-y-auto z-10">
              {displayedMessages.length === 0 && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                  <LoadingSpinner />
                  <p className="text-gray-400 text-sm">Loading...</p>
                </div>
              )}
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
                      'max-w-[75%] px-4 py-3 rounded-2xl',
                      msg.sender === 'user'
                        ? 'bg-gray-700 text-white'
                        : 'bg-gray-800 text-white'
                    )}
                  >
                    <p className="text-sm leading-relaxed">{msg.text}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Continue Button - Always visible, disabled until chat complete */}
            <div className="p-4 bg-black z-10 flex-shrink-0">
              <ResponsiveButton
                onClick={handleContinue}
                fullWidth
                variant={isChatComplete ? 'primary' : 'secondary'}
                disabled={!isChatComplete}
                className={cn(
                  'transition-all duration-300 rounded-full',
                  !isChatComplete 
                    ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
                    : 'bg-green-500 text-black hover:bg-green-600'
                )}
              >
                Continue
              </ResponsiveButton>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  // Format time as HH:MM:SS
  const formatTime = (date: Date) => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  };

  return (
    <div className="h-screen w-screen flex flex-col">
      {/* Top bar (time, wifi, battery) */}
      <div className="flex justify-between items-center p-4 bg-black text-white z-20">
        <span className="text-sm">{formatTime(currentTime)}</span>
        <div className="flex items-center space-x-1">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        </div>
      </div>
      {renderContent()}
    </div>
  );
}
