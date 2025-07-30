import Connecting1 from '@/assets/sign up animation 1 (1).png'

interface ConnectStudentsScreenProps {
  onContinue: () => void
  onLogin: () => void
}

export default function ConnectStudentsScreen({ onContinue, onLogin }: ConnectStudentsScreenProps) {
  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Profile Images */}
      <div className="absolute top-16 left-0 right-0">
        <div className="flex items-center justify-center">
          <img src={Connecting1} alt="Student profiles" className="w-80 h-80 object-contain" />
        </div>

        {/* Decorative stars */}
        <div className="absolute top-20 left-8">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M12 0L14.4 8.4L24 8.4L16.8 14.4L19.2 24L12 18L4.8 24L7.2 14.4L0 8.4L9.6 8.4L12 0Z" fill="white" />
          </svg>
        </div>

        <div className="absolute bottom-16 right-12">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M10 0L12 7L20 7L14 12L16 20L10 15L4 20L6 12L0 7L8 7L10 0Z" fill="white" />
          </svg>
        </div>
      </div>

      {/* Bottom Content */}
      <div className="absolute bottom-0 left-0 right-0">
        {/* Main Text */}
        <div className="text-center mb-8 px-6">
          <h1 className="text-white text-3xl font-bold leading-tight">
            Connect with
            <br />
            students across
            <br />
            universities
          </h1>
        </div>

        {/* Let's go Button */}
        <div className="px-6 mb-4">
          <button
            onClick={onContinue}
            className="w-full bg-green-400 hover:bg-green-500 text-black text-xl font-semibold py-4 rounded-full transition-colors duration-200"
          >
            Let's go
          </button>
        </div>

        {/* Login Link */}
        <div className="px-6 mb-8 text-center">
          <span className="text-gray-300 text-base">
            Already a user?{" "}
            <button
              onClick={onLogin}
              className="text-white underline font-medium hover:text-green-400 transition-colors duration-200"
            >
              Login
            </button>
          </span>
        </div>

        {/* Green wavy bottom design */}
        <div className="relative h-24">
          <svg
            className="absolute bottom-0 w-full h-24"
            viewBox="0 0 375 96"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
          >
            <path d="M0 32C93.75 32 93.75 64 187.5 64C281.25 64 281.25 32 375 32V96H0V32Z" fill="#22C55E" />
            <path
              d="M0 48C93.75 48 93.75 80 187.5 80C281.25 80 281.25 48 375 48V96H0V48Z"
              fill="#22C55E"
              fillOpacity="0.8"
            />
            <path
              d="M0 64C93.75 64 93.75 96 187.5 96C281.25 96 281.25 64 375 64V96H0V64Z"
              fill="#22C55E"
              fillOpacity="0.6"
            />
          </svg>
        </div>
      </div>
    </div>
  )
}
