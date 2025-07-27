import { useState } from "react"
import { ChevronLeft } from "lucide-react"
import ProfileImageUpload from "@/components/EditProfile/profile-image-upload"
import ProfileForm from "@/components/EditProfile/profile-form"

interface EditProfileScreenProps {
  onSave: () => void
}

export default function EditProfileScreen({ onSave }: EditProfileScreenProps) {
  const [profileData, setProfileData] = useState({
    mainPhoto: null as File | null,
    additionalPhotos: [null, null, null, null] as (File | null)[],
    fullName: "",
    universityEmail: "",
    phoneNumber: "",
    dateOfBirth: { day: "", month: "", year: "" },
  })

  const handleSave = () => {
    // Validate and save profile data
    console.log("Saving profile data:", profileData)
    onSave()
  }

  const updateProfileData = (updates: Partial<typeof profileData>) => {
    setProfileData((prev) => ({ ...prev, ...updates }))
  }

  return (
    <div style={{ minHeight: '100vh', background: '#000', color: '#fff', fontFamily: "'Roboto Serif', serif" }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px', paddingTop: 32, height: 56 }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <button style={{ background: 'none', border: 'none', padding: 0, marginRight: 16 }}>
            <ChevronLeft size={24} color="white" />
          </button>
          <h1 style={{ color: '#fff', fontSize: 24, fontWeight: 700, fontFamily: "'Roboto Serif', serif", margin: 0 }}>Profile</h1>
        </div>
        <button onClick={handleSave} style={{ color: '#22FF88', fontSize: 18, fontWeight: 700, background: 'none', border: 'none', fontFamily: "'Roboto Serif', serif", cursor: 'pointer' }}>
          Save
        </button>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 425, margin: '0 auto', padding: '0 16px', marginTop: 16 }}>
        {/* Main Profile Photo */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 16 }}>
          <button
            onClick={() => document.getElementById('main-photo-input')?.click()}
            style={{ width: 120, height: 120, border: '2px dashed #22FF88', borderRadius: 16, background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 8 }}
          >
            {profileData.mainPhoto ? (
              <img
                src={URL.createObjectURL(profileData.mainPhoto) || "/placeholder.svg"}
                alt="Main profile"
                style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 16 }}
              />
            ) : (
              <span style={{ color: '#22FF88', fontSize: 48, fontWeight: 700, lineHeight: 1 }}>+</span>
            )}
          </button>
          <input id="main-photo-input" type="file" accept="image/*" onChange={e => {
            const file = e.target.files?.[0];
            if (file) updateProfileData({ mainPhoto: file });
          }} style={{ display: 'none' }} />
          <span style={{ color: '#aaa', fontSize: 14, marginTop: 4 }}>Choose image</span>
        </div>

        {/* Additional Photos */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 24, justifyContent: 'center' }}>
          {[0, 1, 2, 3].map((index) => (
            <button
              key={index}
              onClick={() => document.getElementById(`additional-photo-input-${index}`)?.click()}
              style={{ width: 56, height: 56, border: '2px dashed #444', borderRadius: 12, background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}
            >
              {profileData.additionalPhotos[index] ? (
                <img
                  src={URL.createObjectURL(profileData.additionalPhotos[index]!) || "/placeholder.svg"}
                  alt={`Additional photo ${index + 1}`}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 12 }}
                />
              ) : (
                <span style={{ color: '#22FF88', fontSize: 28, fontWeight: 700, lineHeight: 1 }}>+</span>
              )}
              <input
                id={`additional-photo-input-${index}`}
                type="file"
                accept="image/*"
                onChange={e => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const newPhotos = [...profileData.additionalPhotos];
                    newPhotos[index] = file;
                    updateProfileData({ additionalPhotos: newPhotos });
                  }
                }}
                style={{ display: 'none' }}
              />
            </button>
          ))}
        </div>

        {/* Profile Form */}
        <ProfileForm profileData={profileData} updateProfileData={updateProfileData} />
      </div>
    </div>
  )
}
