import ScaledCanvas from './ScaledCanvas'

export default function SplashScreen1() {
  return (
    <ScaledCanvas>
      <div className="w-[390px] h-[844px] flex items-center justify-center px-8">
        <div className="text-center">
          <h1 className="text-white text-xl font-bold leading-tight uppercase" style={{ fontFamily: '"Roboto Serif", serif', fontSize: '20px', fontWeight: 700, textTransform: 'uppercase' }}>
            MILLIONS OF STUDENTS
          </h1>
          <h2 className="text-white text-xl font-bold leading-tight mt-1 uppercase" style={{ fontFamily: '"Roboto Serif", serif', fontSize: '20px', fontWeight: 700, textTransform: 'uppercase' }}>
            <span style={{ color: '#1BEA7B' }}>WORLDWIDE</span> CAN WATCH YOU
          </h2>
        </div>
      </div>
    </ScaledCanvas>
  )
}
