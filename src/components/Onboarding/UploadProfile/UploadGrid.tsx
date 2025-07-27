
import { useState } from "react"
import UploadBox from "./UploadBox"
import CameraWithStar from "./CameraWithStar"

interface UploadedImage {
  file: File | null
  uploadedUrl?: string
}

interface UploadGridProps {
  onImagesChange?: (images: UploadedImage[]) => void
}

export default function UploadGrid({ onImagesChange }: UploadGridProps) {
  const [selectedImages, setSelectedImages] = useState<UploadedImage[]>([
    { file: null }, { file: null }, { file: null }, { file: null }, { file: null }
  ])

  const handleImageSelect = (index: number, file: File, uploadedUrl?: string) => {
    const newImages = [...selectedImages]
    newImages[index] = { file, uploadedUrl }
    setSelectedImages(newImages)
    
    if (onImagesChange) {
      onImagesChange(newImages)
    }
  }

  const handleUploadClick = (index: number) => {
    console.log(`Upload box ${index + 1} clicked`)
    // Handle upload logic here
  }

  return (
    <div className="flex flex-col items-center gap-4 px-8">
      {/* First row - 3 upload boxes */}
      <div className="flex gap-4">
        <UploadBox 
          onClick={() => handleUploadClick(0)} 
          onImageSelect={(file, uploadedUrl) => handleImageSelect(0, file, uploadedUrl)}
          selectedImage={selectedImages[0].file}
          uploadedImageUrl={selectedImages[0].uploadedUrl}
          index={0}
        />
        <UploadBox 
          onClick={() => handleUploadClick(1)} 
          onImageSelect={(file, uploadedUrl) => handleImageSelect(1, file, uploadedUrl)}
          selectedImage={selectedImages[1].file}
          uploadedImageUrl={selectedImages[1].uploadedUrl}
          index={1}
        />
        <UploadBox 
          onClick={() => handleUploadClick(2)} 
          onImageSelect={(file, uploadedUrl) => handleImageSelect(2, file, uploadedUrl)}
          selectedImage={selectedImages[2].file}
          uploadedImageUrl={selectedImages[2].uploadedUrl}
          index={2}
        />
      </div>

      {/* Second row - 2 upload boxes + camera with star */}
      <div className="flex gap-4">
        <UploadBox 
          onClick={() => handleUploadClick(3)} 
          onImageSelect={(file, uploadedUrl) => handleImageSelect(3, file, uploadedUrl)}
          selectedImage={selectedImages[3].file}
          uploadedImageUrl={selectedImages[3].uploadedUrl}
          index={3}
        />
        <UploadBox 
          onClick={() => handleUploadClick(4)} 
          onImageSelect={(file, uploadedUrl) => handleImageSelect(4, file, uploadedUrl)}
          selectedImage={selectedImages[4].file}
          uploadedImageUrl={selectedImages[4].uploadedUrl}
          index={4}
        />
        <CameraWithStar />
      </div>
    </div>
  )
}
