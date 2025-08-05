

import { useState, useEffect, useRef } from "react"
import { ArrowLeft, MoreVertical, Mic, Send, Heart, MessageCircle, X } from "lucide-react"
import BlockUserModal from "./BlockUserModal"
import ChatDropdown from "./ChatDropdown"
import { 
  fetchConversationMessages, 
  sendMessage, 
  markMessagesAsRead, 
  getConversationByUserId, 
  getConversationById, 
  fetchUserProfileByName,
  getMatchState,
  connectAfterMatch,
  getIceBreakingPrompt,
  sendConnectionRequest,
  dismissMatchPrompt,
  moveChatToActive,
  checkChatHistory
} from "@/lib/api"
import { getAuthToken } from "@/lib/utils"
import { chatSocketService } from "@/lib/socket"
import { useWebSocket } from "@/lib/hooks/useWebSocket"
import { generateIceBreakingPrompt } from "@/lib/adjectiveUtils"

interface ChatConversationProps {
  onBack: () => void
  conversationId?: string
  userId?: string
  isFromMatches?: boolean // New prop to identify if chat is from matches section
}

interface Message {
  id: string
  text: string
  isSent: boolean
  timestamp: string
  status: 'sent' | 'delivered' | 'read'
}

interface ConversationInfo {
  id: string
  userId: string
  name: string
  profileImage?: string
}

interface MatchState {
  id: string
  userId1: string
  userId2: string
  mutualAdjective: string
  isConnected: boolean
  matchTimestamp: string
  connectionTimestamp?: string
  iceBreakingPrompt?: string
}

// Enum for match cases
enum MatchCase {
  CASE_1 = 'CASE_1', // Already Connected + Already Chatting + Match
  CASE_2 = 'CASE_2', // Already Connected + Never Chatted + Match  
  CASE_3 = 'CASE_3'  // Never Connected + Match
}

