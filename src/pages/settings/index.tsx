import ResponsiveSettingsPanel from "@/components/Settings/ResponsiveSettingsPanel"

export default function SettingsPage() {
  return (
    <div className="space-y-6 pb-20 lg:pb-8">
      <div className="px-4 sm:px-6 md:px-8 pt-4 sm:pt-6 text-center sm:text-left">
        <h1 className="text-3xl sm:text-4xl font-bold mb-2 bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
          Settings
        </h1>
        <p className="text-white/70 text-base sm:text-lg">Manage your account and preferences</p>
      </div>

      <div className="px-4 sm:px-6 md:px-8">
        <ResponsiveSettingsPanel />
      </div>
    </div>
  )
}
