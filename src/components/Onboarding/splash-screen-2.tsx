export default function SplashScreen2() {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center px-8">
      <div className="text-center">
        <h1 className="text-white text-xl font-bold leading-tight uppercase" style={{ fontFamily: '"Roboto Serif", serif', fontSize: '20px', fontWeight: 700, textTransform: 'uppercase', textAlign: 'center' }}>
          MAKE SURE TO <span style={{ color: '#1BEA7B' }}>SMILE</span>
        </h1>

        {/* Smiley Face SVG */}
        <div className="mt-6">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="38" 
            height="38" 
            viewBox="0 0 42 43" 
            fill="none"
            className="mx-auto"
          >
            <path d="M21 2.41992C31.4922 2.41992 40 10.9277 40 21.4199C40 31.9121 31.4922 40.4199 21 40.4199C10.5078 40.4199 2 31.9121 2 21.4199C2 10.9277 10.5078 2.41992 21 2.41992Z" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M14.6641 15.0869V17.198" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M26.2773 16.1416H28.3885" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12.5645 25.6416C13.62 28.8083 16.3433 31.9749 21.0089 31.9749C25.6745 31.9749 28.3978 28.8083 29.4533 25.6416" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>
    </div>
  )
}
