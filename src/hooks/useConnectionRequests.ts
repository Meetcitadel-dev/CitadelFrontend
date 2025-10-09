import { useEffect, useState, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { chatSocketService } from '../lib/socket';
import { toast } from 'react-hot-toast';

interface ConnectionRequestData {
  id: number;
  requesterId: number;
  requesterName: string;
  requesterUsername?: string;
  requesterImage?: string;
  targetId: number;
  status: string;
  createdAt: string;
  message: string;
}

interface ConnectionAcceptedData {
  connectionId: number;
  accepterId: number;
  accepterName: string;
  accepterUsername?: string;
  accepterImage?: string;
  requestId: number;
  status: string;
  message: string;
}

interface ConnectionRejectedData {
  requestId: number;
  rejecterId: number;
  rejecterName: string;
  status: string;
  message: string;
}

interface ConnectionRemovedData {
  connectionId: number;
  removerId: number;
  removerName: string;
  targetId: number;
  message: string;
}

export const useConnectionRequests = () => {
  const [connectionRequests, setConnectionRequests] = useState<ConnectionRequestData[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const queryClient = useQueryClient();

  // Handle incoming connection request
  const handleConnectionRequestReceived = useCallback((data: ConnectionRequestData) => {
    console.log('🔗 Received connection request:', data);
    
    // Add to local state
    setConnectionRequests(prev => {
      const exists = prev.find(req => req.id === data.id);
      if (exists) return prev;
      return [data, ...prev];
    });

    // Show toast notification
    toast.success(data.message, {
      duration: 5000,
      icon: '🔗',
      style: {
        background: '#10B981',
        color: 'white',
      },
    });

    // Invalidate relevant queries
    queryClient.invalidateQueries({ queryKey: ['notifications'] });
    queryClient.invalidateQueries({ queryKey: ['connectionRequests'] });
  }, [queryClient]);

  // Handle connection request accepted
  const handleConnectionRequestAccepted = useCallback((data: ConnectionAcceptedData) => {
    console.log('✅ Connection request accepted:', data);
    
    // Remove from local state
    setConnectionRequests(prev => prev.filter(req => req.id !== data.requestId));

    // Show toast notification
    toast.success(data.message, {
      duration: 5000,
      icon: '✅',
      style: {
        background: '#10B981',
        color: 'white',
      },
    });

    // Invalidate relevant queries
    queryClient.invalidateQueries({ queryKey: ['connections'] });
    queryClient.invalidateQueries({ queryKey: ['notifications'] });
    queryClient.invalidateQueries({ queryKey: ['connectionRequests'] });
  }, [queryClient]);

  // Handle connection request rejected
  const handleConnectionRequestRejected = useCallback((data: ConnectionRejectedData) => {
    console.log('❌ Connection request rejected:', data);
    
    // Remove from local state
    setConnectionRequests(prev => prev.filter(req => req.id !== data.requestId));

    // Show toast notification
    toast.error(data.message, {
      duration: 5000,
      icon: '❌',
      style: {
        background: '#EF4444',
        color: 'white',
      },
    });

    // Invalidate relevant queries
    queryClient.invalidateQueries({ queryKey: ['notifications'] });
    queryClient.invalidateQueries({ queryKey: ['connectionRequests'] });
  }, [queryClient]);

  // Handle connection removed
  const handleConnectionRemoved = useCallback((data: ConnectionRemovedData) => {
    console.log('🗑️ Connection removed:', data);
    
    // Show toast notification
    toast.error(data.message, {
      duration: 5000,
      icon: '🗑️',
      style: {
        background: '#F59E0B',
        color: 'white',
      },
    });

    // Invalidate relevant queries
    queryClient.invalidateQueries({ queryKey: ['connections'] });
    queryClient.invalidateQueries({ queryKey: ['notifications'] });
  }, [queryClient]);

  // Handle general notifications
  const handleNotification = useCallback((data: any) => {
    console.log('🔔 Received notification:', data);
    
    // Show toast notification
    toast(data.message || 'New notification', {
      duration: 4000,
      icon: '🔔',
    });

    // Invalidate notifications query
    queryClient.invalidateQueries({ queryKey: ['notifications'] });
  }, [queryClient]);

  // Setup WebSocket event listeners
  useEffect(() => {
    if (!chatSocketService.getConnectionStatus()) {
      chatSocketService.connect();
    }

    // Set up event listeners
    chatSocketService.onConnectionRequestReceived(handleConnectionRequestReceived);
    chatSocketService.onConnectionRequestAccepted(handleConnectionRequestAccepted);
    chatSocketService.onConnectionRequestRejected(handleConnectionRequestRejected);
    chatSocketService.onConnectionRemoved(handleConnectionRemoved);
    chatSocketService.onNotification(handleNotification);

    setIsConnected(chatSocketService.getConnectionStatus());

    // Cleanup function
    return () => {
      chatSocketService.offConnectionRequestReceived();
      chatSocketService.offConnectionRequestAccepted();
      chatSocketService.offConnectionRequestRejected();
      chatSocketService.offConnectionRemoved();
      chatSocketService.offNotification();
    };
  }, [
    handleConnectionRequestReceived,
    handleConnectionRequestAccepted,
    handleConnectionRequestRejected,
    handleConnectionRemoved,
    handleNotification
  ]);

  // Clear a specific connection request from local state
  const clearConnectionRequest = useCallback((requestId: number) => {
    setConnectionRequests(prev => prev.filter(req => req.id !== requestId));
  }, []);

  // Clear all connection requests from local state
  const clearAllConnectionRequests = useCallback(() => {
    setConnectionRequests([]);
  }, []);

  return {
    connectionRequests,
    isConnected,
    clearConnectionRequest,
    clearAllConnectionRequests,
  };
};
