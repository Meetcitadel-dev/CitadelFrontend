import { Search } from "lucide-react"

export default function SearchBar() {
  return (
    <div className="mx-4 mb-4" style={{ width: '361px', height: '44px' }}>
      <div className="relative h-full">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search chats..."
          className="w-full h-full rounded-full pl-10 pr-4 text-white placeholder-[#B8B8B8] focus:outline-none"
          style={{ backgroundColor: '#1C1C1C' }}
        />
      </div>
    </div>
  )
}
