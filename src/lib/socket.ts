import { io, Socket } from 'socket.io-client';
import { getAuthToken } from './utils';

class ChatSocketService {
  private socket: Socket | null = null;
  private isConnected = false;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectTimeout: NodeJS.Timeout | null = null;
  private isConnecting = false;

  connect() {
    // Prevent multiple simultaneous connection attempts
    if (this.socket?.connected || this.isConnecting) {
      return;
    }

    const token = getAuthToken();
    if (!token) {
      console.error('No authentication token found for WebSocket connection');
      return;
    }

    this.isConnecting = true;

    // Connect to your backend WebSocket endpoint with better configuration
    const baseUrl = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3000';
    this.socket = io(baseUrl, {
      auth: {
        token: token
      },
      transports: ['websocket', 'polling'],
      timeout: 10000, // 10 second timeout
      forceNew: true, // Force new connection
      reconnection: true,
      reconnectionAttempts: this.maxReconnectAttempts,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      // Add namespace to avoid conflicts with Vite HMR
      path: '/socket.io/',
      // Ensure we don't interfere with Vite's WebSocket
      autoConnect: true
    });

    this.socket.on('connect', () => {
      console.log('Chat WebSocket connected successfully');
      this.isConnected = true;
      this.isConnecting = false;
      this.reconnectAttempts = 0;
      // Clear any pending reconnect timeout
      if (this.reconnectTimeout) {
        clearTimeout(this.reconnectTimeout);
        this.reconnectTimeout = null;
      }
    });

    this.socket.on('disconnect', (reason) => {
      console.log('Chat WebSocket disconnected:', reason);
      this.isConnected = false;
      this.isConnecting = false;
      
      // Only attempt reconnection for certain disconnect reasons
      if (reason === 'io server disconnect' || reason === 'transport close') {
        this.scheduleReconnect();
      }
    });

    this.socket.on('connect_error', (error) => {
      console.error('Chat WebSocket connection error:', error.message);
      this.isConnected = false;
      this.isConnecting = false;
      
      // Don't reconnect for authentication errors
      if (error.message.includes('Authentication') || error.message.includes('401')) {
        console.error('Authentication failed, not attempting reconnection');
        return;
      }
      
      this.scheduleReconnect();
    });

    // Handle reconnection events
    this.socket.on('reconnect', (attemptNumber) => {
      console.log(`Chat WebSocket reconnected after ${attemptNumber} attempts`);
      this.isConnected = true;
      this.reconnectAttempts = 0;
    });

    this.socket.on('reconnect_attempt', (attemptNumber) => {
      console.log(`Chat WebSocket reconnection attempt ${attemptNumber}`);
    });

    this.socket.on('reconnect_error', (error) => {
      console.error('Chat WebSocket reconnection error:', error);
    });

    this.socket.on('reconnect_failed', () => {
      console.error('Chat WebSocket reconnection failed after maximum attempts');
      this.isConnected = false;
    });
  }

