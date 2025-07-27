

import { useState } from "react"
import { X } from "lucide-react"

interface QueryModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function QueryModal({ isOpen, onClose }: QueryModalProps) {
  const [query, setQuery] = useState("")

  if (!isOpen) return null

  const handleSubmit = () => {
    if (query.trim()) {
      // Handle submit logic here
      console.log("Query submitted:", query)
      setQuery("")
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-95 flex flex-col z-50">
      <div className="flex items-center justify-between p-4">
        <h2 className="text-white text-xl font-medium">Help & Support</h2>
        <button onClick={onClose} className="text-white">
          <X className="w-6 h-6" />
        </button>
      </div>

      <div className="flex-1 px-4 pb-4">
        <h3 className="text-white text-lg font-medium mb-6">Write to us with your query</h3>

        <textarea
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Write here..."
          className="w-full h-64 bg-gray-800 text-white placeholder-gray-400 p-4 rounded-2xl border-none outline-none resize-none text-base"
        />

        <button
          onClick={handleSubmit}
          disabled={!query.trim()}
          className={`w-full mt-6 py-4 rounded-full text-base font-medium transition-colors ${
            query.trim() ? "bg-green-600 text-white hover:bg-green-700" : "bg-gray-600 text-gray-400 cursor-not-allowed"
          }`}
        >
          Submit
        </button>
      </div>
    </div>
  )
}
