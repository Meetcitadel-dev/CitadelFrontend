"use client"

import ProfileAvatar from "@/components/Common/ProfileAvatar"

interface ChatItemProps {
  name: string
  message: string
  time: string
  profileImage?: string | null
  userId: string
  isOnline?: boolean
  unreadCount?: number
  onClick?: () => void
}

export default function ChatItem({ name, message, time, profileImage, userId, isOnline = false, unreadCount = 0, onClick }: ChatItemProps) {
  return (
    <div className="flex items-center px-4 py-3 hover:bg-gray-900 cursor-pointer" onClick={onClick}>
      <div className="relative">
        <ProfileAvatar
          profileImage={profileImage}
          userId={userId}
          alt={name}
          className="w-16 h-16 rounded-lg object-cover"
        />
        {isOnline && (
          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-black"></div>
        )}
      </div>
      <div className="flex-1 ml-3">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold" style={{ fontFamily: 'Inter', fontSize: '17px', color: '#1BEA7B' }}>{name}</h3>
          <span style={{ fontFamily: 'Inter', fontSize: '15px', fontWeight: '400', color: '#B8B8B8' }}>{time}</span>
        </div>
        <p className="mt-1" style={{ fontFamily: 'Inter', fontSize: '15px', fontWeight: '400', color: '#B8B8B8' }}>{message}</p>
      </div>
      <div className="flex items-center gap-2">
        {isOnline && <div className="w-2 h-2 bg-green-500 rounded-full"></div>}
        {unreadCount > 0 && (
          <div className="bg-green-500 text-black text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount > 99 ? '99+' : unreadCount}
          </div>
        )}
      </div>
    </div>
  )
}
