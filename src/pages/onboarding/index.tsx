"use client"

import ConnectStudentsScreen from "@/components/Onboarding/connect-students-screen"
import DateOfBirthScreen from "@/components/Onboarding/date-of-birth-screen"
import EmailInputScreen from "@/components/Onboarding/email-input-screen"
import NameInputScreen from "@/components/Onboarding/name-input-screen"
import OTPInputScreen from "@/components/Onboarding/otp-input-screen"
import SkillsetsScreen from "@/components/Onboarding/skillsets-screen"
import SlideToStartScreen from "@/components/Onboarding/slide-to-start-screen"
import SplashScreen1 from "@/components/Onboarding/splash-screen-1"
import SplashScreen2 from "@/components/Onboarding/splash-screen-2"
import SplashScreen3 from "@/components/Onboarding/splash-screen-3"
import UniversitySelectionScreen from "@/components/Onboarding/university-selection-screen"
import { useState, useEffect } from "react"


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
    setShowConnectScreen(true)
  }

  const handleConnectComplete = () => {
    setShowUniversityScreen(true)
  }

  const handleUniversityComplete = () => {
    setShowEmailScreen(true)
  }

  const handleEmailComplete = () => {
    setShowOTPScreen(true)
  }

  const handleOTPComplete = () => {
    setShowNameScreen(true)
  }

  const handleNameComplete = () => {
    setShowDateScreen(true)
  }

  const handleDateComplete = () => {
    setShowSkillsScreen(true)
  }

  const handleSkillsComplete = () => {
    console.log("Onboarding completed!")
  }

  if (showSkillsScreen) {
    return <SkillsetsScreen onContinue={handleSkillsComplete} />
  }

  if (showDateScreen) {
    return <DateOfBirthScreen onContinue={handleDateComplete} />
  }

  if (showNameScreen) {
    return <NameInputScreen onContinue={handleNameComplete} />
  }

  if (showOTPScreen) {
    return <OTPInputScreen onContinue={handleOTPComplete} />
  }

  if (showEmailScreen) {
    return <EmailInputScreen onContinue={handleEmailComplete} />
  }

  if (showUniversityScreen) {
    return <UniversitySelectionScreen onContinue={handleUniversityComplete} />
  }

  if (showConnectScreen) {
    return <ConnectStudentsScreen onContinue={handleConnectComplete} />
  }

  if (showSlideScreen) {
    return <SlideToStartScreen onSlideComplete={handleSlideComplete} />
  }

  const screens = [<SplashScreen1 key="screen1" />, <SplashScreen2 key="screen2" />, <SplashScreen3 key="screen3" />]

  return <div className="min-h-screen bg-black">{screens[currentScreen]}</div>
}
