import React, { useState, useEffect } from 'react';
import ResponsiveCard from '../UI/ResponsiveCard';
import ResponsiveInput from '../UI/ResponsiveInput';
import LoadingSpinner from '../UI/LoadingSpinner';
import { 
  MagnifyingGlassIcon, 
  UserCircleIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';

interface ChatConversation {
  id: string;
  userId: string;
  name: string;
  profileImage?: string;
  lastMessage?: string;
  lastMessageTime?: string;
  isOnline: boolean;
  unreadCount: number;
}

interface ResponsiveChatListProps {
  onSelectConversation: (conversation: ChatConversation) => void;
  selectedConversationId?: string;
}

export default function ResponsiveChatList({ 
  onSelectConversation, 
  selectedConversationId 
}: ResponsiveChatListProps) {
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const loadConversations = async () => {
      try {
        setLoading(true);
        setError(null);

        // TODO: Implement actual API calls
        // const activeResponse = await fetchActiveConversations();
        // const matchedResponse = await fetchMatchedConversations();
        
        // Mock data for now
        const mockConversations: ChatConversation[] = [
          {
            id: '1',
            userId: 'user1',
            name: 'John Doe',
            profileImage: undefined,
            lastMessage: 'Hey! How are you doing?',
            lastMessageTime: new Date(Date.now() - 3600000).toISOString(),
            isOnline: true,
            unreadCount: 2
          },
          {
            id: '2',
            userId: 'user2',
            name: 'Jane Smith',
            profileImage: undefined,
            lastMessage: 'Thanks for the help!',
            lastMessageTime: new Date(Date.now() - 7200000).toISOString(),
            isOnline: false,
            unreadCount: 0
          },
          {
            id: '3',
            userId: 'user3',
            name: 'Mike Johnson',
            profileImage: undefined,
            lastMessage: 'See you tomorrow!',
            lastMessageTime: new Date(Date.now() - 86400000).toISOString(),
            isOnline: true,
            unreadCount: 1
          }
        ];

        setConversations(mockConversations);
      } catch (err) {
        setError('Failed to load conversations');
        console.error('Error loading conversations:', err);
      } finally {
        setLoading(false);
      }
    };

    loadConversations();
  }, []);

  const filteredConversations = conversations.filter(conversation =>
    conversation.name.toLowerCase().includes(search.toLowerCase())
  );

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 168) { // 7 days
      return date.toLocaleDateString([], { weekday: 'short' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="lg" text="Loading conversations..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 mb-4">{error}</div>
        <ResponsiveButton onClick={() => window.location.reload()}>
          Try Again
        </ResponsiveButton>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="p-4">
        <ResponsiveInput
          type="text"
          placeholder="Search conversations..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          leftIcon={<MagnifyingGlassIcon className="h-5 w-5" />}
        />
      </div>

      {/* Conversations List */}
      <div className="space-y-2">
        {filteredConversations.length === 0 ? (
          <div className="text-center py-12">
            <ChatBubbleLeftRightIcon className="w-12 h-12 text-white/30 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">No conversations</h3>
            <p className="text-white/70">
              {search ? 'No conversations match your search.' : 'Start a conversation to see it here.'}
            </p>
          </div>
        ) : (
          filteredConversations.map((conversation) => (
            <ResponsiveCard
              key={conversation.id}
              hover
              clickable
              onClick={() => onSelectConversation(conversation)}
              className={`${
                selectedConversationId === conversation.id 
                  ? 'bg-green-500/20 border-green-500/50' 
                  : ''
              } transition-all duration-200`}
            >
              <div className="flex items-center gap-3">
                {/* Avatar */}
                <div className="relative">
                  {conversation.profileImage ? (
                    <img
                      src={conversation.profileImage}
                      alt={conversation.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                      <UserCircleIcon className="w-6 h-6 text-white/70" />
                    </div>
                  )}
                  {conversation.isOnline && (
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-black"></div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold text-white truncate">
                      {conversation.name}
                    </h3>
                    <span className="text-xs text-white/50 flex-shrink-0">
                      {conversation.lastMessageTime && formatTime(conversation.lastMessageTime)}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-white/70 truncate">
                      {conversation.lastMessage || 'No messages yet'}
                    </p>
                    {conversation.unreadCount > 0 && (
                      <span className="bg-green-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center flex-shrink-0">
                        {conversation.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </ResponsiveCard>
          ))
        )}
      </div>
    </div>
  );
}
