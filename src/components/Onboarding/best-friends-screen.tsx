"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { ChevronLeft, Search, X } from "lucide-react"

interface BestFriendsScreenProps {
  onContinue: () => void
}

// Mock contacts data - in real app, this would come from device contacts
const mockContacts = [
  "Alex Johnson",
  "Sarah Williams",
  "Michael Brown",
  "Emma Davis",
  "James Wilson",
  "Olivia Miller",
  "William Garcia",
  "Sophia Martinez",
  "Benjamin Anderson",
  "Isabella Taylor",
  "Lucas Thomas",
  "Mia Jackson",
  "Henry White",
  "Charlotte Harris",
  "Alexander Martin",
  "Amelia Thompson",
  "Daniel Garcia",
  "Harper Lewis",
  "Matthew Lee",
  "Evelyn Walker",
  "David Hall",
  "Abigail Allen",
  "Joseph Young",
  "Emily King",
  "Samuel Wright",
  "Elizabeth Lopez",
  "Christopher Hill",
  "Sofia Scott",
  "Andrew Green",
  "Avery Adams",
  "Joshua Baker",
  "Ella Gonzalez",
  "Ryan Nelson",
  "Scarlett Carter",
  "Nathan Mitchell",
  "Grace Perez",
  "Caleb Roberts",
  "Chloe Turner",
  "Noah Phillips",
  "Victoria Campbell",
]

export default function BestFriendsScreen({ onContinue }: BestFriendsScreenProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedFriends, setSelectedFriends] = useState<string[]>([])
  const [showDropdown, setShowDropdown] = useState(false)
  const [contacts, setContacts] = useState<string[]>([])
  const [hasContactPermission, setHasContactPermission] = useState(false)

  useEffect(() => {
    // Simulate requesting contact permission
    const requestContactPermission = async () => {
      // In a real app, you would request actual contact permission here
      // For demo purposes, we'll simulate permission granted after a short delay
      setTimeout(() => {
        setHasContactPermission(true)
        setContacts(mockContacts)
      }, 1000)
    }

    requestContactPermission()
  }, [])

  const filteredContacts = contacts.filter(
    (contact) => contact.toLowerCase().includes(searchTerm.toLowerCase()) && !selectedFriends.includes(contact),
  )

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  const handleFriendSelect = (friend: string) => {
    if (selectedFriends.length < 5 && !selectedFriends.includes(friend)) {
      setSelectedFriends([...selectedFriends, friend])
      setSearchTerm("")
      setShowDropdown(false)
    }
  }

  const handleFriendRemove = (friendToRemove: string) => {
    setSelectedFriends(selectedFriends.filter((friend) => friend !== friendToRemove))
  }

  const handleInputFocus = () => {
    if (hasContactPermission) {
      setShowDropdown(true)
    }
  }

  const handleInputBlur = () => {
    setTimeout(() => setShowDropdown(false), 150)
  }

  const isFriendsValid = selectedFriends.length === 5

  if (!hasContactPermission) {
    return (
      <div style={{ minHeight: '100vh', background: '#000', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Roboto Serif', serif" }}>
        <div style={{ textAlign: 'center', padding: '0 24px' }}>
          <div style={{ marginBottom: 24 }}>
            <div style={{ width: 64, height: 64, background: '#22FF88', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto' }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                <path d="M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M12 14C8.13401 14 5 17.134 5 21H19C19 17.134 15.866 14 12 14Z" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Access Your Contacts</h2>
            <p style={{ color: '#aaa', fontSize: 16 }}>We need access to your contacts to help you find your best friends</p>
          </div>
          <div style={{ width: 32, height: 32, border: '2px solid #22FF88', borderTop: '2px solid transparent', borderRadius: '50%', margin: '0 auto', animation: 'spin 1s linear infinite' }}></div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#000', color: '#fff', position: 'relative', fontFamily: "'Roboto Serif', serif", display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', padding: '0 0 0 8px', paddingTop: 32, height: 56 }}>
        <button style={{ background: 'none', border: 'none', padding: 0, marginRight: 0 }}>
          <ChevronLeft size={24} color="white" />
        </button>
      </div>

      {/* Title */}
      <div style={{ padding: '0 16px', marginBottom: 24 }}>
        <h1 style={{ fontFamily: "'Roboto Serif', serif", fontWeight: 700, fontSize: 32, margin: 0, textAlign: 'left', letterSpacing: '-0.5px' }}>Your best friends</h1>
      </div>

      {/* Search Input */}
      <div style={{ padding: '0 16px', marginBottom: 0, position: 'relative' }}>
        <div style={{ position: 'relative' }}>
          <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, height: '100%', display: 'flex', alignItems: 'center', pointerEvents: 'none', paddingLeft: 16 }}>
            <Search size={20} color="#9CA3AF" />
          </div>
          <input
            type="text"
            placeholder="Select max 5"
            value={searchTerm}
            onChange={handleSearchChange}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            style={{
              width: '100%',
              background: '#232323',
              borderRadius: 12,
              border: 'none',
              padding: '14px 16px 14px 44px',
              color: '#fff',
              fontFamily: "'Roboto Serif', serif",
              fontSize: 17,
              marginBottom: 0,
              outline: 'none',
              boxSizing: 'border-box',
              fontWeight: 400,
              letterSpacing: '-0.2px',
            }}
          />
        </div>
        {/* Dropdown */}
        {showDropdown && (
          <div style={{ position: 'absolute', left: 0, right: 0, background: '#232323', borderRadius: 12, marginTop: 8, maxHeight: 240, overflowY: 'auto', zIndex: 10 }}>
            {filteredContacts.map((contact, index) => (
              <button
                key={index}
                onClick={() => handleFriendSelect(contact)}
                style={{
                  width: '100%',
                  textAlign: 'left',
                  padding: '16px',
                  color: '#fff',
                  background: 'none',
                  border: 'none',
                  fontFamily: "'Roboto Serif', serif",
                  fontSize: 17,
                  borderBottom: index !== filteredContacts.length - 1 ? '1px solid #333' : 'none',
                  cursor: 'pointer',
                }}
              >
                {contact}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Selected Friends List */}
      <div style={{ padding: '0 16px', marginTop: 24, marginBottom: 0, flex: 1 }}>
        {selectedFriends.map((friend, index) => (
          <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
            <button
              onClick={() => handleFriendRemove(friend)}
              style={{
                width: 28,
                height: 28,
                borderRadius: '50%',
                background: '#22FF88',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 16,
                cursor: 'pointer',
                flexShrink: 0,
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
              }}
            >
              <X size={16} color="black" />
            </button>
            <span style={{ color: '#fff', fontSize: 18, fontFamily: "'Roboto Serif', serif", fontWeight: 400 }}>{friend}</span>
          </div>
        ))}
      </div>

      {/* Continue Button */}
      <div style={{ position: 'sticky', bottom: 0, left: 0, right: 0, padding: 16, background: 'transparent', zIndex: 20 }}>
        <button
          onClick={onContinue}
          disabled={!isFriendsValid}
          style={{
            width: '100%',
            padding: '16px 0',
            borderRadius: 999,
            fontSize: 18,
            fontWeight: 600,
            fontFamily: "'Roboto Serif', serif",
            background: isFriendsValid ? '#22FF88' : '#232323',
            color: isFriendsValid ? '#000' : '#888',
            border: 'none',
            opacity: isFriendsValid ? 1 : 0.7,
            transition: 'background 0.2s',
            cursor: isFriendsValid ? 'pointer' : 'not-allowed',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
          }}
        >
          Continue
        </button>
      </div>
    </div>
  )
}
