import EllipseImg from '@/assets/Ellipse 2812.png';

interface NotificationItemProps {
  count: number
  text: string
  highlight: string
  timeAgo: string
}

export default function NotificationItem({ count, text, highlight, timeAgo }: NotificationItemProps) {
  return (
    <div className="flex items-center gap-3 px-4 py-3">
      <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
        <img src={EllipseImg} alt="Profile" className="w-full h-full object-cover" />
      </div>
      <div className="flex-1">
        <div className="text-white text-sm">
          <span className="text-green-500 font-medium">{count} people</span>
          <span className="text-white"> found you </span>
          <span className="underline font-medium">{highlight}</span>
        </div>
        <div className="text-gray-400 text-xs mt-1">{timeAgo}</div>
      </div>
    </div>
  )
}
