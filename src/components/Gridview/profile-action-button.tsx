import { Button } from "@/components/ui/button"

interface ProfileActionButtonProps {
  status: "connect" | "remove" | "request" | "connected"
}

export function ProfileActionButton({ status }: ProfileActionButtonProps) {
  const getButtonConfig = () => {
    switch (status) {
      case "connect":
        return {
          text: "Connect",
          className: "bg-gray-700 hover:bg-gray-600 text-white border-0",
        }
      case "remove":
        return {
          text: "Remove",
          className: "bg-red-600 hover:bg-red-700 text-white border-0",
        }
      case "request":
        return {
          text: "Request",
          className: "bg-gray-700 hover:bg-gray-600 text-white border-0",
        }
      case "connected":
        return {
          text: "Connected",
          className: "bg-green-600 hover:bg-green-700 text-white border-0",
        }
      default:
        return {
          text: "Connect",
          className: "bg-gray-700 hover:bg-gray-600 text-white border-0",
        }
    }
  }

  const { text, className } = getButtonConfig()

  return (
    <Button className={`w-full rounded-xl py-3 font-medium ${className}`} size="sm">
      {text}
    </Button>
  )
}
