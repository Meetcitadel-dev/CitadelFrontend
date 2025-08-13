
import Camera from '@/assets/737835f15452a8577b7457befe6bc5aa73fab810.png'

export default function CameraWithStar() {
  return (
    <>
      <style>
        {`
          @keyframes spin {
            from {
              transform: rotate(0deg);
            }
            to {
              transform: rotate(360deg);
            }
          }
        `}
      </style>
      <div className="w-[95px] h-[95px] relative flex items-center justify-center overflow-hidden rounded-lg">
      {/* Rotating Star Logo with exact Figma specifications */}
      <div className="absolute inset-0 flex items-center justify-center">
                 <svg 
           xmlns="http://www.w3.org/2000/svg" 
           width="79" 
           height="79" 
           viewBox="0 0 79 79" 
           fill="none"
                       style={{
              animation: 'spin 15s linear infinite'
            }}
         >
          <path 
            d="M37.0507 2.84316C37.6403 0.23282 41.3597 0.232829 41.9493 2.84317L45.6597 19.2693C46.0419 20.961 47.9832 21.7652 49.4497 20.8391L63.6884 11.8478C65.9511 10.4189 68.5811 13.0489 67.1522 15.3116L58.1609 29.5503C57.2348 31.0168 58.039 32.9581 59.7307 33.3403L76.1568 37.0507C78.7672 37.6403 78.7672 41.3597 76.1568 41.9493L59.7307 45.6597C58.039 46.0419 57.2348 47.9832 58.1609 49.4497L67.1522 63.6884C68.5811 65.9511 65.9511 68.5811 63.6884 67.1522L49.4497 58.1609C47.9832 57.2348 46.0419 58.039 45.6597 59.7307L41.9493 76.1568C41.3597 78.7672 37.6403 78.7672 37.0507 76.1568L33.3403 59.7307C32.9581 58.039 31.0168 57.2348 29.5503 58.1609L15.3116 67.1522C13.0489 68.5811 10.4189 65.9511 11.8478 63.6884L20.8391 49.4497C21.7652 47.9832 20.961 46.0419 19.2693 45.6597L2.84316 41.9493C0.23282 41.3597 0.232829 37.6403 2.84317 37.0507L19.2693 33.3403C20.961 32.9581 21.7652 31.0168 20.8391 29.5503L11.8478 15.3116C10.4189 13.0489 13.0489 10.4189 15.3116 11.8478L29.5503 20.8391C31.0168 21.7652 32.9581 20.961 33.3403 19.2693L37.0507 2.84316Z" 
            fill="#1BEA7B"
          />
        </svg>
      </div>

             {/* Camera Icon with exact Figma specifications */}
               <div 
          className="relative z-10 flex items-center justify-center"
          style={{
            width: '68px',
            height: '51px',
            flexShrink: 0,
            background: `url(${Camera}) transparent 50% / contain no-repeat`,
            boxShadow: '0 0 12.6px 33px rgba(0, 0, 0, 0.25)'
          }}
                 />
       </div>
     </>
   )
 }
