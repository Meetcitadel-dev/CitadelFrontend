import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import SplashScreen1 from "../../components/Onboarding/splash-screen-1"
import SplashScreen2 from "../../components/Onboarding/splash-screen-2"
import SplashScreen3 from "../../components/Onboarding/splash-screen-3"
import SlideToStartScreen from "../../components/Onboarding/slide-to-start-screen"
import ConnectStudentsScreen from "../../components/Onboarding/connect-students-screen"
import UniversitySelectionScreen from "../../components/Onboarding/university-selection-screen"
import EmailInputScreen from "../../components/Onboarding/email-input-screen"
import OTPInputScreen from "../../components/Onboarding/otp-input-screen"
import NameInputScreen from "../../components/Onboarding/name-input-screen"
import DateOfBirthScreen from "../../components/Onboarding/date-of-birth-screen"
import SkillsetsScreen from "../../components/Onboarding/skillsets-screen"
import UploadScreen from "../../components/Onboarding/UploadProfile/uploadscreen"
import BestFriendsScreen from "../../components/Onboarding/best-friends-screen"
import SuccessScreen from "../../components/Onboarding/success-screen"
import DegreeSelection from "../../components/Onboarding/degree-selection"
import { submitOnboardingData } from "@/lib/api";

export default function App() {
  const [currentScreen, setCurrentScreen] = useState(0)
  const [showSlideScreen, setShowSlideScreen] = useState(false)
  const [showConnectScreen, setShowConnectScreen] = useState(false)
  const [showUniversityScreen, setShowUniversityScreen] = useState(false)
  const [showEmailScreen, setShowEmailScreen] = useState(false)
  const [showOTPScreen, setShowOTPScreen] = useState(false)
  const [showNameScreen, setShowNameScreen] = useState(false)
  const [showDateScreen, setShowDateScreen] = useState(false)
  const [showSkillsScreen, setShowSkillsScreen] = useState(false)
  const [showUploadScreen, setShowUploadScreen] = useState(false)
  const [showBestFriendsScreen, setShowBestFriendsScreen] = useState(false)
  const [showSuccessScreen, setShowSuccessScreen] = useState(false)
  const [showDegreeScreen, setShowDegreeScreen] = useState(false)
  const [userEmail, setUserEmail] = useState("");
  const [onboardingData, setOnboardingData] = useState<any>({});

  const navigate = useNavigate();

  useEffect(() => {
    if (currentScreen < 3) {
      const timer = setTimeout(() => {
        if (currentScreen === 2) {
          setShowSlideScreen(true)
        } else {
          setCurrentScreen(currentScreen + 1)
        }
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [currentScreen])

  const handleSlideComplete = () => {
    setShowSlideScreen(false);
    setShowConnectScreen(true);
  }

  const handleConnectComplete = () => {
    setShowConnectScreen(false);
    setShowUniversityScreen(true);
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
  const handleOTPComplete = () => {
    setShowOTPScreen(false);
    setShowNameScreen(true);
  };
  const handleNameComplete = (name: string, gender: string) => {
    console.log('Name and gender collected:', { name, gender });
    setOnboardingData((prev: any) => ({ ...prev, name, gender }));
    setShowNameScreen(false);
    setShowDateScreen(true);
  };
  const handleDateComplete = (dob: { day: string; month: string; year: string }) => {
    setOnboardingData((prev: any) => ({ ...prev, dob }));
    setShowDateScreen(false);
    setShowDegreeScreen(true);
  };
  const handleDegreeComplete = (degree: string, year: string) => {
    console.log('Degree and year collected:', { degree, year });
    setOnboardingData((prev: any) => ({ ...prev, degree, year }));
    setShowDegreeScreen(false);
    setShowSkillsScreen(true);
  };
  const handleSkillsComplete = (skills: string[]) => {
    setOnboardingData((prev: any) => ({ ...prev, skills }));
    setShowSkillsScreen(false);
    setShowUploadScreen(true);
  };
  
  const handleUploadComplete = (images?: any[]) => {
    if (images) {
      setOnboardingData((prev: any) => ({ ...prev, uploadedImages: images }));
    }
    setShowUploadScreen(false);
    setShowBestFriendsScreen(true);
  };
  
  const handleUploadBack = () => {
    setShowUploadScreen(false);
    setShowSkillsScreen(true);
  };
  const handleBestFriendsComplete = async (friends: string[]) => {
    const finalData = { ...onboardingData, friends };
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

  // After success, redirect to /explore after 3 seconds
  useEffect(() => {
    if (showSuccessScreen) {
      const timer = setTimeout(() => {
        navigate("/explore");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showSuccessScreen, navigate]);

  if (showSuccessScreen) {
    return <SuccessScreen onComplete={() => {}} />
  }

  if (showBestFriendsScreen) {
    return <BestFriendsScreen value={onboardingData.friends} onContinue={handleBestFriendsComplete} />;
  }
  if (showUploadScreen) {
    return <UploadScreen onComplete={handleUploadComplete} onBack={handleUploadBack} />;
  }
  if (showSkillsScreen) {
    return <SkillsetsScreen value={onboardingData.skills} onContinue={handleSkillsComplete} />;
  }
  if (showDateScreen) {
    return <DateOfBirthScreen value={onboardingData.dob} onContinue={handleDateComplete} />;
  }
  if (showNameScreen) {
    return <NameInputScreen value={onboardingData.name || ""} gender={onboardingData.gender} onContinue={handleNameComplete} />;
  }
  if (showOTPScreen) {
    return <OTPInputScreen email={userEmail} onContinue={handleOTPComplete} />;
  }
  if (showEmailScreen) {
    return <EmailInputScreen value={onboardingData.email} onContinue={handleEmailComplete} />;
  }
  if (showUniversityScreen) {
    return <UniversitySelectionScreen value={onboardingData.university} onContinue={handleUniversityComplete} />;
  }
  if (showDegreeScreen) {
    return <DegreeSelection value={{ degree: onboardingData.degree, year: onboardingData.year }} onContinue={handleDegreeComplete} />;
  }
  if (showConnectScreen) {
    return <ConnectStudentsScreen onContinue={handleConnectComplete} />;
  }
  if (showSlideScreen) {
    return <SlideToStartScreen onSlideComplete={handleSlideComplete} />;
  }

  const screens = [<SplashScreen1 key="screen1" />, <SplashScreen2 key="screen2" />, <SplashScreen3 key="screen3" />]

  return <div className="min-h-screen bg-black">{screens[currentScreen]}</div>
}
