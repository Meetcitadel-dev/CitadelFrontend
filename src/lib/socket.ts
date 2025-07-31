import { io, Socket } from 'socket.io-client';
import { getAuthToken } from './utils';

class ChatSocketService {
  private socket: Socket | null = null;
  private isConnected = false;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  connect() {
    if (this.socket?.connected) {
      console.log('✅ WebSocket already connected, skipping...');
      return;
    }

    const token = getAuthToken();
    if (!token) {
      console.error('No authentication token found for WebSocket connection');
      return;
    }

    // Connect to your backend WebSocket endpoint
    this.socket = io('http://localhost:3000', {
      auth: {
        token: token
      },
      transports: ['websocket', 'polling']
    });

    this.socket.on('connect', () => {
      console.log('✅ WebSocket connected successfully');
      this.isConnected = true;
      this.reconnectAttempts = 0;
    });

    this.socket.on('disconnect', (reason) => {
      console.log('WebSocket disconnected:', reason);
      this.isConnected = false;
      
      if (reason === 'io server disconnect') {
        // Server disconnected us, try to reconnect
        this.reconnect();
      }
    });

    this.socket.on('connect_error', (error) => {
      console.error('❌ WebSocket connection error:', error);
      this.isConnected = false;
      
      if (this.reconnectAttempts < this.maxReconnectAttempts) {
        setTimeout(() => {
          this.reconnect();
        }, 1000 * (this.reconnectAttempts + 1)); // Exponential backoff
      }
    });
  }

  private reconnect() {
    this.reconnectAttempts++;
    if (this.reconnectAttempts <= this.maxReconnectAttempts) {
      console.log(`Attempting to reconnect... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
      this.connect();
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

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

  // Remove event listeners
  off(event: string) {
    if (!this.socket) return;
    
    this.socket.off(event);
  }

  // Get connection status
  getConnectionStatus() {
    return this.isConnected;
  }
}

// Create a singleton instance
export const chatSocketService = new ChatSocketService(); 