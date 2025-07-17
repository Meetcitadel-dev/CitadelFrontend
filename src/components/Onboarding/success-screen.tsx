
import { useEffect } from "react"
import SucessIcon from '@/assets/Mask group.png'

interface SuccessScreenProps {
  onComplete: () => void
}

export default function SuccessScreen({ onComplete }: SuccessScreenProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete()
    }, 3000) 

    return () => clearTimeout(timer)
  }, [onComplete])

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center">
        {/* Success Icon */}
        <div className="mb-8 flex justify-center">
          <img src={SucessIcon} alt="Success" width={80} height={80} />
        </div>

        {/* Success Text */}
        <h1 className="text-white text-4xl font-bold">Success!</h1>
      </div>
    </div>
  )
}
