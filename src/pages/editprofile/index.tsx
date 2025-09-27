import { useState, useEffect } from "react"
import { ChevronLeft } from "lucide-react"
import { useNavigate } from "react-router-dom"
import ProfileForm from "@/components/EditProfile/profile-form"
import { getCurrentUserProfile, updateUserProfile } from "@/lib/api"
import { getAuthToken } from "@/lib/utils"

interface EditProfileScreenProps {
  onSave?: () => void
}

export default function EditProfileScreen({ onSave }: EditProfileScreenProps) {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [profileData, setProfileData] = useState({
    mainPhoto: null as File | null,
    additionalPhotos: [null, null, null, null] as (File | null)[],
    fullName: "",
    universityEmail: "",
    phoneNumber: "",
    dateOfBirth: { day: "", month: "", year: "" },
    gender: "",
    college: "",
    degree: "",
    enrolmentYear: "",
    portfolioLink: "",
    aboutMe: "",
    extraCurricular: [] as string[],
    sports: "",
    movies: "",
    tvShows: "",
    teams: "",
  })

  // Load current user data
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const token = getAuthToken()
        if (!token) {
          console.error('No authentication token found')
          navigate('/onboarding')
          return
        }

        const response = await getCurrentUserProfile(token)
        if (response.success) {
          const userData = response.data
          
          // Parse date of birth
          let day = "", month = "", year = ""
          if (userData.dateOfBirth) {
            const date = new Date(userData.dateOfBirth)
            day = date.getDate().toString().padStart(2, '0')
            month = (date.getMonth() + 1).toString().padStart(2, '0')
            year = date.getFullYear().toString()
          }

          setProfileData({
            mainPhoto: null,
            additionalPhotos: [null, null, null, null],
            fullName: userData.name || "",
            universityEmail: userData.email || "",
            phoneNumber: userData.phoneNumber || "",
            dateOfBirth: { day, month, year },
            gender: userData.gender || "",
            college: userData.university?.name || "",
            degree: userData.degree || "",
            enrolmentYear: userData.year || "",
            portfolioLink: userData.portfolioLink || "",
            aboutMe: userData.aboutMe || "",
            extraCurricular: userData.skills || [],
            sports: userData.sports || "",
            movies: userData.movies || "",
            tvShows: userData.tvShows || "",
            teams: userData.teams || "",
          })
        }
      } catch (error) {
        console.error('Error loading user data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadUserData()
  }, [navigate])

  const handleSave = async () => {
    try {
      setSaving(true)
      const token = getAuthToken()
      if (!token) {
        console.error('No authentication token found')
        return
      }

      // Prepare data for API
      const updateData = {
        name: profileData.fullName,
        gender: profileData.gender,
        degree: profileData.degree,
        year: profileData.enrolmentYear,
        skills: profileData.extraCurricular,
        // Add new fields that need to be added to backend
        aboutMe: profileData.aboutMe,
        sports: profileData.sports,
        movies: profileData.movies,
        tvShows: profileData.tvShows,
        teams: profileData.teams,
        portfolioLink: profileData.portfolioLink,
        phoneNumber: profileData.phoneNumber,
        dateOfBirth: profileData.dateOfBirth.day && profileData.dateOfBirth.month && profileData.dateOfBirth.year 
          ? `${profileData.dateOfBirth.year}-${profileData.dateOfBirth.month}-${profileData.dateOfBirth.day}`
          : undefined,
      }

      // Call the update profile API
      const response = await updateUserProfile(updateData, token)
      if (response.success) {
        console.log("Profile updated successfully")
        navigate('/profile')
        if (onSave) onSave()
      } else {
        console.error('Failed to update profile:', response.message)
        // You might want to show an error message to the user here
      }
    } catch (error) {
      console.error('Error saving profile:', error)
    } finally {
      setSaving(false)
    }
  }

  const updateProfileData = (updates: Partial<typeof profileData>) => {
    setProfileData((prev) => ({ ...prev, ...updates }))
  }

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#000', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div>Loading...</div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#000', color: '#fff', fontFamily: "'Roboto Serif', serif" }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px', paddingTop: 32, height: 56 }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <button 
            style={{ background: 'none', border: 'none', padding: 0, marginRight: 16, cursor: 'pointer' }}
            onClick={() => navigate('/profile')}
          >
              <ChevronLeft className="w-6 h-6 text-white" />
          </button>
          <h1 style={{ color: '#fff', fontSize: 24, fontWeight: 700, fontFamily: "'Roboto Serif', serif", margin: 0 }}>Profile</h1>
        </div>
        <button 
          onClick={handleSave} 
          disabled={saving}
          style={{ 
            color: saving ? '#666' : '#22FF88', 
            fontSize: 18, 
            fontWeight: 700, 
            background: 'none', 
            border: 'none', 
            fontFamily: "'Roboto Serif', serif", 
            cursor: saving ? 'not-allowed' : 'pointer' 
          }}
        >
          {saving ? 'Saving...' : 'Save'}
        </button>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 425, margin: '0 auto', padding: '0 16px', marginTop: 16 }}>
        {/* Main Profile Photo */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 16 }}>
          <button
            onClick={() => {
              if (typeof document !== 'undefined') {
                document.getElementById('main-photo-input')?.click()
              }
            }}
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
              onClick={() => {
                if (typeof document !== 'undefined') {
                  document.getElementById(`additional-photo-input-${index}`)?.click()
                }
              }}
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
