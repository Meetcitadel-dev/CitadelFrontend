import React, { useState, useEffect, useRef } from 'react';
import ResponsiveCard from '../UI/ResponsiveCard';
import ResponsiveButton from '../UI/ResponsiveButton';
import ResponsiveInput from '../UI/ResponsiveInput';
import LoadingSpinner from '../UI/LoadingSpinner';
import { chatSocketService } from '@/lib/socket';
import { 
  PaperAirplaneIcon, 
  EllipsisVerticalIcon,
  PhoneIcon,
  VideoCameraIcon,
  UserCircleIcon
} from '@heroicons/react/24/outline';

interface Message {
  id: string;
  text: string;
  senderId: string;
  timestamp: string;
  status: 'sent' | 'delivered' | 'read';
  isSent: boolean;
}

interface ChatInterfaceProps {
  conversationId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  isOnline?: boolean;
}

export default function ResponsiveChatInterface({
  conversationId,
  userId,
  userName,
  userAvatar,
  isOnline = false
}: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load messages
  useEffect(() => {
    const loadMessages = async () => {
      try {
        setLoading(true);
        // TODO: Implement message loading from API
        // const response = await fetchConversationMessages(conversationId);
        // setMessages(response.messages || []);
        
        // Mock data for now
        setMessages([
          {
            id: '1',
            text: 'Hey! How are you doing?',
            senderId: userId,
            timestamp: new Date(Date.now() - 3600000).toISOString(),
            status: 'read',
            isSent: false
          },
          {
            id: '2',
            text: 'I\'m doing great! Thanks for asking. How about you?',
            senderId: 'me',
            timestamp: new Date(Date.now() - 3000000).toISOString(),
            status: 'read',
            isSent: true
          }
        ]);
      } catch (err) {
        setError('Failed to load messages');
        console.error('Error loading messages:', err);
      } finally {
        setLoading(false);
      }
    };

    loadMessages();
  }, [conversationId, userId]);

  // Socket event listeners
  useEffect(() => {
    const handleNewMessage = (data: any) => {
      if (data.conversationId === conversationId) {
        setMessages(prev => [...prev, {
          id: data.message.id,
          text: data.message.text,
          senderId: data.message.senderId,
          timestamp: data.message.timestamp,
          status: data.message.status,
          isSent: data.message.senderId !== 'me'
        }]);
      }
    };

    const handleMessageStatus = (data: any) => {
      setMessages(prev => prev.map(msg => 
        msg.id === data.messageId 
          ? { ...msg, status: data.status }
          : msg
      ));
    };

    chatSocketService.onNewMessage(handleNewMessage);
    chatSocketService.onMessageStatusUpdate(handleMessageStatus);

    return () => {
      chatSocketService.off('new_message');
      chatSocketService.off('message_status');
    };
  }, [conversationId]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || sending) return;

    const messageText = newMessage.trim();
    setNewMessage('');
    setSending(true);

    try {
      // Add message optimistically
      const tempMessage: Message = {
        id: `temp-${Date.now()}`,
        text: messageText,
        senderId: 'me',
        timestamp: new Date().toISOString(),
        status: 'sent',
        isSent: true
      };

      setMessages(prev => [...prev, tempMessage]);

      // Send via socket
      chatSocketService.sendMessage(conversationId, messageText);
    } catch (err) {
      setError('Failed to send message');
      console.error('Error sending message:', err);
    } finally {
      setSending(false);
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="lg" text="Loading messages..." />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Chat Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/10 bg-black/50">
        <div className="flex items-center gap-3">
          <div className="relative">
            {userAvatar ? (
              <img
                src={userAvatar}
                alt={userName}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                <UserCircleIcon className="w-6 h-6 text-white/70" />
              </div>
            )}
            {isOnline && (
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-black"></div>
            )}
          </div>
          <div>
            <h3 className="font-semibold text-white">{userName}</h3>
            <p className="text-sm text-white/70">
              {isOnline ? 'Online' : 'Offline'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <ResponsiveButton
            variant="ghost"
            size="sm"
            className="p-2"
            onClick={() => {/* TODO: Implement call */}}
          >
            <PhoneIcon className="h-5 w-5" />
          </ResponsiveButton>
          <ResponsiveButton
            variant="ghost"
            size="sm"
            className="p-2"
            onClick={() => {/* TODO: Implement video call */}}
          >
            <VideoCameraIcon className="h-5 w-5" />
          </ResponsiveButton>
          <ResponsiveButton
            variant="ghost"
            size="sm"
            className="p-2"
          >
            <EllipsisVerticalIcon className="h-5 w-5" />
          </ResponsiveButton>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.isSent ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-xs lg:max-w-md ${
              message.isSent 
                ? 'bg-green-500 text-white' 
                : 'bg-white/10 text-white'
            } rounded-lg px-4 py-2`}>
              <p className="text-sm">{message.text}</p>
              <div className="flex items-center justify-between mt-1">
                <span className="text-xs opacity-70">
                  {formatTime(message.timestamp)}
                </span>
                {message.isSent && (
                  <span className="text-xs opacity-70 ml-2">
                    {message.status === 'read' ? '✓✓' : 
                     message.status === 'delivered' ? '✓' : ''}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Error Message */}
      {error && (
        <div className="px-4 py-2 bg-red-500/20 text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Message Input */}
      <form onSubmit={handleSendMessage} className="p-4 border-t border-white/10">
        <div className="flex gap-3">
          <div className="flex-1">
            <ResponsiveInput
              ref={inputRef}
              type="text"
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              disabled={sending}
              className="pr-12"
            />
          </div>
          <ResponsiveButton
            type="submit"
            variant="primary"
            disabled={!newMessage.trim() || sending}
            loading={sending}
            className="px-4"
          >
            <PaperAirplaneIcon className="h-5 w-5" />
          </ResponsiveButton>
        </div>
      </form>
    </div>
  );
}