export default function ChatConversation({ onBack, conversationId, userId, isFromMatches = false }: ChatConversationProps) {
  console.log('🚀 ChatConversation rendered with props:', {
    conversationId,
    userId,
    isFromMatches
  })
  const [messages, setMessages] = useState<Message[]>([])
  const [conversationInfo, setConversationInfo] = useState<ConversationInfo | null>(null)
  const [inputValue, setInputValue] = useState("")
  const [showDropdown, setShowDropdown] = useState(false)
  const [showBlockModal, setShowBlockModal] = useState(false)
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [connectionMethod, setConnectionMethod] = useState<'websocket' | 'polling' | 'none'>('none')
  const { isConnected } = useWebSocket()
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Enhanced state for match and connection flow
  const [matchState, setMatchState] = useState<MatchState | null>(null)
  const [isMatched, setIsMatched] = useState(false)
  const [isConnectedToMatch, setIsConnectedToMatch] = useState(false)
  const [showConnectButton, setShowConnectButton] = useState(false)
  const [showCrossButton, setShowCrossButton] = useState(false)
  const [connecting, setConnecting] = useState(false)
  const [iceBreakingPrompt, setIceBreakingPrompt] = useState<string>("")
  const [matchCase, setMatchCase] = useState<MatchCase | null>(null)
  const [hasChatHistory, setHasChatHistory] = useState(false)
  const [isUserConnected, setIsUserConnected] = useState(false)
  const [showPrompt, setShowPrompt] = useState(false)

  useEffect(() => {
    let cleanupPolling: (() => void) | undefined;
    let isInitialized = false;

    const fetchMessages = async () => {
      try {
        setLoading(true)
        
        const token = getAuthToken()
        if (!token) {
          console.error('No authentication token found')
          return
        }

        if (!conversationId) {
          console.error('No conversation ID provided')
          return
        }

        const response = await fetchConversationMessages(conversationId, token)
        
        if (response.success) {
          // Sort messages by timestamp to ensure proper order
          const sortedMessages = response.messages.sort((a, b) => 
            new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
          )
          setMessages(sortedMessages)
          // Mark messages as read
          await markMessagesAsRead(conversationId, token)
        }
      } catch (error) {
        console.error('Error fetching messages:', error)
      } finally {
        setLoading(false)
      }
    }

    const fetchConversationInfo = async () => {
      try {
        const token = getAuthToken()
        if (!token) return

        // If we have userId, try to get conversation info
        if (userId) {
          const response = await getConversationByUserId(userId, token)
          
          if (response.success && response.conversation) {
            setConversationInfo(response.conversation)
            return
          }
        }
        
        // Fallback: try to get user profile by ID if userId exists
        if (userId) {
          try {
            const userProfileResponse = await fetchUserProfileByName(userId, token)
            
            if (userProfileResponse.success && userProfileResponse.data) {
              setConversationInfo({
                id: conversationId || '',
                userId: userId,
                name: userProfileResponse.data.name,
                profileImage: undefined
              })
              return
            }
          } catch (profileError) {
            console.error('Error fetching user profile:', profileError)
          }
        }
        
        // Final fallback: try to get conversation details by conversation ID
        if (conversationId && !userId) {
          try {
            const conversationResponse = await getConversationById(conversationId, token)
            
            if (conversationResponse.success && conversationResponse.conversation) {
              setConversationInfo(conversationResponse.conversation)
              return
            }
          } catch (error) {
            console.error('Error fetching conversation details:', error)
          }
          
          // Fallback: try to get conversation details from the messages
          try {
            const messagesResponse = await fetchConversationMessages(conversationId, token)
            if (messagesResponse.success && messagesResponse.messages.length > 0) {
              // Look for messages from other users to get their info
              const otherUserMessages = messagesResponse.messages.filter(msg => !msg.isSent)
              if (otherUserMessages.length > 0) {
                setConversationInfo({
                  id: conversationId,
                  userId: 'unknown',
                  name: `User`,
                  profileImage: undefined
                })
                return
              }
            }
          } catch (error) {
            console.error('Error fetching messages for fallback:', error)
          }
          
          // Last resort: show conversation ID
          setConversationInfo({
            id: conversationId,
            userId: 'unknown',
            name: `Chat ${conversationId.slice(0, 8)}...`,
            profileImage: undefined
          })
        }
      } catch (error) {
        console.error('Error fetching conversation info:', error)
      }
    }

    // Check match state and connection status
    const checkMatchAndConnection = async () => {
      if (!userId) return
      
      try {
        const token = getAuthToken()
        if (!token) return

        console.log('🔍 Checking match and connection for userId:', userId)

      // Get match state
      const matchResponse = await getMatchState(userId, token)
      console.log('📊 Match response:', matchResponse)
      
      if (matchResponse.success && matchResponse.matchState) {
        setMatchState(matchResponse.matchState)
        setIsMatched(true)
        
        // Check if users are connected
        const isConnected = matchResponse.matchState.isConnected
        console.log('🔗 Is connected:', isConnected)
        
        // Check chat history
        const chatHistoryResponse = await checkChatHistory(userId, token)
        console.log('💬 Chat history response:', chatHistoryResponse)
        const hasHistory = chatHistoryResponse.success ? chatHistoryResponse.hasChatHistory : false
        console.log('📝 Has chat history:', hasHistory)
        
        // Determine match case based on connection status and chat history
        if (isConnected && hasHistory) {
          console.log('✅ Case 1: Already Connected + Already Chatting + Match')
          console.log('🔧 Setting UI state:', {
            showPrompt: isFromMatches,
            showCrossButton: isFromMatches,
            showConnectButton: false,
            isFromMatches: isFromMatches
          })
          setMatchCase(MatchCase.CASE_1)
          setIsUserConnected(true)
          setHasChatHistory(true)
          setShowPrompt(isFromMatches) // Only show prompt in matches section
          setShowCrossButton(isFromMatches)
          setShowConnectButton(false)
        } else if (isConnected && !hasHistory) {
          console.log('✅ Case 2: Already Connected + Never Chatted + Match')
          setMatchCase(MatchCase.CASE_2)
          setIsUserConnected(true)
          setHasChatHistory(false)
          setShowPrompt(true)
          setShowCrossButton(true)
          setShowConnectButton(false)
        } else if (!isConnected) {
          console.log('✅ Case 3: Never Connected + Match')
          setMatchCase(MatchCase.CASE_3)
          setIsUserConnected(false)
          setHasChatHistory(false)
          setShowPrompt(true)
          setShowConnectButton(true)
          setShowCrossButton(false)
        }
        
        console.log('🎯 Final state:', {
          matchCase: matchCase,
          showPrompt: showPrompt,
          showCrossButton: showCrossButton,
          showConnectButton: showConnectButton,
          isFromMatches: isFromMatches
        })
        
        // Get ice-breaking prompt
        const promptResponse = await getIceBreakingPrompt(userId, token)
        if (promptResponse.success) {
          setIceBreakingPrompt(promptResponse.prompt)
        } else {
          // Fallback prompt
          setIceBreakingPrompt(`You both find each other ${matchResponse.matchState.mutualAdjective.toLowerCase()}!`)
        }
      } else {
        console.log('❌ No match state found')
      }
    } catch (error) {
      console.error('Error checking match and connection:', error)
    }
  }

    // Initialize WebSocket connection
    const initializeWebSocket = () => {
      if (isInitialized) {
        return;
      }
      
      chatSocketService.connect()
      
      // Remove any existing listeners first
      chatSocketService.off('new_message')
      chatSocketService.off('message_status')
      
      // Listen for new messages
      chatSocketService.onNewMessage((data) => {
        if (data.conversationId === conversationId) {
          const newMessage: Message = {
            id: data.message.id,
            text: data.message.text,
            isSent: false, // Message from other user
            timestamp: data.message.timestamp,
            status: data.message.status
          }
                  setMessages(prev => {
          // Check if message already exists to prevent duplicates
          const messageExists = prev.some(msg => 
            msg.id === data.message.id || 
            (msg.text === data.message.text && Math.abs(new Date(msg.timestamp).getTime() - new Date(data.message.timestamp).getTime()) < 1000)
          )
          if (messageExists) {
            return prev
          }
          // Add new message and sort by timestamp
          const updatedMessages = [...prev, newMessage].sort((a, b) => 
            new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
          )
          return updatedMessages
        })
        }
      })

      // Listen for message status updates
      chatSocketService.onMessageStatusUpdate((data) => {
        setMessages(prev => prev.map(msg => 
          msg.id === data.messageId 
            ? { ...msg, status: data.status }
            : msg
        ))
      })

      // Join the conversation room
      if (conversationId) {
        chatSocketService.joinConversation(conversationId)
      }
      
      isInitialized = true;
    }

    // Polling mechanism for real-time updates (fallback)
    const startPolling = () => {
      const pollInterval = setInterval(async () => {
        if (!conversationId) return
        
        try {
          const token = getAuthToken()
          if (!token) return

          const response = await fetchConversationMessages(conversationId, token)
          if (response.success) {
            setMessages(prev => {
              // Merge new messages with existing ones, avoiding duplicates
              const currentMessageIds = new Set(prev.map(msg => msg.id))
              const newMessages = response.messages.filter(msg => !currentMessageIds.has(msg.id))
              
              if (newMessages.length > 0) {
                // Sort all messages by timestamp to maintain order
                const allMessages = [...prev, ...newMessages].sort((a, b) => 
                  new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
                )
                return allMessages
              }
              return prev
            })
          }
        } catch (error) {
          console.error('Error polling messages:', error)
        }
      }, 3000) // Poll every 3 seconds

      return () => clearInterval(pollInterval)
    }

    if (conversationId) {
      fetchMessages()
      
      // Try WebSocket first, fallback to polling
      try {
        initializeWebSocket()
        setConnectionMethod('websocket')
      } catch (error) {
        setConnectionMethod('polling')
        cleanupPolling = startPolling()
      }
    }
    
    // Always try to fetch conversation info, even without userId
    fetchConversationInfo()
    
    // Check match and connection state
    checkMatchAndConnection()

    // Cleanup function
    return () => {
      if (conversationId) {
        chatSocketService.leaveConversation(conversationId)
        chatSocketService.off('new_message')
        chatSocketService.off('message_status')
        chatSocketService.off('user_status')
      }
      if (cleanupPolling) {
        cleanupPolling()
      }
      isInitialized = false;
    }
  }, [conversationId, userId])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Debug useEffect to log state changes
  useEffect(() => {
    console.log('🔄 State changed:', {
      matchCase,
      showPrompt,
      showCrossButton,
      showConnectButton,
      isFromMatches,
      isUserConnected,
      hasChatHistory
    })
  }, [matchCase, showPrompt, showCrossButton, showConnectButton, isFromMatches, isUserConnected, hasChatHistory])

  // Debug useEffect to log banner rendering
  useEffect(() => {
    if (showPrompt) {
      console.log('🎨 Banner should be rendered with:', {
        showPrompt,
        showConnectButton,
        showCrossButton,
        iceBreakingPrompt
      })
    }
  }, [showPrompt, showConnectButton, showCrossButton, iceBreakingPrompt])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleSendMessage = async () => {
    if (!inputValue.trim() || !conversationId || sending) return

    const messageText = inputValue.trim()
    setInputValue("")
    setSending(true)

    try {
      const token = getAuthToken()
      if (!token) return

      // Send message via REST API for persistence first
      const response = await sendMessage(conversationId, messageText, token)
      
      if (response.success) {
        const newMessage: Message = {
          id: response.message.id,
          text: response.message.text,
          isSent: true,
          timestamp: response.message.timestamp,
          status: 'sent'
        }
        setMessages(prev => {
          // Check if message already exists to prevent duplicates
          const messageExists = prev.some(msg => 
            msg.text === messageText && 
            Math.abs(new Date(msg.timestamp).getTime() - new Date(response.message.timestamp).getTime()) < 1000
          )
          if (messageExists) {
            return prev
          }
          // Add new message and sort by timestamp
          const updatedMessages = [...prev, newMessage].sort((a, b) => 
            new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
          )
          return updatedMessages
        })
        
        // Then send via WebSocket for real-time delivery to other users
        chatSocketService.sendMessage(conversationId, messageText)
      }
    } catch (error) {
      console.error('Error sending message:', error)
      // Revert input value if sending failed
      setInputValue(messageText)
    } finally {
      setSending(false)
    }
  }

  const handleConnect = async () => {
    if (!userId || connecting) return
    
    try {
      setConnecting(true)
      const token = getAuthToken()
      if (!token) return

      if (matchCase === MatchCase.CASE_3) {
        // Case 3: Send connection request
        const response = await sendConnectionRequest(userId, token)
        if (response.success) {
          setShowConnectButton(false)
          setShowCrossButton(true)
          // Add a system message about the connection request
          const systemMessage: Message = {
            id: `system-${Date.now()}`,
            text: "Connection request sent! Waiting for acceptance...",
            isSent: false,
            timestamp: new Date().toISOString(),
            status: 'sent'
          }
          setMessages(prev => [...prev, systemMessage])
        }
      } else {
        // Case 2: Direct connection (already connected)
        const response = await connectAfterMatch(userId, token)
        if (response.success) {
          setIsConnectedToMatch(true)
          setShowConnectButton(false)
          setShowCrossButton(false)
          setShowPrompt(false)
          // Add a system message about the connection
          const systemMessage: Message = {
            id: `system-${Date.now()}`,
            text: "You are now connected! Start chatting!",
            isSent: false,
            timestamp: new Date().toISOString(),
            status: 'sent'
          }
          setMessages(prev => [...prev, systemMessage])
        }
      }
    } catch (error) {
      console.error('Error connecting:', error)
    } finally {
      setConnecting(false)
    }
  }

  const handleDismissPrompt = async () => {
    if (!userId) return
    
    try {
      const token = getAuthToken()
      if (!token) return

      const response = await dismissMatchPrompt(userId, token)
      if (response.success) {
        setShowPrompt(false)
        setShowCrossButton(false)
        
        // If this is from matches section and users are connected, 
        // the chat should disappear from matches and only appear in active
        if (isFromMatches && isUserConnected) {
          // Navigate back to remove from matches section
          onBack()
        }
      }
    } catch (error) {
      console.error('Error dismissing prompt:', error)
    }
  }

  const handleMoveToActive = async () => {
    if (!userId) return
    
    try {
      const token = getAuthToken()
      if (!token) return

      const response = await moveChatToActive(userId, token)
      if (response.success) {
        // Navigate back to remove from matches section
        onBack()
      }
    } catch (error) {
      console.error('Error moving chat to active:', error)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      })
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      })
    }
  }

  const shouldShowTime = (message: Message, index: number) => {
    if (index === 0) return true
    
    const currentTime = new Date(message.timestamp)
    const previousTime = new Date(messages[index - 1].timestamp)
    const diffInMinutes = (currentTime.getTime() - previousTime.getTime()) / (1000 * 60)
    
    return diffInMinutes > 5
  }

  if (loading) {
    return (
      <div className="bg-black min-h-screen text-white flex items-center justify-center">
        <div className="text-white">Loading conversation...</div>
      </div>
    )
  }

  return (
    <div className="bg-black min-h-screen text-white relative">
      {/* Header - Fixed */}
      <div className="fixed top-0 left-0 right-0 z-10 bg-black border-b border-gray-800">
        <div className="flex items-center px-4 py-4">
          <button onClick={onBack} className="mr-4">
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>
          <img
            src={conversationInfo?.profileImage || "/placeholder.svg?height=40&width=40"}
            alt={conversationInfo?.name || "User"}
            className="w-10 h-10 rounded-full object-cover mr-3"
          />
          <div className="flex-1">
            <h1 className="text-lg font-semibold">
              {conversationInfo?.name || userId || "User"}
            </h1>
            {isMatched && matchState && (
              <div className="flex items-center gap-1 mt-1">
                <Heart className="w-3 h-3 text-pink-500" />
                <span className="text-xs text-pink-500">
                  Matched on "{matchState.mutualAdjective}"
                </span>
              </div>
            )}
          </div>
          <button onClick={() => setShowDropdown(!showDropdown)} className="relative">
            <MoreVertical className="w-6 h-6 text-white" />
          </button>
        </div>
      </div>

      {/* Dropdown Menu */}
      {showDropdown && (
        <ChatDropdown
          onClose={() => setShowDropdown(false)}
          onBlockUser={() => {
            setShowBlockModal(true)
            setShowDropdown(false)
          }}
          onMoveToActive={handleMoveToActive}
          showMoveToActive={matchCase === MatchCase.CASE_2 && isFromMatches}
        />
      )}

      {/* Block User Modal */}
      {showBlockModal && <BlockUserModal onClose={() => setShowBlockModal(false)} />}

      {/* Match/Connection Banner */}
      {showPrompt && (
        <div className="fixed top-16 left-0 right-0 z-10 bg-purple-600 text-white px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex-1 text-center">
              <div className="text-sm font-medium mb-1">{iceBreakingPrompt}</div>
              {showConnectButton && (
                <button
                  onClick={handleConnect}
                  disabled={connecting}
                  className="bg-white text-purple-600 px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-50"
                >
                  {connecting ? "Sending..." : "Connect to Chat"}
                </button>
              )}
            </div>
            {showCrossButton && (
              <button
                onClick={handleDismissPrompt}
                className="ml-4 p-2 text-white hover:bg-purple-700 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Messages - Scrollable with proper spacing */}
      <div className={`pt-20 pb-24 px-4 py-4 space-y-4 overflow-y-auto h-screen ${showPrompt ? 'pt-32' : ''}`}>
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-gray-400 text-center">
              {matchCase === MatchCase.CASE_3 && !isUserConnected ? (
                <div>
                  <div className="mb-2">You matched with {conversationInfo?.name}!</div>
                  <div className="text-sm">Connect to start the conversation</div>
                </div>
              ) : matchCase === MatchCase.CASE_2 && !hasChatHistory ? (
                <div>
                  <div className="mb-2">You matched with {conversationInfo?.name}!</div>
                  <div className="text-sm">Start your first conversation</div>
                </div>
              ) : (
                <div>
                  <div className="mb-2">No messages yet</div>
                  <div className="text-sm">Start the conversation!</div>
                </div>
              )}
            </div>
          </div>
        ) : (
          messages.map((message, index) => (
            <div key={message.id}>
              {shouldShowTime(message, index) && (
                <div className="text-center text-gray-400 text-sm mb-4">
                  {formatTime(message.timestamp)}
                </div>
              )}
              <div className={`flex ${message.isSent ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-xs px-4 py-3 rounded-2xl ${
                    message.isSent ? "bg-green-600 text-white ml-12" : "bg-gray-800 text-white mr-12"
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input - Fixed */}
      <div className="fixed bottom-0 left-0 right-0 z-10 bg-black border-t border-gray-800">
        <div className="flex items-center space-x-3 px-4 py-4">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder={
                matchCase === MatchCase.CASE_3 && !isUserConnected 
                  ? "Connect to start chatting..." 
                  : matchCase === MatchCase.CASE_2 && !hasChatHistory
                  ? "Start chatting with your match!"
                  : "Send a message..."
              }
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={sending || (matchCase === MatchCase.CASE_3 && !isUserConnected)}
              className="w-full bg-gray-800 rounded-full py-3 px-4 text-white placeholder-gray-400 focus:outline-none disabled:opacity-50"
            />
          </div>
          <button 
            onClick={handleSendMessage}
            disabled={
              !inputValue.trim() || 
              sending || 
              (matchCase === MatchCase.CASE_3 && !isUserConnected)
            }
            className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {inputValue.trim() ? (
              <Send className="w-6 h-6 text-black" />
            ) : (
              <Mic className="w-6 h-6 text-black" />
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
