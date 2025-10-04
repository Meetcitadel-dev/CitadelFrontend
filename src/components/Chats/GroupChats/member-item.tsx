import { MessageSquare, Minus } from "lucide-react"
import { Button } from "@/components/ui/button"
import ProfileAvatar from "@/components/Common/ProfileAvatar"

interface Member {
  id: string
  name: string
  location: string
  avatar?: string
}

interface MemberItemProps {
  member: Member
  onRemoveMember?: (memberId: string) => void
  onMessageMember?: (memberId: string) => void
  canRemove?: boolean
  canMessage?: boolean
}

export default function MemberItem({ 
  member, 
  onRemoveMember, 
  onMessageMember, 
  canRemove = false, 
  canMessage = false 
}: MemberItemProps) {
  return (
    <div className="flex items-center justify-between p-4 hover:bg-gray-900">
      <div className="flex items-center gap-3">
        <ProfileAvatar
          profileImage={member.avatar}
          userId={member.id}
          alt={member.name}
          className="w-12 h-12 rounded-full object-cover"
          loading="lazy"
          decoding="async"
          fetchPriority="low"
        />
        <div>
          <h3 className="text-green-400 font-medium">{member.name}</h3>
          <p className="text-gray-400 text-sm">{member.location}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {canMessage && (
          <Button
            size="sm"
            className="bg-transparent border border-green-500 text-green-500 hover:bg-green-500 hover:text-black w-8 h-8 p-0 rounded"
            onClick={() => onMessageMember?.(member.id)}
          >
            <MessageSquare className="w-4 h-4" />
          </Button>
        )}
        {canRemove && (
          <Button
            size="sm"
            className="bg-transparent border border-red-500 text-red-500 hover:bg-red-500 hover:text-white w-8 h-8 p-0 rounded"
            onClick={() => onRemoveMember?.(member.id)}
          >
            <Minus className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  )
}
