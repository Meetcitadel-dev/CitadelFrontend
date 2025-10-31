import ResponsiveNotificationList from "@/components/Notification/ResponsiveNotificationList"

export default function NotificationsScreen() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white mb-2">Notifications</h1>
        <p className="text-white/70">Stay updated with your connections and matches</p>
      </div>
      
      <ResponsiveNotificationList />
    </div>
  )
}