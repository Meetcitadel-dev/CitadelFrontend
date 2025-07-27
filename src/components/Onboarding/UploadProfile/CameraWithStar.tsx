
export default function CameraWithStar() {
  return (
    <div className="w-[100px] h-[100px] relative flex items-center justify-center overflow-hidden rounded-lg">
      {/* Rotating Star Logo - decreased size */}
      <div className="absolute inset-0 flex items-center justify-center">
        <img src="/images/star-logo.png" alt="Star Logo" width={60} height={60} className="animate-spin-slower" />
      </div>

      {/* Camera Icon - increased size */}
      <div className="relative z-10 flex items-center justify-center">
        <img src="/images/camera-icon.png" alt="Camera" width={70} height={70} />
      </div>
    </div>
  )
}
