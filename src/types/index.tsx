export interface SplashScreenProps {
  onComplete?: () => void
}

export interface SlideToStartScreenProps {
  onSlideComplete: () => void
}

export interface ConnectStudentsScreenProps {
  onContinue: () => void
}

export interface UniversitySelectionScreenProps {
  onContinue: () => void
}

export interface EmailInputScreenProps {
  onContinue: () => void
}

export interface OTPInputScreenProps {
  onContinue: () => void
}

export interface NameInputScreenProps {
  onContinue: () => void
}

export interface DateOfBirthScreenProps {
  onContinue: () => void
}

export interface SkillsetsScreenProps {
  onContinue: () => void
}

export interface AuthFormData {
  firstName?: string
  lastName?: string
  email: string
  password: string
  confirmPassword?: string
}

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
}
