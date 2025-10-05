import ProfileAvatar from "@/components/Common/ProfileAvatar"
import type { AdjectiveNotification } from '@/types';
import { useNavigate } from 'react-router-dom';

interface NotificationItemProps {
  notification: AdjectiveNotification;
}

export default function NotificationItem({ notification }: NotificationItemProps) {
  const navigate = useNavigate()
  const goToFirstUser = () => {
    const slug = (notification as any).usernames?.[0] || notification.userNames?.[0]
    if (slug) navigate(`/${encodeURIComponent(slug)}`)
  }
  return (
    <div className="flex items-center gap-3 px-4 py-3">
      <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
        <ProfileAvatar
          profileImage={notification.userProfileImages?.[0]}
          userId={notification.userIds?.[0] || "unknown"}
          alt="Profile"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex-1">
        <div className="text-white text-sm">
          <button onClick={goToFirstUser} className="text-green-500 font-medium underline-offset-2 hover:underline">
            {notification.userNames?.[0] || `${notification.count} people`}
          </button>
          <span className="text-white"> found you </span>
          <span className="underline font-medium">{notification.adjective}</span>
        </div>
        <div className="text-gray-400 text-xs mt-1">{notification.timeAgo}</div>
      </div>
    </div>
  )
}