  private scheduleReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('Maximum reconnection attempts reached');
      return;
    }

    // Clear any existing timeout
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
    }

    this.reconnectAttempts++;
    const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts - 1), 10000); // Exponential backoff, max 10s
    
    console.log(`Scheduling chat WebSocket reconnection attempt ${this.reconnectAttempts} in ${delay}ms`);
    
    this.reconnectTimeout = setTimeout(() => {
      if (!this.isConnected && !this.isConnecting) {
        this.connect();
      }
    }, delay);
  }

  // private reconnect() {
  //   this.scheduleReconnect();
  // }

  disconnect() {
    // Clear any pending reconnection
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }

    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
      this.isConnecting = false;
      this.reconnectAttempts = 0;
    }
  }

  // ===== INDIVIDUAL CONVERSATION METHODS =====

  // Listen for new messages
  onNewMessage(callback: (data: {
    conversationId: string;
    message: {
      id: string;
      text: string;
      senderId: string;
      timestamp: string;
      status: 'sent' | 'delivered' | 'read';
    };
  }) => void) {
    if (!this.socket) return;
    
    this.socket.on('new_message', callback);
  }

  // Listen for message status updates
  onMessageStatusUpdate(callback: (data: {
    messageId: string;
    status: 'delivered' | 'read';
  }) => void) {
    if (!this.socket) return;
    
    this.socket.on('message_status', callback);
  }

  // Listen for user online status
  onUserStatusUpdate(callback: (data: {
    userId: string;
    isOnline: boolean;
    lastSeen: string;
  }) => void) {
    if (!this.socket) return;
    
    this.socket.on('user_status', callback);
  }

  // Join a conversation room
  joinConversation(conversationId: string) {
    if (!this.socket) return;
    
    this.socket.emit('join_conversation', { conversationId });
  }

  // Leave a conversation room
  leaveConversation(conversationId: string) {
    if (!this.socket) return;
    
    this.socket.emit('leave_conversation', { conversationId });
  }

  // Send a message (this will trigger the new_message event for other users)
  sendMessage(conversationId: string, message: string) {
    if (!this.socket) return;
    
    this.socket.emit('send_message', {
      conversationId,
      message
    });
  }

  // Mark messages as read
  markMessagesAsRead(conversationId: string) {
    if (!this.socket) return;
    
    this.socket.emit('mark_read', { conversationId });
  }

  // ===== GROUP CHAT METHODS =====

  // Listen for new group messages
  onGroupMessage(callback: (data: {
    groupId: string;
    message: {
      id: string;
      content: string;
      senderId: string;
      senderName: string;
      senderAvatar?: string;
      timestamp: string;
    };
  }) => void) {
    if (!this.socket) {
      console.error('Socket not available for group message listener');
      return;
    }
    
    
    this.socket.on('group-message', (data) => {
      
      callback(data);
    });
  }

  // Listen for member joined group
  onMemberJoined(callback: (data: {
    groupId: string;
    member: {
      id: string;
      name: string;
      avatar?: string;
    };
  }) => void) {
    if (!this.socket) return;
    
    this.socket.on('member-joined', callback);
  }

  // Listen for member left group
  onMemberLeft(callback: (data: {
    groupId: string;
    memberId: string;
  }) => void) {
    if (!this.socket) return;
    
    this.socket.on('member-left', callback);
  }

  // Listen for group updates
  onGroupUpdated(callback: (data: {
    groupId: string;
    group: {
      id: string;
      name: string;
      description?: string;
      avatar?: string;
      memberCount: number;
    };
  }) => void) {
    if (!this.socket) return;
    
    this.socket.on('group-updated', callback);
  }

  // Listen for unread count updates
  onUnreadCountUpdate(callback: (data: {
    groupId?: string;
    conversationId?: string;
    unreadCount: number;
  }) => void) {
    if (!this.socket) return;
    
    this.socket.on('unread-count-update', callback);
  }

  // Listen for typing indicators in groups
  onGroupTyping(callback: (data: {
    groupId: string;
    userId: string;
    userName: string;
    isTyping: boolean;
  }) => void) {
    if (!this.socket) return;
    
    this.socket.on('group-typing', callback);
  }

  // Join a group room
  joinGroup(groupId: string) {
    if (!this.socket) {
      console.error('Socket not available for joining group');
      return;
    }
    
    
    this.socket.emit('join-group', { groupId });
  }

  // Leave a group room
  leaveGroup(groupId: string) {
    if (!this.socket) return;
    
    
    this.socket.emit('leave-group', { groupId });
  }

  // Send a group message
  sendGroupMessage(groupId: string, message: string) {
    if (!this.socket) {
      console.error('Socket not available for sending group message');
      return;
    }
    
    
    this.socket.emit('send-group-message', {
      groupId,
      content: message
    });
  }

  // Send typing indicator in group
  sendGroupTyping(groupId: string, isTyping: boolean) {
    if (!this.socket) return;
    
    this.socket.emit('group-typing', {
      groupId,
      isTyping
    });
  }

  // Mark group messages as read
  markGroupMessagesAsRead(groupId: string) {
    if (!this.socket) return;
    
    this.socket.emit('mark-group-read', { groupId });
  }

  // Join user-specific room for global notifications
  joinUserRoom(userId: string) {
    if (!this.socket) return;
    
    this.socket.emit('join-user-room', { userId });
  }

  // Remove event listeners
  off(event: string) {
    if (!this.socket) return;
    
    this.socket.off(event);
  }

  // Get connection status
  getConnectionStatus() {
    return this.isConnected;
  }

  // Check if backend is available
  async checkBackendAvailability(): Promise<boolean> {
    try {
      const baseUrl = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3000';
      const response = await fetch(baseUrl + '/health', {
        method: 'GET',
        timeout: 5000
      } as any);
      return response.ok;
    } catch (error) {
      console.log('Backend not available:', error);
      return false;
    }
  }

  // Initialize connection with backend check
  async initializeConnection() {
    const isBackendAvailable = await this.checkBackendAvailability();
    if (isBackendAvailable) {
      this.connect();
    } else {
      console.log('Backend not available, will retry connection later');
      // Retry after 5 seconds
      setTimeout(() => {
        this.initializeConnection();
      }, 5000);
    }
  }
}

// Create a singleton instance
export const chatSocketService = new ChatSocketService(); 