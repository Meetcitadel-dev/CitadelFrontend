import Citadelicon from '@/assets/Group 191.png'

export default function SplashScreen3() {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center px-8">
      <div className="text-center">
        {/* Citadel Icon */}
        <div className="mb-8">
          <img src={Citadelicon} alt="Citadel" width={120} height={120} className="mx-auto" />
        </div>

        <h1 className="text-white text-4xl font-normal">Citadel</h1>
      </div>
    </div>
  )
}
