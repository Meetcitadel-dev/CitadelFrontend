"use client"

import { Check, X } from "lucide-react"
import EllipseImg from '@/assets/Ellipse 2812.png';

interface RequestItemProps {
  name: string
  location: string
  isConnected?: boolean
  onAccept?: () => void
  onReject?: () => void
}

export default function RequestItem({ name, location, isConnected, onAccept, onReject }: RequestItemProps) {
  return (
    <div className="flex items-center gap-3 px-4 py-3">
      <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
        <img src={EllipseImg} alt={name} className="w-full h-full object-cover" />
      </div>
      <div className="flex-1">
        <div className="text-green-500 font-medium text-sm">{name}</div>
        <div className="text-gray-400 text-xs">{location}</div>
      </div>
      <div className="flex gap-2">
        {isConnected ? (
          <div className="bg-green-600 text-white px-4 py-2 rounded text-sm font-medium">Connected</div>
        ) : (
          <>
            <button
              onClick={onAccept}
              className="w-10 h-10 bg-gray-800 border border-gray-700 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors"
            >
              <Check size={18} className="text-green-500 stroke-2" />
            </button>
            <button
              onClick={onReject}
              className="w-10 h-10 bg-gray-800 border border-gray-700 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors"
            >
              <X size={18} className="text-red-500 stroke-2" />
            </button>
          </>
        )}
      </div>
    </div>
  )
}
