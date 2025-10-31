"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Search } from "lucide-react"
import { Button } from "../../ui/button"
import { Input } from "../../ui/input"
import ConnectionItem from "./connection-item"
import SelectedMember from "./selected-member"
import { fetchUserConnections, createGroupChat } from "@/lib/api"
import { getAuthToken } from "@/lib/utils"

interface CreateGroupScreenProps {
  onBack: () => void
  onGroupCreated: (groupId: string) => void
}

interface Connection {
  id: string
  name: string
  location: string
  avatar?: string
}

export default function CreateGroupScreen({ onBack, onGroupCreated }: CreateGroupScreenProps) {
  const [selectedMembers, setSelectedMembers] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [connections, setConnections] = useState<Connection[]>([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchConnections = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const token = getAuthToken()
        if (!token) {
          setError('Authentication required')
          return
        }

        const response = await fetchUserConnections(token)
        
        if (response.success && response.connections) {
          setConnections(response.connections)
        } else {
          setError('Failed to load connections')
        }
      } catch (error) {
        console.error('Error fetching connections:', error)
        setError('Failed to load connections')
      } finally {
        setLoading(false)
      }
    }

    fetchConnections()
  }, [])

  const handleAddMember = (memberId: string) => {
    if (!selectedMembers.includes(memberId)) {
      setSelectedMembers([...selectedMembers, memberId])
    }
  }

  const handleRemoveMember = (memberId: string) => {
    setSelectedMembers(selectedMembers.filter((id) => id !== memberId))
  }

  const getSelectedMemberNames = () => {
    return selectedMembers.map((id) => {
      const connection = connections.find((c) => c.id === id)
      return connection ? connection.name : "Unknown"
    })
  }

  const handleCreateGroup = async () => {
    if (selectedMembers.length === 0) return

    try {
      setCreating(true)
      setError(null)
      
      const token = getAuthToken()
      if (!token) {
        setError('Authentication required')
        return
      }

      // Generate a default group name from selected members
      const memberNames = getSelectedMemberNames()
      const groupName = memberNames.length > 2 
        ? `${memberNames[0]}, ${memberNames[1]} +${memberNames.length - 2}`
        : memberNames.join(', ')

      const response = await createGroupChat({
        name: groupName,
        memberIds: selectedMembers
      }, token)
      
      if (response.success && response.group) {
        onGroupCreated(response.group.id)
      } else {
        setError(response.message || 'Failed to create group')
      }
    } catch (error) {
      console.error('Error creating group:', error)
      setError('Failed to create group')
    } finally {
      setCreating(false)
    }
  }

  const filteredConnections = connections.filter(connection =>
    connection.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    connection.location.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (loading) {
    return (
      <div className="flex flex-col h-screen bg-black text-white">
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <div className="flex items-center gap-4">
            <ArrowLeft className="w-6 h-6" onClick={onBack} />
            <h1 className="text-xl font-medium">Create group</h1>
          </div>
        </div>
        <div className="flex items-center justify-center flex-1">
          <div className="text-white">Loading connections...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen bg-black text-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-800">
        <div className="flex items-center gap-4">
          <ArrowLeft className="w-6 h-6 cursor-pointer" onClick={onBack} />
          <h1 className="text-xl font-medium">Create group</h1>
        </div>
      </div>

      {/* Search Bar */}
      <div className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            placeholder="Search friends"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-gray-800 border-gray-700 text-white placeholder-gray-400 rounded-lg"
          />
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="px-4 pb-4">
          <div className="bg-red-900/20 border border-red-500 text-red-400 px-4 py-2 rounded-lg">
            {error}
          </div>
        </div>
      )}

      {/* Selected Members */}
      {selectedMembers.length > 0 && (
        <div className="px-4 pb-4">
          <div className="flex flex-wrap gap-2">
            {getSelectedMemberNames().map((name, index) => (
              <SelectedMember
                key={selectedMembers[index]}
                name={name}
                onRemove={() => handleRemoveMember(selectedMembers[index])}
              />
            ))}
          </div>
        </div>
      )}

      {/* Connections List */}
      <div className="flex-1 overflow-y-auto">
        {filteredConnections.length === 0 ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-gray-400 text-center">
              {searchQuery ? 'No connections found' : 'No connections available'}
            </div>
          </div>
        ) : (
          filteredConnections.map((connection) => (
            <ConnectionItem
              key={connection.id}
              connection={connection}
              isSelected={selectedMembers.includes(connection.id)}
              onAdd={() => handleAddMember(connection.id)}
            />
          ))
        )}
      </div>

      {/* Create Group Button */}
      <div className="p-4">
        <Button
          onClick={handleCreateGroup}
          className="w-full bg-green-500 hover:bg-green-600 text-black font-medium py-4 rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={selectedMembers.length === 0 || creating}
        >
          {creating ? 'Creating group...' : 'Create group'}
        </Button>
      </div>
    </div>
  )
}
