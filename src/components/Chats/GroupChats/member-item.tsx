import { MessageSquare, Minus } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Member {
  id: string
  name: string
  location: string
  avatar?: string
}

interface MemberItemProps {
  member: Member
}

export default function MemberItem({ member }: MemberItemProps) {
  return (
    <div className="flex items-center justify-between p-4 hover:bg-gray-900">
      <div className="flex items-center gap-3">
        <img
          src={member.avatar || "/placeholder.svg"}
          alt={member.name}
          className="w-12 h-12 rounded-full object-cover"
        />
        <div>
          <h3 className="text-green-400 font-medium">{member.name}</h3>
          <p className="text-gray-400 text-sm">{member.location}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button
          size="sm"
          className="bg-transparent border border-green-500 text-green-500 hover:bg-green-500 hover:text-black w-8 h-8 p-0 rounded"
        >
          <MessageSquare className="w-4 h-4" />
        </Button>
        <Button
          size="sm"
          className="bg-transparent border border-red-500 text-red-500 hover:bg-red-500 hover:text-white w-8 h-8 p-0 rounded"
        >
          <Minus className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}
