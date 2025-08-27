interface BookingHeaderProps {
    waitingCount: number
  }
  
  export function BookingHeader({ waitingCount }: BookingHeaderProps) {
  return (
    <div className="text-center text-white mb-6">
      <h2 
        style={{
          color: '#FFF',
          textAlign: 'center',
          fontFamily: 'Inter',
          fontSize: '24px',
          fontStyle: 'normal',
          fontWeight: 700,
          lineHeight: '130%', // 31.2px
          letterSpacing: '-0.48px',
          marginBottom: '4px'
        }}
      >
        Book your next{' '}
        <span 
          style={{
            color: '#1BEA7B',
            fontFamily: '"Roboto Serif"',
            fontSize: '24px',
            fontStyle: 'italic',
            fontWeight: 700,
            lineHeight: '130%',
            letterSpacing: '-0.48px'
          }}
        >
          DINNER
        </span>
      </h2>
      <p 
        style={{
          color: '#FFFFFF',
          textAlign: 'center',
          fontFamily: 'Inter',
          fontSize: '15px',
          fontStyle: 'normal',
          fontWeight: 500,
          lineHeight: '135%', // 20.25px
          margin: 0
        }}
      >
        {waitingCount} people are waiting for you
      </p>
    </div>
  )
}
  