import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { apiClient } from '../../lib/apiClient';

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

interface ConnectionRequestNotificationProps {
  request: ConnectionRequestData;
  onAccept?: (requestId: number) => void;
  onReject?: (requestId: number) => void;
  onClose?: () => void;
  showActions?: boolean;
}

const ConnectionRequestNotification: React.FC<ConnectionRequestNotificationProps> = ({
  request,
  onAccept,
  onReject,
  onClose,
  showActions = true
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const queryClient = useQueryClient();

  // Handle connection request response
  const handleConnectionRequestMutation = useMutation({
    mutationFn: async ({ requestId, action }: { requestId: number; action: 'accept' | 'reject' }) => {
      const response = await apiClient.post('/api/v1/notifications/handle-connection-request', {
        requestId,
        action
      });
      return response.data;
    },
    onSuccess: (data, variables) => {
      const action = variables.action;
      toast.success(
        action === 'accept' 
          ? 'Connection request accepted!' 
          : 'Connection request rejected',
        {
          icon: action === 'accept' ? '✅' : '❌',
          duration: 3000,
        }
      );

      // Call parent callbacks
      if (action === 'accept' && onAccept) {
        onAccept(variables.requestId);
      } else if (action === 'reject' && onReject) {
        onReject(variables.requestId);
      }

      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['connectionRequests'] });
      queryClient.invalidateQueries({ queryKey: ['connections'] });
      
      setIsProcessing(false);
    },
    onError: (error: any) => {
      console.error('Error handling connection request:', error);
      toast.error(
        error.response?.data?.message || 'Failed to process connection request',
        { duration: 4000 }
      );
      setIsProcessing(false);
    }
  });

  const handleAccept = () => {
    if (isProcessing) return;
    setIsProcessing(true);
    handleConnectionRequestMutation.mutate({ requestId: request.id, action: 'accept' });
  };

  const handleReject = () => {
    if (isProcessing) return;
    setIsProcessing(true);
    handleConnectionRequestMutation.mutate({ requestId: request.id, action: 'reject' });
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 mb-3 transition-all duration-200 hover:shadow-md">
      <div className="flex items-start space-x-3">
        {/* Profile Image */}
        <div className="flex-shrink-0">
          {request.requesterImage ? (
            <img
              src={request.requesterImage}
              alt={request.requesterName}
              className="w-12 h-12 rounded-full object-cover border-2 border-blue-100"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-semibold text-lg">
              {request.requesterName.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">
                {request.requesterName}
                {request.requesterUsername && (
                  <span className="text-gray-500 font-normal ml-1">
                    @{request.requesterUsername}
                  </span>
                )}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                {request.message}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                {formatTimeAgo(request.createdAt)}
              </p>
            </div>

            {/* Close button */}
            {onClose && (
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Close notification"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {/* Action Buttons */}
          {showActions && request.status === 'pending' && (
            <div className="flex space-x-2 mt-3">
              <button
                onClick={handleAccept}
                disabled={isProcessing}
                className="flex-1 bg-blue-600 text-white text-sm font-medium py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isProcessing ? (
                  <div className="flex items-center justify-center">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Processing...
                  </div>
                ) : (
                  'Accept'
                )}
              </button>
              <button
                onClick={handleReject}
                disabled={isProcessing}
                className="flex-1 bg-gray-200 text-gray-700 text-sm font-medium py-2 px-4 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Decline
              </button>
            </div>
          )}

          {/* Status indicator for non-pending requests */}
          {request.status !== 'pending' && (
            <div className="mt-2">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                request.status === 'accepted' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {request.status === 'accepted' ? '✅ Accepted' : '❌ Declined'}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConnectionRequestNotification;
