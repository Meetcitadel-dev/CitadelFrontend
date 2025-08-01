"use client"

import { useRef, useState } from "react"
import { getAuthToken } from "@/lib/utils"

interface UploadBoxProps {
  onClick?: () => void
  className?: string
  onImageSelect?: (file: File, uploadedImageUrl?: string) => void
  selectedImage?: File | null
  uploadedImageUrl?: string
  index: number
}

export default function UploadBox({ 
  onClick, 
  className = "", 
  onImageSelect, 
  selectedImage, 
  uploadedImageUrl,
  index 
}: UploadBoxProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isUploading, setIsUploading] = useState(false)

  const handleClick = () => {
    fileInputRef.current?.click()
    if (onClick) {
      onClick()
    }
  }

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && onImageSelect) {
      setIsUploading(true)
      try {
        // Upload to S3 and get the response
        const response = await uploadImageToS3(file)
        console.log('Upload response:', response) // Debug log
        
        // Check for different possible response formats
        const imageUrl = response.imageUrl || response.cloudFrontUrl || response.url || response.signedUrl
        if (response.success && imageUrl) {
          onImageSelect(file, imageUrl)
        } else {
          // If upload failed but we have a file, still pass it for local preview
          onImageSelect(file)
        }
      } catch (error: any) {
        console.error('Upload failed:', error)
        // Show error to user but allow local preview
        console.warn(`Upload to S3 failed: ${error.message}. Using local preview instead.`)
        // If upload failed but we have a file, still pass it for local preview
        onImageSelect(file)
      } finally {
        setIsUploading(false)
      }
    }
  }

  const uploadImageToS3 = async (file: File) => {
    try {
      const token = getAuthToken()
      
      if (!token) {
        throw new Error('No authentication token found. Please complete the onboarding process first.')
      }
      
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
    } catch (error) {
      console.error('S3 upload error:', error)
      throw error
    }
  }

  return (
    <div
      className={`w-[100px] h-[100px] border-2 border-dashed border-gray-600 rounded-lg flex items-center justify-center cursor-pointer hover:border-gray-500 transition-colors relative ${className}`}
      onClick={handleClick}
    >
      {isUploading ? (
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-500"></div>
        </div>
      ) : uploadedImageUrl ? (
        <img
          src={uploadedImageUrl}
          alt="Uploaded"
          className="w-full h-full object-cover rounded-lg"
        />
      ) : selectedImage ? (
        <img
          src={URL.createObjectURL(selectedImage)}
          alt="Selected"
          className="w-full h-full object-cover rounded-lg"
        />
      ) : (
        <div className="text-green-500 text-3xl font-light">+</div>
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
