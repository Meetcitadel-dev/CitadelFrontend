"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Search, MoreVertical, Edit2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import GroupOptionsMenu from "./group-options-menu"
import MemberItem from "./member-item"
import { fetchGroupChat, updateGroupChat } from "@/lib/api"
import { getAuthToken } from "@/lib/utils"
import type { GroupChat, GroupMember } from "@/types"

interface EditGroupScreenProps {
  onBack: () => void
  groupId: string
  onGroupUpdated?: () => void
}

export default function EditGroupScreen({ onBack, groupId, onGroupUpdated }: EditGroupScreenProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [showOptionsMenu, setShowOptionsMenu] = useState(false)
  const [group, setGroup] = useState<GroupChat | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editingName, setEditingName] = useState(false)
  const [newGroupName, setNewGroupName] = useState("")
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const fetchGroup = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const token = getAuthToken()
        if (!token) {
          setError('Authentication required')
          return
        }

        const response = await fetchGroupChat(groupId, token)
        
        if (response.success && response.group) {
          setGroup(response.group)
          setNewGroupName(response.group.name)
        } else {
          setError(response.message || 'Failed to load group')
        }
      } catch (error) {
        console.error('Error fetching group:', error)
        setError('Failed to load group')
      } finally {
        setLoading(false)
      }
    }

    fetchGroup()
  }, [groupId])

  const handleSaveGroupName = async () => {
    if (!group || !newGroupName.trim()) return

    try {
      setSaving(true)
      setError(null)
      
      const token = getAuthToken()
      if (!token) {
        setError('Authentication required')
        return
      }

      const response = await updateGroupChat(groupId, {
        name: newGroupName.trim()
      }, token)
      
      if (response.success && response.group) {
        setGroup(response.group)
        setEditingName(false)
        onGroupUpdated?.()
      } else {
        setError(response.message || 'Failed to update group')
      }
    } catch (error) {
      console.error('Error updating group:', error)
      setError('Failed to update group')
    } finally {
      setSaving(false)
    }
  }

  const filteredMembers = group?.members.filter(member =>
    member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.location.toLowerCase().includes(searchQuery.toLowerCase())
  ) || []

  if (loading) {
    return (
      <div className="flex flex-col h-screen bg-black text-white relative">
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <div className="flex items-center gap-4">
            <ArrowLeft className="w-6 h-6 cursor-pointer" onClick={onBack} />
            <h1 className="text-xl font-medium">Edit group</h1>
          </div>
        </div>
        <div className="flex items-center justify-center flex-1">
          <div className="text-white">Loading group...</div>
        </div>
      </div>
    )
  }

  if (error || !group) {
    return (
      <div className="flex flex-col h-screen bg-black text-white relative">
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <div className="flex items-center gap-4">
            <ArrowLeft className="w-6 h-6 cursor-pointer" onClick={onBack} />
            <h1 className="text-xl font-medium">Edit group</h1>
          </div>
        </div>
        <div className="flex items-center justify-center flex-1">
          <div className="text-red-400 text-center">
            <div className="mb-2">{error || 'Group not found'}</div>
            <Button onClick={onBack} className="bg-green-500 text-black">
              Go Back
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen bg-black text-white relative">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-800">
        <div className="flex items-center gap-4">
          <ArrowLeft className="w-6 h-6 cursor-pointer" onClick={onBack} />
          <h1 className="text-xl font-medium">Edit group</h1>
        </div>
        <MoreVertical className="w-6 h-6 cursor-pointer" onClick={() => setShowOptionsMenu(!showOptionsMenu)} />
      </div>

      {/* Group Info */}
      <div className="flex flex-col items-center py-8">
        <div className="w-24 h-24 bg-green-600 rounded-lg flex items-center justify-center mb-4">
          <span className="text-2xl font-bold text-green-400">
            {group.name.substring(0, 2).toUpperCase()}
          </span>
        </div>
        
        {editingName ? (
          <div className="flex items-center gap-2 mb-1">
            <Input
              value={newGroupName}
              onChange={(e) => setNewGroupName(e.target.value)}
              className="bg-gray-800 border-gray-700 text-white text-center"
              autoFocus
            />
            <Button
              onClick={handleSaveGroupName}
              disabled={saving || !newGroupName.trim()}
              className="bg-green-500 hover:bg-green-600 text-black px-3 py-1"
            >
              {saving ? 'Saving...' : 'Save'}
            </Button>
            <Button
              onClick={() => {
                setEditingName(false)
                setNewGroupName(group.name)
              }}
              className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1"
            >
              Cancel
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-lg font-medium">{group.name}</h2>
            {group.isAdmin && (
              <Edit2 
                className="w-4 h-4 text-gray-400 cursor-pointer hover:text-white" 
                onClick={() => setEditingName(true)}
              />
            )}
          </div>
        )}
        
        <p className="text-gray-400 text-sm">{group.memberCount} members</p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="px-4 pb-4">
          <div className="bg-red-900/20 border border-red-500 text-red-400 px-4 py-2 rounded-lg">
            {error}
          </div>
        </div>
      )}

      {/* Search Bar */}
      <div className="px-4 pb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            placeholder="Search members"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-gray-800 border-gray-700 text-white placeholder-gray-400 rounded-lg"
          />
        </div>
      </div>

      {/* Members List */}
      <div className="flex-1 overflow-y-auto">
        {filteredMembers.length === 0 ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-gray-400 text-center">
              {searchQuery ? 'No members found' : 'No members in group'}
            </div>
          </div>
        ) : (
          filteredMembers.map((member) => (
            <MemberItem key={member.id} member={member} />
          ))
        )}
      </div>

      {/* Options Menu */}
      {showOptionsMenu && (
        <GroupOptionsMenu 
          groupName={group.name} 
          memberCount={group.memberCount} 
          onClose={() => setShowOptionsMenu(false)} 
        />
      )}
    </div>
  )
}
