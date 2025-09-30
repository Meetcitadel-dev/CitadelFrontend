"use client"

import { Check, X } from "lucide-react"
import { useNavigate } from "react-router-dom"
import EllipseImg from '@/assets/Ellipse 2812.png';
import type { ConnectionRequestNotification } from '@/types';

interface RequestItemProps {
  request: ConnectionRequestNotification;
  onAccept: (requestId: string) => void;
  onReject: (requestId: string) => void;
  isProcessing?: boolean;
}

export default function RequestItem({ request, onAccept, onReject, isProcessing = false }: RequestItemProps) {
  const navigate = useNavigate()

  const goToProfile = () => {
    // Prefer username slug if backend provides it in future; fallback to name
    const slug = (request as any).requesterUsername || request.requesterName
    if (slug) {
      navigate(`/${encodeURIComponent(slug)}`)
    }
  }
  const handleAccept = () => {
    if (!isProcessing) {
      onAccept(request.id);
    }
  };

  const handleReject = () => {
    if (!isProcessing) {
      onReject(request.id);
    }
  };

  return (
    <div className="flex items-center gap-3 px-4 py-3">
      <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
        <img 
          src={request.requesterProfileImage || EllipseImg} 
          alt={request.requesterName} 
          className="w-full h-full object-cover" 
          loading="lazy"
          decoding="async"
          fetchPriority="low"
        />
      </div>
      <div className="flex-1">
        <button onClick={goToProfile} className="text-green-500 font-medium text-sm underline-offset-2 hover:underline">
          {request.requesterName}
        </button>
        <div className="text-gray-400 text-xs">{request.requesterLocation}</div>
      </div>
      <div className="flex gap-2">
        {request.status === 'accepted' ? (
          <div className="bg-green-600 text-white px-4 py-2 rounded text-sm font-medium">Connected</div>
        ) : request.status === 'rejected' ? (
          <div className="bg-red-600 text-white px-4 py-2 rounded text-sm font-medium">Rejected</div>
        ) : (
          <>
            <button
              onClick={handleAccept}
              disabled={isProcessing}
              className={`w-10 h-10 bg-gray-800 border border-gray-700 rounded-lg flex items-center justify-center transition-colors ${
                isProcessing ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-700'
              }`}
            >
              {isProcessing ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-500"></div>
              ) : (
                <Check size={18} className="text-green-500 stroke-2" />
              )}
            </button>
            <button
              onClick={handleReject}
              disabled={isProcessing}
              className={`w-10 h-10 bg-gray-800 border border-gray-700 rounded-lg flex items-center justify-center transition-colors ${
                isProcessing ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-700'
              }`}
            >
              {isProcessing ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-500"></div>
              ) : (
                <X size={18} className="text-red-500 stroke-2" />
              )}
            </button>
          </>
        )}
      </div>
    </div>
  )
}
