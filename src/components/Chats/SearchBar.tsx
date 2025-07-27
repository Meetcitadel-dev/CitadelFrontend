import { Search } from "lucide-react"

export default function SearchBar() {
  return (
    <div className="px-4 mb-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search chats..."
          className="w-full bg-gray-800 rounded-full py-3 pl-10 pr-4 text-white placeholder-gray-400 focus:outline-none"
        />
      </div>
    </div>
  )
}
