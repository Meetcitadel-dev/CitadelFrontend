"use client"

import { useRef } from "react"
import { X } from "lucide-react"

interface UploadBoxProps {
  onClick?: () => void
  className?: string
  onImageSelect?: (file: File | null, index: number) => void
  selectedImage?: File | null
  uploadedImageUrl?: string
  index: number
  onRemoveImage?: (index: number) => void
}

export default function UploadBox({ 
  onClick, 
  className = "", 
  onImageSelect, 
  selectedImage, 
  uploadedImageUrl,
  index,
  onRemoveImage
}: UploadBoxProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleClick = () => {
    fileInputRef.current?.click()
    if (onClick) {
      onClick()
    }
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && onImageSelect) {
      // Store locally without uploading to S3
      onImageSelect(file, index)
    }
  }

  const handleRemoveImage = (e: React.MouseEvent) => {
    e.stopPropagation() // Prevent triggering the file input
    if (onRemoveImage) {
      onRemoveImage(index)
    }
  }

  return (
    <div
      className={`w-[100px] h-[100px] border-2 border-dashed border-gray-600 rounded-lg flex items-center justify-center cursor-pointer hover:border-gray-500 transition-colors relative ${className}`}
      onClick={handleClick}
    >
      {uploadedImageUrl ? (
        <img
          src={uploadedImageUrl}
          alt="Uploaded"
          className="w-full h-full object-cover rounded-lg"
          loading="lazy"
          decoding="async"
          fetchPriority="low"
        />
      ) : selectedImage ? (
        <img
          src={URL.createObjectURL(selectedImage)}
          alt="Selected"
          className="w-full h-full object-cover rounded-lg"
          loading="lazy"
          decoding="async"
          fetchPriority="low"
        />
      ) : (
        <div className="text-green-500 text-3xl font-light">+</div>
      )}
      
      {/* Remove button - only show when there's an image */}
      {(selectedImage || uploadedImageUrl) && onRemoveImage && (
        <button
          onClick={handleRemoveImage}
          className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      )}
      
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  )
}
