
import { X } from "lucide-react"
import { Button } from "../../ui/button"

interface SelectedMemberProps {
  name: string
  onRemove: () => void
}

export default function SelectedMember({ name, onRemove }: SelectedMemberProps) {
  return (
    <div className="flex items-center gap-2 bg-gray-800 rounded-full px-3 py-1">
      <span className="text-sm text-white">{name}</span>
      <Button
        onClick={onRemove}
        size="sm"
        className="bg-transparent hover:bg-gray-700 text-green-500 w-5 h-5 p-0 rounded-full"
      >
        <X className="w-3 h-3" />
      </Button>
    </div>
  )
}
