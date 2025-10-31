
import ProfileAvatar from "@/components/Common/ProfileAvatar"
import { Plus } from "lucide-react"

interface ProfileSectionProps {
  name: string
  profileImage: string
  userId: string
}

// Generate user ID tag from name (e.g., "Nisarg Patel" -> "#NP7F2")
function generateUserIdTag(name: string, userId: string): string {
  const nameParts = name.trim().split(' ')
  const initials = nameParts
    .slice(0, 2)
    .map(part => part[0]?.toUpperCase() || '')
    .join('')

  // Use last 3 characters of userId for uniqueness
  const uniqueCode = userId.slice(-3).toUpperCase()

  return `#${initials}${uniqueCode}`
}

export default function ProfileSection({ name, profileImage, userId }: ProfileSectionProps) {
  const hasProfileImage = profileImage && profileImage !== "/placeholder.svg"
  const userIdTag = generateUserIdTag(name, userId)

  return (
    <div className="flex flex-col items-center bg-black px-4" style={{ marginTop: '30px' }}>
      <div
        style={{
          width: '130px',
          height: '130px',
          flexShrink: 0,
          aspectRatio: '1/1',
          borderRadius: '5px',
          overflow: 'hidden',
          border: hasProfileImage ? 'none' : '2px dashed rgba(255, 255, 255, 0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: hasProfileImage ? 'transparent' : 'rgba(255, 255, 255, 0.05)'
        }}
      >
        {hasProfileImage ? (
          <ProfileAvatar
            profileImage={profileImage}
            userId={userId}
            alt={name}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
            loading="lazy"
            decoding="async"
            fetchPriority="low"
          />
        ) : (
          <Plus className="w-8 h-8 text-green-400" />
        )}
      </div>
      <h2
        style={{
          display: '-webkit-box',
          WebkitBoxOrient: 'vertical',
          WebkitLineClamp: 2,
          overflow: 'hidden',
          color: '#FFF',
          textAlign: 'center',
          textOverflow: 'ellipsis',
          fontFamily: 'Calistoga',
          fontSize: '24px',
          fontStyle: 'normal',
          fontWeight: 400,
          lineHeight: 'normal',
          marginTop: '25px',
          marginBottom: '8px'
        }}
      >
        {name}
      </h2>
      <p
        style={{
          display: '-webkit-box',
          WebkitBoxOrient: 'vertical',
          WebkitLineClamp: 1,
          overflow: 'hidden',
          color: '#1BEA7B',
          textAlign: 'center',
          textOverflow: 'ellipsis',
          fontFamily: 'Inter',
          fontSize: '17px',
          fontStyle: 'normal',
          fontWeight: 400,
          lineHeight: 'normal'
        }}
      >
        {userIdTag}
      </p>
    </div>
  )
}
