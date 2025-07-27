
import type React from "react"

import { useRef } from "react"
import { Plus } from "lucide-react"

interface ProfileImageUploadProps {
  profileData: {
    mainPhoto: File | null
    additionalPhotos: (File | null)[]
  }
  updateProfileData: (updates: any) => void
}

export default function ProfileImageUpload({ profileData, updateProfileData }: ProfileImageUploadProps) {
  const mainPhotoRef = useRef<HTMLInputElement>(null)
  const additionalPhotoRefs = useRef<(HTMLInputElement | null)[]>([])

  const handleMainPhotoSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      updateProfileData({ mainPhoto: file })
    }
  }

  const handleAdditionalPhotoSelect = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const newAdditionalPhotos = [...profileData.additionalPhotos]
      newAdditionalPhotos[index] = file
      updateProfileData({ additionalPhotos: newAdditionalPhotos })
    }
  }

  return (
    <div className="mb-8">
      {/* Main Profile Photo */}
      <div className="mb-4">
        <button
          onClick={() => mainPhotoRef.current?.click()}
          className="w-32 h-32 border-2 border-dashed border-blue-500 rounded-lg flex items-center justify-center bg-transparent hover:bg-gray-900 transition-colors"
        >
          {profileData.mainPhoto ? (
            <img
              src={URL.createObjectURL(profileData.mainPhoto) || "/placeholder.svg"}
              alt="Main profile"
              className="w-full h-full object-cover rounded-lg"
            />
          ) : (
            <Plus size={32} color="#22C55E" />
          )}
        </button>
        <input ref={mainPhotoRef} type="file" accept="image/*" onChange={handleMainPhotoSelect} className="hidden" />
      </div>

      {/* Choose Image Text */}
      <p className="text-gray-400 text-sm mb-4">Choose image</p>

      {/* Additional Photos */}
      <div className="flex space-x-3">
        {/* First additional photo with sample image */}
        <div className="relative">
          <button
            onClick={() => additionalPhotoRefs.current[0]?.click()}
            className="w-16 h-16 rounded-lg overflow-hidden"
          >
            {profileData.additionalPhotos[0] ? (
              <img
                src={URL.createObjectURL(profileData.additionalPhotos[0]) || "/placeholder.svg"}
                alt="Additional photo 1"
                className="w-full h-full object-cover"
              />
            ) : (
              <img
                src="/placeholder.svg?height=64&width=64"
                alt="Sample profile"
                className="w-full h-full object-cover"
              />
            )}
          </button>
          <input
            ref={(el) => { additionalPhotoRefs.current[0] = el; }}
            type="file"
            accept="image/*"
            onChange={(e) => handleAdditionalPhotoSelect(0, e)}
            className="hidden"
          />
        </div>

        {/* Remaining 3 additional photo slots */}
        {[1, 2, 3].map((index) => (
          <div key={index}>
            <button
              onClick={() => additionalPhotoRefs.current[index]?.click()}
              className="w-16 h-16 border-2 border-dashed border-gray-600 rounded-lg flex items-center justify-center bg-transparent hover:bg-gray-900 transition-colors"
            >
              {profileData.additionalPhotos[index] ? (
                <img
                  src={URL.createObjectURL(profileData.additionalPhotos[index]!) || "/placeholder.svg"}
                  alt={`Additional photo ${index + 1}`}
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <Plus size={20} color="#22C55E" />
              )}
            </button>
            <input
              ref={(el) => { additionalPhotoRefs.current[index] = el; }}
              type="file"
              accept="image/*"
              onChange={(e) => handleAdditionalPhotoSelect(index, e)}
              className="hidden"
            />
          </div>
        ))}
      </div>
    </div>
  )
}
