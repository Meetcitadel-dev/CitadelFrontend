import Smiley from '@/assets/Group.png'

export default function SplashScreen2() {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center px-8">
      <div className="text-center">
        <h1 className="text-white text-2xl font-bold leading-tight">
          MAKE SURE TO <span className="text-green-400">SMILE</span>
        </h1>

        {/* Smiley Face */}
        <div className="mt-8">
          <img src={Smiley} alt="Smile" width={64} height={64} className="mx-auto" />
        </div>
      </div>
    </div>
  )
}
