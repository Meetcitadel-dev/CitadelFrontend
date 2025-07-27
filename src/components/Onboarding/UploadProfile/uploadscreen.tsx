
import { useState } from "react"
import BackButton from "./BackButton"
import UploadGrid from "./UploadGrid"
import ActionButtons from "./ActionButtons"

interface UploadedImage {
  file: File | null
  uploadedUrl?: string
}

interface UploadScreenProps {
  onComplete: (images?: UploadedImage[]) => void
  onBack?: () => void
}

export default function UploadScreen({ onComplete, onBack }: UploadScreenProps) {
  const [selectedImages, setSelectedImages] = useState<UploadedImage[]>([
    { file: null }, { file: null }, { file: null }, { file: null }, { file: null }
  ])

  const handleBack = () => {
    console.log("Back button clicked")
    if (onBack) {
      onBack()
    }
  }

  const handleSkip = () => {
    console.log("Skip clicked")
    onComplete() // Navigate to next screen
  }

  const handleUpload = () => {
    console.log("Upload pictures clicked")
    onComplete(selectedImages) // Navigate to next screen after upload with images
  }

  const handleImagesChange = (images: UploadedImage[]) => {
    setSelectedImages(images)
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Header with back button */}
      <div className="flex items-center justify-between p-4 pt-6">
        <BackButton onClick={handleBack} />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col justify-between">
        <div className="flex flex-col items-center pt-8">
          {/* Title */}
          <div className="text-center px-8 mb-12">
            <h1 className="text-4xl font-bold leading-tight">
              Please smile
              <br />
              for the camera
            </h1>
          </div>

          {/* Upload Grid */}
          <UploadGrid onImagesChange={handleImagesChange} />

          {/* Description text */}
          <div className="px-8 mt-8 text-center">
            <p className="text-gray-400 text-sm leading-relaxed">
              *Upload at least one photo to unlock all the
              <br />
              features of the platform.
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <ActionButtons onSkip={handleSkip} onUpload={handleUpload} />
      </div>
    </div>
  )
}
