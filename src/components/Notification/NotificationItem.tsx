import EllipseImg from '@/assets/Ellipse 2812.png';
import type { AdjectiveNotification } from '@/types';

interface NotificationItemProps {
  notification: AdjectiveNotification;
}

export default function NotificationItem({ notification }: NotificationItemProps) {
  return (
    <div className="flex items-center gap-3 px-4 py-3">
      <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
        <img 
          src={notification.userProfileImages?.[0] || EllipseImg} 
          alt="Profile" 
          className="w-full h-full object-cover" 
        />
      </div>
      <div className="flex-1">
        <div className="text-white text-sm">
          <span className="text-green-500 font-medium">{notification.count} people</span>
          <span className="text-white"> found you </span>
          <span className="underline font-medium">{notification.adjective}</span>
        </div>
        <div className="text-gray-400 text-xs mt-1">{notification.timeAgo}</div>
      </div>
    </div>
  )
}
