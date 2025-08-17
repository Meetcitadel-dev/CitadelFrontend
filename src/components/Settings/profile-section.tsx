
interface ProfileSectionProps {
  name: string
  subtitle: string
  profileImage: string
}

export default function ProfileSection({ name, subtitle, profileImage }: ProfileSectionProps) {
  return (
    <div className="flex flex-col items-center bg-black px-4" style={{ marginTop: '30px' }}>
      <div 
        style={{
          width: '130px',
          height: '130px',
          flexShrink: 0,
          aspectRatio: '1/1',
          borderRadius: '5px',
          overflow: 'hidden'
        }}
      >
        <img
          src={profileImage || "/placeholder.svg"}
          alt={name}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover'
          }}
        />
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
          WebkitLineClamp: 2,
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
        {subtitle}
      </p>
    </div>
  )
}
