
interface ProfileSectionProps {
  name: string
  subtitle: string
  profileImage: string
}

export default function ProfileSection({ name, subtitle, profileImage }: ProfileSectionProps) {
  return (
    <div className="flex flex-col items-center py-8 bg-black">
      <div className="w-24 h-24 rounded-2xl overflow-hidden mb-4">
        <img
          src={profileImage || "/placeholder.svg"}
          alt={name}
          width={96}
          height={96}
          className="w-full h-full object-cover"
        />
      </div>
      <h2 className="text-white text-xl font-medium mb-1">{name}</h2>
      <p className="text-green-400 text-sm">{subtitle}</p>
    </div>
  )
}
