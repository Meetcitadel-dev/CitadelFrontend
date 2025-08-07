
import { useState } from "react"
import { getAuthToken } from "@/lib/utils"
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
  const [isUploading, setIsUploading] = useState(false)

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

  const handleUpload = async () => {
    console.log("Upload pictures clicked")
    
    // Get images that have files selected
    const imagesToUpload = selectedImages.filter(img => img.file !== null)
    
    if (imagesToUpload.length === 0) {
      console.log("No images to upload")
      onComplete() // Navigate to next screen without images
      return
    }

    setIsUploading(true)
    
    try {
      const token = getAuthToken()
      
      if (!token) {
        throw new Error('No authentication token found. Please complete the onboarding process first.')
      }

      const uploadedImages: UploadedImage[] = []
      
      // Upload each image to S3
      for (let i = 0; i < selectedImages.length; i++) {
        const image = selectedImages[i]
        if (image.file) {
          try {
            const response = await uploadImageToS3(image.file, token)
            console.log('Upload response:', response)
            
            // Check for different possible response formats
            const imageUrl = response.imageUrl || response.cloudFrontUrl || response.url || response.signedUrl
            if (response.success && imageUrl) {
              uploadedImages.push({ file: image.file, uploadedUrl: imageUrl })
            } else {
              // If upload failed, still include the file for local preview
              uploadedImages.push({ file: image.file })
            }
          } catch (error: any) {
            console.error(`Upload failed for image ${i}:`, error)
            // If upload failed, still include the file for local preview
            uploadedImages.push({ file: image.file })
          }
        } else {
          uploadedImages.push({ file: null })
        }
      }
      
      onComplete(uploadedImages) // Navigate to next screen with uploaded images
    } catch (error: any) {
      console.error('Upload process failed:', error)
      // Even if upload fails, continue with local images
      onComplete(selectedImages)
    } finally {
      setIsUploading(false)
    }
  }

  const uploadImageToS3 = async (file: File, token: string) => {
    const formData = new FormData()
    formData.append('image', file)
    
    const base = import.meta.env.VITE_API_URL || 'http://localhost:3000'
    const url = base.replace(/\/$/, '') + '/api/profile/upload'
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    })
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Upload failed' }))
      throw new Error(errorData.error || 'Upload failed')
    }
    
    return await response.json()
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
        <ActionButtons onSkip={handleSkip} onUpload={handleUpload} isUploading={isUploading} />
      </div>
    </div>
  )
}
