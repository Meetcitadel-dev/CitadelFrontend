"use client"

import { ArrowLeft } from "lucide-react"

interface PreferencesDisplayProps {
  onBack: () => void
  onEditPreferences: () => void
  onContinue: () => void
}

export function PreferencesDisplay({ onBack, onEditPreferences, onContinue }: PreferencesDisplayProps) {
  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-6" style={{ paddingTop: '35px', paddingBottom: '0px' }}>
        <button onClick={onBack} className="text-white">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 
          style={{
            color: '#FFFFFF',
            textAlign: 'center',
            fontFamily: 'Inter',
            fontSize: '16px',
            fontStyle: 'normal',
            fontWeight: 600,
            lineHeight: '135%' // 21.6px
          }}
        >
          Your Dinner
        </h1>
        <div className="w-6"></div>
      </div>

      {/* Content */}
      <div className="flex-1">
        {/* Preferences Card */}
        <div 
          className="p-6"
          style={{
            width: '361px',
            height: '267px',
            flexShrink: 0,
            borderRadius: '15px',
            background: '#111',
            marginTop: '30px',
            marginLeft: 'auto',
            marginRight: 'auto'
          }}
        >
          {/* Budget */}
          <div className="mb-8">
            <h3 
              style={{
                color: '#1BEA7B',
                fontFamily: 'Inter',
                fontSize: '15px',
                fontStyle: 'normal',
                fontWeight: 500,
                lineHeight: '135%', // 20.25px
                marginBottom: '8px'
              }}
            >
              Budget
            </h3>
            <p 
              style={{
                color: '#FFFFFF',
                fontFamily: 'Inter',
                fontSize: '20px',
                fontStyle: 'normal',
                fontWeight: 700,
                lineHeight: '135%' // 27px
              }}
            >
              500 Rs
            </p>
          </div>

          {/* Dietary Preferences */}
          <div className="mb-8">
            <h3 
              style={{
                color: '#1BEA7B',
                fontFamily: 'Inter',
                fontSize: '15px',
                fontStyle: 'normal',
                fontWeight: 500,
                lineHeight: '135%', // 20.25px
                marginBottom: '8px'
              }}
            >
              Dietary preferences
            </h3>
            <p 
              style={{
                color: '#FFFFFF',
                fontFamily: 'Inter',
                fontSize: '20px',
                fontStyle: 'normal',
                fontWeight: 700,
                lineHeight: '135%' // 27px
              }}
            >
              No restrictions
            </p>
          </div>

          {/* Language */}
          <div>
            <h3 
              style={{
                color: '#1BEA7B',
                fontFamily: 'Inter',
                fontSize: '15px',
                fontStyle: 'normal',
                fontWeight: 500,
                lineHeight: '135%', // 20.25px
                marginBottom: '8px'
              }}
            >
              Language
            </h3>
            <p 
              style={{
                color: '#FFFFFF',
                fontFamily: 'Inter',
                fontSize: '20px',
                fontStyle: 'normal',
                fontWeight: 700,
                lineHeight: '135%' // 27px
              }}
            >
              English
            </p>
          </div>
        </div>

        {/* Edit Button */}
        <button
          onClick={onEditPreferences}
          className="hover:bg-white/10 transition-colors"
          style={{
            display: 'flex',
            width: '264px',
            height: '50px',
            padding: '14.5px 16px',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '8px',
            flexShrink: 0,
            borderRadius: '48px',
            border: '1px solid #FFFFFF',
            background: '#111',
            color: '#FFFFFF',
            fontFamily: 'Inter',
            marginTop: '24px',
            marginLeft: 'auto',
            marginRight: 'auto',
            marginBottom: '32px'
          }}
        >
          Edit my preferences
        </button>

        {/* Continue Button */}
        <button
          onClick={onContinue}
          className="hover:bg-green-300 transition-colors"
          style={{
            display: 'flex',
            height: '50px',
            padding: '14.5px 16px',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '8px',
            flex: '1 0 0',
            borderRadius: '48px',
            background: '#1BEA7B',
            color: '#040404',
            fontFamily: 'Inter',
            border: 'none',
            position: 'fixed',
            bottom: '16px',
            left: '16px',
            right: '16px',
            zIndex: 10
          }}
        >
          Continue
        </button>
      </div>
    </div>
  )
}
