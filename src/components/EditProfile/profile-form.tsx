

import { useState, useRef, useEffect } from "react";

interface ProfileFormProps {
  profileData: {
    fullName: string
    universityEmail: string
    phoneNumber: string
    dateOfBirth: { day: string; month: string; year: string }
    gender?: string
    college?: string
    degree?: string
    enrolmentYear?: string
    portfolioLink?: string
    aboutMe?: string
    extraCurricular?: string[]
    sports?: string
    movies?: string
    tvShows?: string
    teams?: string
  }
  updateProfileData: (updates: any) => void
}

export default function ProfileForm({ profileData, updateProfileData }: ProfileFormProps) {
  const [extraCurricularOpen, setExtraCurricularOpen] = useState(false);
  const extraCurricularRef = useRef<HTMLDivElement>(null);
  const extraCurricularOptions = [
    "UX Design",
    "Blender",
    "Video Editing",
    "Unreal Engine 5",
    "Unity 2020",
    "Godot 3.3",
    "CryEngine 5",
    "GameMaker Studio 2",
    "Construct 3"
  ];

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (extraCurricularRef.current && !extraCurricularRef.current.contains(event.target as Node)) {
        setExtraCurricularOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputChange = (field: string, value: string | string[]) => {
    updateProfileData({ [field]: value })
  }

  const handleDateChange = (field: string, value: string) => {
    updateProfileData({
      dateOfBirth: {
        ...profileData.dateOfBirth,
        [field]: value,
      },
    })
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Full Name */}
      <div style={{ marginBottom: 0 }}>
        <label style={{ color: '#aaa', fontSize: 14, marginBottom: 6, display: 'block', fontFamily: "'Roboto Serif', serif" }}>Full name</label>
        <input
          type="text"
          value={profileData.fullName}
          onChange={(e) => handleInputChange("fullName", e.target.value)}
          placeholder="Nisarg Patel"
          style={{
            width: '100%',
            background: '#232323',
            borderRadius: 12,
            border: 'none',
            padding: '14px 16px',
            color: '#fff',
            fontFamily: "'Roboto Serif', serif",
            fontSize: 17,
            marginBottom: 0,
            outline: 'none',
            boxSizing: 'border-box',
            fontWeight: 500,
            letterSpacing: '-0.2px',
          }}
        />
      </div>

      {/* University Email ID */}
      <div style={{ marginBottom: 0 }}>
        <label style={{ color: '#aaa', fontSize: 14, marginBottom: 6, display: 'block', fontFamily: "'Roboto Serif', serif" }}>University email ID</label>
        <input
          type="email"
          value={profileData.universityEmail}
          disabled={true}
          placeholder="nisarg.patel@example.edu"
          style={{
            width: '100%',
            background: '#1a1a1a',
            borderRadius: 12,
            border: 'none',
            padding: '14px 16px',
            color: '#666',
            fontFamily: "'Roboto Serif', serif",
            fontSize: 17,
            marginBottom: 0,
            outline: 'none',
            boxSizing: 'border-box',
            fontWeight: 500,
            letterSpacing: '-0.2px',
            cursor: 'not-allowed',
          }}
        />
        <div style={{ color: '#666', fontSize: 12, marginTop: 4, fontFamily: "'Roboto Serif', serif" }}>
          Email cannot be changed
        </div>
      </div>

      {/* Phone Number */}
      <div style={{ marginBottom: 0 }}>
        <label style={{ color: '#aaa', fontSize: 14, marginBottom: 6, display: 'block', fontFamily: "'Roboto Serif', serif" }}>Phone number</label>
        <input
          type="tel"
          value={profileData.phoneNumber}
          onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
          placeholder="9310845435"
          style={{
            width: '100%',
            background: '#232323',
            borderRadius: 12,
            border: 'none',
            padding: '14px 16px',
            color: '#fff',
            fontFamily: "'Roboto Serif', serif",
            fontSize: 17,
            marginBottom: 0,
            outline: 'none',
            boxSizing: 'border-box',
            fontWeight: 500,
            letterSpacing: '-0.2px',
          }}
        />
      </div>

      {/* Date of Birth */}
      <div style={{ marginBottom: 0 }}>
        <label style={{ color: '#aaa', fontSize: 14, marginBottom: 6, display: 'block', fontFamily: "'Roboto Serif', serif" }}>Date of birth</label>
        <input
          type="text"
          placeholder="DD/MM/YYYY"
          value={`${profileData.dateOfBirth.day}${profileData.dateOfBirth.day && profileData.dateOfBirth.day.length === 2 ? '/' : ''}${profileData.dateOfBirth.month}${profileData.dateOfBirth.month && profileData.dateOfBirth.month.length === 2 ? '/' : ''}${profileData.dateOfBirth.year}`.replace(/^\$/,'')}
          onChange={e => {
            let value = e.target.value.replace(/[^0-9]/g, '');
            let day = value.slice(0, 2);
            let month = value.slice(2, 4);
            let year = value.slice(4, 8);
            let formatted = day;
            if (month) formatted += '/' + month;
            if (year) formatted += '/' + year;
            // Update the parent state
            updateProfileData({
              dateOfBirth: { day, month, year }
            });
          }}
          maxLength={10}
          style={{
            width: '100%',
            background: '#232323',
            borderRadius: 12,
            border: 'none',
            padding: '14px 16px',
            color: '#fff',
            fontFamily: "'Roboto Serif', serif",
            fontSize: 17,
            textAlign: 'center',
            outline: 'none',
            boxSizing: 'border-box',
            fontWeight: 500,
            letterSpacing: '-0.2px',
          }}
        />
      </div>

      {/* Gender */}
      <div style={{ marginBottom: 0 }}>
        <label style={{ color: '#aaa', fontSize: 14, marginBottom: 6, display: 'block', fontFamily: "'Roboto Serif', serif" }}>Gender</label>
        <div style={{ display: 'flex', gap: 12 }}>
          {['Male', 'Female', 'Other'].map((g) => (
            <button
              key={g}
              type="button"
              onClick={() => handleInputChange('gender', g)}
              style={{
                flex: 1,
                background: profileData.gender === g ? '#15803d' : '#232323',
                color: profileData.gender === g ? '#fff' : '#fff',
                border: 'none',
                borderRadius: 8,
                padding: '12px 0',
                fontFamily: "'Roboto Serif', serif",
                fontSize: 16,
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'background 0.2s',
                outline: 'none',
              }}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      {/* College */}
      <div style={{ marginBottom: 0 }}>
        <label style={{ color: '#aaa', fontSize: 14, marginBottom: 6, display: 'block', fontFamily: "'Roboto Serif', serif" }}>College</label>
        <input
          type="text"
          value={profileData.college || ''}
          onChange={e => handleInputChange('college', e.target.value)}
          placeholder="Masters Union"
          style={{
            width: '100%',
            background: '#232323',
            borderRadius: 12,
            border: 'none',
            padding: '14px 16px',
            color: '#fff',
            fontFamily: "'Roboto Serif', serif",
            fontSize: 17,
            marginBottom: 0,
            outline: 'none',
            boxSizing: 'border-box',
            fontWeight: 500,
            letterSpacing: '-0.2px',
          }}
        />
      </div>

      {/* Degree */}
      <div style={{ marginBottom: 0 }}>
        <label style={{ color: '#aaa', fontSize: 14, marginBottom: 6, display: 'block', fontFamily: "'Roboto Serif', serif" }}>Degree</label>
        <input
          type="text"
          value={profileData.degree || ''}
          onChange={e => handleInputChange('degree', e.target.value)}
          placeholder="B.Tech"
          style={{
            width: '100%',
            background: '#232323',
            borderRadius: 12,
            border: 'none',
            padding: '14px 16px',
            color: '#fff',
            fontFamily: "'Roboto Serif', serif",
            fontSize: 17,
            marginBottom: 0,
            outline: 'none',
            boxSizing: 'border-box',
            fontWeight: 500,
            letterSpacing: '-0.2px',
          }}
        />
      </div>

      {/* Enrolment year */}
      <div style={{ marginBottom: 0 }}>
        <label style={{ color: '#aaa', fontSize: 14, marginBottom: 6, display: 'block', fontFamily: "'Roboto Serif', serif" }}>Enrolment year</label>
        <input
          type="text"
          value={profileData.enrolmentYear || ''}
          onChange={e => handleInputChange('enrolmentYear', e.target.value)}
          placeholder="2023"
          style={{
            width: '100%',
            background: '#232323',
            borderRadius: 12,
            border: 'none',
            padding: '14px 16px',
            color: '#fff',
            fontFamily: "'Roboto Serif', serif",
            fontSize: 17,
            marginBottom: 0,
            outline: 'none',
            boxSizing: 'border-box',
            fontWeight: 500,
            letterSpacing: '-0.2px',
          }}
        />
      </div>

      {/* Portfolio link */}
      <div style={{ marginBottom: 0 }}>
        <label style={{ color: '#aaa', fontSize: 14, marginBottom: 6, display: 'block', fontFamily: "'Roboto Serif', serif" }}>Portfolio link</label>
        <input
          type="text"
          value={profileData.portfolioLink || ''}
          onChange={e => handleInputChange('portfolioLink', e.target.value)}
          placeholder="http://www.example.com"
          style={{
            width: '100%',
            background: '#232323',
            borderRadius: 12,
            border: 'none',
            padding: '14px 16px',
            color: '#fff',
            fontFamily: "'Roboto Serif', serif",
            fontSize: 17,
            marginBottom: 0,
            outline: 'none',
            boxSizing: 'border-box',
            fontWeight: 500,
            letterSpacing: '-0.2px',
          }}
        />
      </div>

      {/* About me */}
      <div style={{ marginBottom: 0 }}>
        <label style={{ color: '#aaa', fontSize: 14, marginBottom: 6, display: 'block', fontFamily: "'Roboto Serif', serif" }}>About me (Max 140 characters)</label>
        <textarea
          value={profileData.aboutMe || ''}
          onChange={e => handleInputChange('aboutMe', e.target.value.slice(0, 140))}
          placeholder="About yourself"
          maxLength={140}
          style={{
            width: '100%',
            minHeight: 180,
            background: '#232323',
            borderRadius: 12,
            border: 'none',
            padding: '14px 16px',
            color: '#fff',
            fontFamily: "'Roboto Serif', serif",
            fontSize: 17,
            marginBottom: 0,
            outline: 'none',
            boxSizing: 'border-box',
            fontWeight: 500,
            letterSpacing: '-0.2px',
            resize: 'none',
          }}
        />
      </div>

      {/* Extra Curricular (Max 5) */}
      <div style={{ marginBottom: 0, position: 'relative' }} ref={extraCurricularRef}>
        <label style={{ color: '#aaa', fontSize: 14, marginBottom: 6, display: 'block', fontFamily: "'Roboto Serif', serif" }}>Extra Curricular (Max 5)</label>
        <div
          style={{
            width: '100%',
            background: '#232323',
            borderRadius: 12,
            border: 'none',
            padding: '14px 16px',
            color: '#fff',
            fontFamily: "'Roboto Serif', serif",
            fontSize: 17,
            marginBottom: 0,
            outline: 'none',
            boxSizing: 'border-box',
            fontWeight: 500,
            letterSpacing: '-0.2px',
            minHeight: 44,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer',
            position: 'relative',
            userSelect: 'none',
            zIndex: 10,
          }}
          onClick={() => setExtraCurricularOpen((open) => !open)}
        >
          <span style={{
            color: profileData.extraCurricular && profileData.extraCurricular.length > 0 ? '#fff' : '#aaa',
            fontWeight: 400,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            flex: 1,
          }}>
            {profileData.extraCurricular && profileData.extraCurricular.length > 0
              ? profileData.extraCurricular.join(', ')
              : 'Choose'}
          </span>
          <span style={{ marginLeft: 8, display: 'flex', alignItems: 'center' }}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 8L10 12L14 8" stroke="#22FF88" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </div>
        {extraCurricularOpen && (
          <div
            style={{
              position: 'absolute',
              top: '100%',
              marginTop: 8,
              left: 0,
              right: 0,
              background: '#232323',
              borderRadius: 12,
              boxShadow: '0 4px 24px rgba(0,0,0,0.25)',
              zIndex: 1000,
              padding: '8px 0',
              maxHeight: 320,
              overflowY: 'auto',
            }}
          >
            {extraCurricularOptions.map((option) => {
              const selected = profileData.extraCurricular && profileData.extraCurricular.includes(option);
              return (
                <div
                  key={option}
                  onClick={e => {
                    e.stopPropagation();
                    let newSelected = profileData.extraCurricular ? [...profileData.extraCurricular] : [];
                    if (selected) {
                      newSelected = newSelected.filter(item => item !== option);
                    } else if (newSelected.length < 5) {
                      newSelected.push(option);
                    }
                    handleInputChange('extraCurricular', newSelected);
                  }}
                  style={{
                    padding: '14px 24px',
                    color: '#fff',
                    fontFamily: "'Roboto Serif', serif",
                    fontSize: 17,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    background: selected ? 'rgba(34,255,136,0.05)' : 'transparent',
                  }}
                >
                  <span style={{ flex: 1 }}>{option}</span>
                  {selected && <span style={{ color: '#22FF88', fontSize: 18, marginLeft: 12, borderRadius: '50%' }}>●</span>}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Sports I play */}
      <div style={{ marginBottom: 0 }}>
        <label style={{ color: '#aaa', fontSize: 14, marginBottom: 6, display: 'block', fontFamily: "'Roboto Serif', serif" }}>Sports I play</label>
        <input
          type="text"
          value={profileData.sports || ''}
          onChange={e => handleInputChange('sports', e.target.value)}
          placeholder="Football, Cricket"
          style={{
            width: '100%',
            background: '#232323',
            borderRadius: 12,
            border: 'none',
            padding: '14px 16px',
            color: '#fff',
            fontFamily: "'Roboto Serif', serif",
            fontSize: 17,
            marginBottom: 0,
            outline: 'none',
            boxSizing: 'border-box',
            fontWeight: 500,
            letterSpacing: '-0.2px',
          }}
        />
      </div>

      {/* Movies I like */}
      <div style={{ marginBottom: 0 }}>
        <label style={{ color: '#aaa', fontSize: 14, marginBottom: 6, display: 'block', fontFamily: "'Roboto Serif', serif" }}>Movies I like</label>
        <input
          type="text"
          value={profileData.movies || ''}
          onChange={e => handleInputChange('movies', e.target.value)}
          placeholder="Inception, Interstellar"
          style={{
            width: '100%',
            background: '#232323',
            borderRadius: 12,
            border: 'none',
            padding: '14px 16px',
            color: '#fff',
            fontFamily: "'Roboto Serif', serif",
            fontSize: 17,
            marginBottom: 0,
            outline: 'none',
            boxSizing: 'border-box',
            fontWeight: 500,
            letterSpacing: '-0.2px',
          }}
        />
      </div>

      {/* TV Shows I watch */}
      <div style={{ marginBottom: 0 }}>
        <label style={{ color: '#aaa', fontSize: 14, marginBottom: 6, display: 'block', fontFamily: "'Roboto Serif', serif" }}>TV Shows I watch</label>
        <input
          type="text"
          value={profileData.tvShows || ''}
          onChange={e => handleInputChange('tvShows', e.target.value)}
          placeholder="Game of Thrones, Peaky Blinders"
          style={{
            width: '100%',
            background: '#232323',
            borderRadius: 12,
            border: 'none',
            padding: '14px 16px',
            color: '#fff',
            fontFamily: "'Roboto Serif', serif",
            fontSize: 17,
            marginBottom: 0,
            outline: 'none',
            boxSizing: 'border-box',
            fontWeight: 500,
            letterSpacing: '-0.2px',
          }}
        />
      </div>

      {/* Teams I support */}
      <div style={{ marginBottom: 32 }}>
        <label style={{ color: '#aaa', fontSize: 14, marginBottom: 6, display: 'block', fontFamily: "'Roboto Serif', serif" }}>Teams I support</label>
        <input
          type="text"
          value={profileData.teams || ''}
          onChange={e => handleInputChange('teams', e.target.value)}
          placeholder="FC Barcelona, RCB"
          style={{
            width: '100%',
            background: '#232323',
            borderRadius: 12,
            border: 'none',
            padding: '14px 16px',
            color: '#fff',
            fontFamily: "'Roboto Serif', serif",
            fontSize: 17,
            marginBottom: 0,
            outline: 'none',
            boxSizing: 'border-box',
            fontWeight: 500,
            letterSpacing: '-0.2px',
          }}
        />
      </div>
    </div>
  )
}
