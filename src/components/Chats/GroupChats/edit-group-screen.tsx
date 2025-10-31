"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Search, MoreVertical, Edit2 } from "lucide-react"
import { Input } from "../../ui/input"
import { Button } from "../../ui/button"
import GroupOptionsMenu from "./group-options-menu"
import MemberItem from "./member-item"
import { fetchGroupChat, updateGroupChat, removeGroupMember, leaveGroupChat } from "@/lib/api"
import { getAuthToken } from "@/lib/utils"
import type { GroupChat } from "@/types"
import { getCurrentUserProfile } from "@/lib/api"

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
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const [showAddMembersModal, setShowAddMembersModal] = useState(false)

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

  // Get current user ID
  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        const token = getAuthToken()
        if (!token) return

        const response = await getCurrentUserProfile(token)
        if (response.success && response.data) {
          setCurrentUserId(response.data.id.toString())
        }
      } catch (error) {
        console.error('Error fetching current user:', error)
      }
    }

    getCurrentUser()
  }, [])

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

  const handleRemoveMember = async (memberId: string) => {
    if (!group) return

    try {
      setError(null)
      
      const token = getAuthToken()
      if (!token) {
        setError('Authentication required')
        return
      }

      const response = await removeGroupMember(groupId, memberId, token)
      
      if (response.success) {
        // Update local state by removing the member
        setGroup(prev => prev ? {
          ...prev,
          members: prev.members.filter(member => member.id !== memberId),
          memberCount: prev.memberCount - 1
        } : null)
        onGroupUpdated?.()
      } else {
        setError(response.message || 'Failed to remove member')
      }
    } catch (error) {
      console.error('Error removing member:', error)
      setError('Failed to remove member')
    }
  }

  const handleAddMembers = () => {
    setShowAddMembersModal(true)
  }

  const handleExitGroup = async () => {
    if (!group) return

    if (!confirm('Are you sure you want to exit this group?')) return

    try {
      setError(null)
      
      const token = getAuthToken()
      if (!token) {
        setError('Authentication required')
        return
      }

      const response = await leaveGroupChat(groupId, token)
      
      if (response.success) {
        onBack() // Go back to chat list
      } else {
        setError(response.message || 'Failed to exit group')
      }
    } catch (error) {
      console.error('Error exiting group:', error)
      setError('Failed to exit group')
    }
  }

  const handleMessageMember = (memberId: string) => {
    // Navigate to individual chat with this member
    // For now, we'll just show an alert
    alert(`Message functionality for member ${memberId} will be implemented here`)
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
            <Edit2 
              className="w-4 h-4 text-gray-400 cursor-pointer hover:text-white" 
              onClick={() => setEditingName(true)}
            />
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
            <MemberItem 
              key={member.id} 
              member={member}
              onRemoveMember={handleRemoveMember}
              onMessageMember={handleMessageMember}
              canRemove={member.id !== currentUserId}
              canMessage={member.id !== currentUserId}
            />
          ))
        )}
      </div>

      {/* Options Menu */}
      {showOptionsMenu && (
        <GroupOptionsMenu 
          groupName={group.name} 
          memberCount={group.memberCount} 
          onClose={() => setShowOptionsMenu(false)}
          onAddMembers={handleAddMembers}
          onExitGroup={handleExitGroup}
        />
      )}

      {/* Add Members Modal */}
      {showAddMembersModal && (
        <div className="absolute inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-gray-900 rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-medium text-white mb-4">Add Members</h3>
            <p className="text-gray-400 mb-4">
              This feature will allow you to add new members to the group. 
              For now, you can manually invite people by sharing the group link.
            </p>
            <div className="flex gap-3">
              <Button
                onClick={() => setShowAddMembersModal(false)}
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white"
              >
                Close
              </Button>
              <Button
                onClick={() => {
                  // TODO: Implement actual add members functionality
                  alert('Add members functionality will be implemented here')
                  setShowAddMembersModal(false)
                }}
                className="flex-1 bg-green-500 hover:bg-green-600 text-black"
              >
                Add Members
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
