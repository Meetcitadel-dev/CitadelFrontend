import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
// Removed splash screens per requirement
import SlideToStartScreen from "../../components/Onboarding/slide-to-start-screen"
import ConnectStudentsScreen from "../../components/Onboarding/connect-students-screen"
import UniversitySelectionScreen from "../../components/Onboarding/university-selection-screen"
import EmailInputScreen from "../../components/Onboarding/email-input-screen"
import OTPInputScreen from "../../components/Onboarding/otp-input-screen"
import GenderSelectionScreen from "../../components/Onboarding/gender-selection-screen"
import UploadScreen from "../../components/Onboarding/UploadProfile/uploadscreen"
import FindFriendsScreen from "../../components/Onboarding/find-friends-screen"
import BestFriendsScreen from "../../components/Onboarding/best-friends-screen"
import SuccessScreen from "../../components/Onboarding/success-screen"
import DegreeSelection from "../../components/Onboarding/degree-selection"
import LoginEmailScreen from "../../components/Onboarding/login-email-screen"
import { submitOnboardingData, refreshAccessToken } from "@/lib/api";
import { getAuthToken } from "@/lib/utils";

export default function App() {
  // Start directly from Slide screen
  // (no splash sequencing)
  const [showSlideScreen, setShowSlideScreen] = useState(true)
  const [showConnectScreen, setShowConnectScreen] = useState(false)
  const [showUniversityScreen, setShowUniversityScreen] = useState(false)
  const [showEmailScreen, setShowEmailScreen] = useState(false)
  const [showOTPScreen, setShowOTPScreen] = useState(false)
  const [showGenderScreen, setShowGenderScreen] = useState(false)
  const [showDegreeScreen, setShowDegreeScreen] = useState(false)
  const [showUploadScreen, setShowUploadScreen] = useState(false)
  const [showAllowScreen, setShowAllowScreen] = useState(false)
  const [showBestFriendsScreen, setShowBestFriendsScreen] = useState(false)
  const [showSuccessScreen, setShowSuccessScreen] = useState(false)
  const [showLoginEmailScreen, setShowLoginEmailScreen] = useState(false)
  const [isLoginMode, setIsLoginMode] = useState(false)
  const [userEmail, setUserEmail] = useState("");
  const [onboardingData, setOnboardingData] = useState<any>({});

  const navigate = useNavigate();

  // Check authentication early
  const checkAuthAfterSplash = async () => {
    // First check if we already have a token in localStorage
    const existingToken = getAuthToken()
    if (existingToken) {
      // User is already authenticated, check if they need to complete quiz
      try {
        const response = await fetch('/api/v1/quiz/results', {
          headers: {
            'Authorization': `Bearer ${existingToken}`,
            'Content-Type': 'application/json'
          }
        });

        // Check if response is OK and is JSON
        if (!response.ok) {
          // If 401 or 404, user hasn't completed quiz or token is invalid
          if (response.status === 401 || response.status === 404) {
            console.log('User not authenticated or quiz not completed');
            // Continue with onboarding flow
            return;
          }
          // For 400 error (user hasn't completed quiz), redirect to quiz
          if (response.status === 400) {
            navigate('/onboarding');
            return;
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          console.error('Response is not JSON, continuing with onboarding');
          return;
        }

        const data = await response.json();

        if (data.success && data.data.hasCompletedQuiz) {
          // User already completed quiz, redirect to main app
          navigate('/explore');
          return;
        } else if (data.success && !data.data.hasCompletedQuiz) {
          // User needs to complete quiz first
          navigate('/onboarding');
          return;
        }
      } catch (error) {
        console.error('Error checking quiz status:', error);
        // If error checking quiz status, continue with onboarding
        // Don't redirect to quiz automatically on error
        return;
      }

      // User is already authenticated and completed quiz, redirect to main app
      navigate("/explore")
      return
    }

    // If no token, try to refresh from cookie
    try {
      const res = await refreshAccessToken()
      if (res?.success && res.tokens?.accessToken) {
        // User is authenticated, redirect to main app
        navigate("/explore")
        return
      }
    } catch (e) {
      // No valid session, continue with onboarding
    }
  }

  // Immediately check auth on mount (no splash)
  useEffect(() => {
    const timer = setTimeout(() => {
      checkAuthAfterSplash()
    }, 100)
    return () => clearTimeout(timer)
  }, [])

  // (Removed splash-dependent check)

  const handleSlideComplete = () => {
    setShowSlideScreen(false);
    setShowConnectScreen(true);
  }

  const handleConnectComplete = () => {
    setShowConnectScreen(false);
    setShowUniversityScreen(true);
  }

  const handleLoginClick = () => {
    setShowConnectScreen(false);
    setIsLoginMode(true);
    setShowLoginEmailScreen(true);
  }

  // Update handlers to collect data from each step
  const handleUniversityComplete = (university: any) => {
    setOnboardingData((prev: any) => ({ ...prev, university }));
    setShowUniversityScreen(false);
    setShowEmailScreen(true);
  };
  const handleEmailComplete = (email: string) => {
    setOnboardingData((prev: any) => ({ ...prev, email }));
    setShowEmailScreen(false);
    setUserEmail(email);
    setShowOTPScreen(true);
  };


  const handleLoginEmailComplete = (email: string) => {
    setUserEmail(email);
    setShowLoginEmailScreen(false);
    setShowOTPScreen(true);
  };

  const handleLoginEmailBack = () => {
    setShowLoginEmailScreen(false);
    setShowConnectScreen(true);
  };

  // Add back handlers for all screens
  const handleUniversityBack = () => {
    setShowUniversityScreen(false);
    setShowConnectScreen(true);
  };

  const handleEmailBack = () => {
    setShowEmailScreen(false);
    setShowUniversityScreen(true);
  };

  const handleOTPBack = () => {
    setShowOTPScreen(false);
    if (isLoginMode) {
      setShowLoginEmailScreen(true);
    } else {
      setShowEmailScreen(true);
    }
  };

  const handleGenderBack = () => {
    setShowGenderScreen(false);
    setShowOTPScreen(true);
  };

  const handleDegreeBack = () => {
    setShowDegreeScreen(false);
    setShowGenderScreen(true);
  };

  const handleOTPComplete = async () => {
    // If we came from login flow, redirect directly to explore
    if (isLoginMode) {
      const token = getAuthToken();
      console.log('🔐 Login mode - Token available:', !!token);

      if (!token) {
        console.error('❌ No token available after OTP verification');
        alert('Authentication failed. Please try again.');
        return;
      }

      console.log('✅ Login successful - Redirecting to /explore');

      // Hide OTP screen and redirect to explore
      setShowOTPScreen(false);
      navigate('/explore');
    } else {
      // If we came from signup flow, continue to gender screen
      setShowOTPScreen(false);
      setShowGenderScreen(true);
    }
  };

  const handleGenderComplete = (gender: string) => {
    console.log('Gender collected:', gender);
    setOnboardingData((prev: any) => ({ ...prev, gender }));
    setShowGenderScreen(false);
    setShowDegreeScreen(true);
  };

  const handleDegreeComplete = (degree: string, year: string) => {
    console.log('Degree and year collected:', { degree, year });
    setOnboardingData((prev: any) => ({ ...prev, degree, year }));
    setShowDegreeScreen(false);
    setShowUploadScreen(true);
  };
  
  const handleUploadComplete = (images?: any[]) => {
    if (images) {
      setOnboardingData((prev: any) => ({ ...prev, uploadedImages: images }));
    }
    setShowUploadScreen(false);
    setShowAllowScreen(true);
  };

  const handleUploadBack = () => {
    setShowUploadScreen(false);
    setShowDegreeScreen(true);
  };

  const handleAllowContacts = () => {
    setShowAllowScreen(false);
    // Go to best friends screen
    setShowBestFriendsScreen(true);
  };

  const handleSkipContacts = async () => {
    setShowAllowScreen(false);

    // Skip best friends, go directly to success
    // Add default values for missing fields
    const finalData = {
      ...onboardingData,
      friends: [],
      skills: onboardingData.skills || [],
      name: onboardingData.name || '',
      dob: onboardingData.dob || null
    };

    // Debug: Log the complete data structure
    console.log('=== ONBOARDING DATA DEBUG (SKIP) ===');
    console.log('Complete onboarding data:', finalData);
    console.log('Data structure:', {
      university: finalData.university,
      email: finalData.email,
      name: finalData.name,
      gender: finalData.gender,
      dob: finalData.dob,
      degree: finalData.degree,
      year: finalData.year,
      skills: finalData.skills,
      uploadedImages: finalData.uploadedImages,
      friends: finalData.friends
    });
    console.log('=== END DEBUG ===');

    // Submit all data to backend
    try {
      const result = await submitOnboardingData(finalData);
      console.log('Onboarding API response:', result);
      if (result.success) {
        setShowSuccessScreen(true);
      } else {
        // Handle error - show error message or retry
        console.error('Onboarding failed:', result.message);
        alert('Onboarding failed. Please try again.');
        // Stay on the current screen to allow retry
        setShowAllowScreen(true);
      }
    } catch (e: any) {
      console.error('Onboarding error:', e);
      alert('Onboarding failed. Please try again.');
      // Stay on the current screen to allow retry
      setShowAllowScreen(true);
    }
  };
  const handleBestFriendsComplete = async (friends: string[]) => {
    // Add default values for missing fields
    const finalData = {
      ...onboardingData,
      friends,
      skills: onboardingData.skills || [],
      name: onboardingData.name || '',
      dob: onboardingData.dob || null
    };
    setOnboardingData((prev: any) => ({ ...prev, friends }));
    setShowBestFriendsScreen(false);

    // Debug: Log the complete data structure
    console.log('=== ONBOARDING DATA DEBUG ===');
    console.log('Complete onboarding data:', finalData);
    console.log('Data structure:', {
      university: finalData.university,
      email: finalData.email,
      name: finalData.name,
      gender: finalData.gender,
      dob: finalData.dob,
      degree: finalData.degree,
      year: finalData.year,
      skills: finalData.skills,
      uploadedImages: finalData.uploadedImages,
      friends: finalData.friends
    });
    console.log('=== END DEBUG ===');

    // Submit all data to backend
    try {
      const result = await submitOnboardingData(finalData);
      console.log('Onboarding API response:', result);
      if (result.success) {
        setShowSuccessScreen(true);
      } else {
        // Handle error - show error message or retry
        console.error('Onboarding failed:', result.message);
        alert('Onboarding failed. Please try again.');
        // Stay on the current screen to allow retry
        setShowBestFriendsScreen(true);
      }
    } catch (e: any) {
      console.error('Onboarding error:', e);
      alert('Onboarding failed. Please try again.');
      // Stay on the current screen to allow retry
      setShowBestFriendsScreen(true);
    }
  };

  // After success, check quiz status and redirect accordingly
  useEffect(() => {
    if (showSuccessScreen) {
      const checkQuizAndRedirect = async () => {
        const token = getAuthToken();
        if (token) {
          try {
            const response = await fetch('/api/v1/quiz/results', {
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              }
            });

            if (response.ok) {
              const contentType = response.headers.get('content-type');
              if (contentType && contentType.includes('application/json')) {
                const data = await response.json();

                if (data.success && data.data.hasCompletedQuiz) {
                  // User already completed quiz, go to explore
                  setTimeout(() => navigate('/explore'), 2000);
                  return;
                }
              }
            }
          } catch (error) {
            console.error('Error checking quiz status:', error);
          }
        }

        // If quiz not completed or error, redirect to quiz
        setTimeout(() => navigate("/login"), 2000);
      };

      checkQuizAndRedirect();
    }
  }, [showSuccessScreen, navigate]);

  // New Flow Order: University → Email → OTP → Gender → Degree → Upload → Allow/Skip → BestFriends → Success

  if (showSuccessScreen) {
    return <SuccessScreen onComplete={() => {}} />
  }

  if (showBestFriendsScreen) {
    return <BestFriendsScreen value={onboardingData.friends} onContinue={handleBestFriendsComplete} />;
  }

  if (showAllowScreen) {
    return <FindFriendsScreen onAllowContacts={handleAllowContacts} onSkip={handleSkipContacts} />;
  }

  if (showUploadScreen) {
    return <UploadScreen onComplete={handleUploadComplete} onBack={handleUploadBack} />;
  }

  if (showDegreeScreen) {
    return <DegreeSelection value={{ degree: onboardingData.degree, year: onboardingData.year }} onContinue={handleDegreeComplete} onBack={handleDegreeBack} />;
  }

  if (showGenderScreen) {
    return <GenderSelectionScreen value={onboardingData.gender} onContinue={handleGenderComplete} onBack={handleGenderBack} />;
  }

  if (showOTPScreen) {
    return <OTPInputScreen email={userEmail} onContinue={handleOTPComplete} onBack={handleOTPBack} />;
  }

  if (showEmailScreen) {
    return <EmailInputScreen value={onboardingData.email} onContinue={handleEmailComplete} onBack={handleEmailBack} />;
  }

  if (showLoginEmailScreen) {
    return <LoginEmailScreen onContinue={handleLoginEmailComplete} onBack={handleLoginEmailBack} />;
  }

  if (showUniversityScreen) {
    return <UniversitySelectionScreen value={onboardingData.university} onContinue={handleUniversityComplete} onBack={handleUniversityBack} />;
  }

  if (showConnectScreen) {
    return <ConnectStudentsScreen onContinue={handleConnectComplete} onLogin={handleLoginClick} />;
  }

  if (showSlideScreen) {
    return <SlideToStartScreen onSlideComplete={handleSlideComplete} />;
  }

  // No splash screens: default to slide screen
  return <div className="min-h-screen bg-black"><SlideToStartScreen onSlideComplete={handleSlideComplete} /></div>
}
