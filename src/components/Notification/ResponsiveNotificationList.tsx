import React, { useState, useEffect } from 'react';
import ResponsiveCard from '../UI/ResponsiveCard';
import ResponsiveButton from '../UI/ResponsiveButton';
import LoadingSpinner from '../UI/LoadingSpinner';
import { 
  BellIcon, 
  UserPlusIcon, 
  HeartIcon,
  CheckIcon,
  XMarkIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import { fetchNotifications, handleConnectionRequest, markNotificationAsRead } from '@/lib/api';
import { getAuthToken } from '@/lib/utils';

interface Notification {
  id: string;
  type: 'connection_request' | 'connection_accepted' | 'connection_rejected' | 'adjective_match' | 'general';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  data?: {
    userId?: string;
    userName?: string;
    userAvatar?: string;
    connectionId?: string;
    adjective?: string;
  };
}

export default function ResponsiveNotificationList() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState<string | null>(null);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = getAuthToken();
      if (!token) {
        setError('Please log in to view notifications');
        return;
      }

      const response = await fetchNotifications(token);
      if (response.success) {
        setNotifications(response.notifications || []);
      } else {
        setError(response.message || 'Failed to load notifications');
      }
    } catch (err) {
      setError('Failed to load notifications. Please try again.');
      console.error('Error loading notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleConnectionAction = async (notificationId: string, action: 'accept' | 'reject') => {
    try {
      setProcessing(notificationId);
      
      const token = getAuthToken();
      if (!token) return;

      const notification = notifications.find(n => n.id === notificationId);
      if (!notification?.data?.connectionId) return;

      const response = await handleConnectionRequest({
        connectionId: notification.data.connectionId,
        action
      }, token);

      if (response.success) {
        // Remove the notification
        setNotifications(prev => prev.filter(n => n.id !== notificationId));
      } else {
        setError(response.message || 'Failed to process request');
      }
    } catch (err) {
      setError('Failed to process request. Please try again.');
      console.error('Error processing connection request:', err);
    } finally {
      setProcessing(null);
    }
  };

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      const token = getAuthToken();
      if (!token) return;

      await markNotificationAsRead(notificationId, token);
      
      setNotifications(prev => 
        prev.map(n => 
          n.id === notificationId ? { ...n, isRead: true } : n
        )
      );
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'connection_request':
        return <UserPlusIcon className="h-5 w-5 text-blue-400" />;
      case 'connection_accepted':
        return <CheckIcon className="h-5 w-5 text-green-400" />;
      case 'connection_rejected':
        return <XMarkIcon className="h-5 w-5 text-red-400" />;
      case 'adjective_match':
        return <HeartIcon className="h-5 w-5 text-pink-400" />;
      default:
        return <BellIcon className="h-5 w-5 text-white/70" />;
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = (now.getTime() - date.getTime()) / (1000 * 60);

    if (diffInMinutes < 60) {
      return `${Math.floor(diffInMinutes)}m ago`;
    } else if (diffInMinutes < 1440) { // 24 hours
      return `${Math.floor(diffInMinutes / 60)}h ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="lg" text="Loading notifications..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 mb-4">{error}</div>
        <ResponsiveButton onClick={loadNotifications}>
          Try Again
        </ResponsiveButton>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white">Notifications</h2>
        <span className="text-sm text-white/70">
          {notifications.filter(n => !n.isRead).length} unread
        </span>
      </div>

      {/* Notifications List */}
      {notifications.length === 0 ? (
        <div className="text-center py-12">
          <BellIcon className="w-12 h-12 text-white/30 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">No notifications</h3>
          <p className="text-white/70">
            You'll see notifications for connection requests and matches here.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((notification) => (
            <ResponsiveCard
              key={notification.id}
              hover
              className={`${
                !notification.isRead 
                  ? 'bg-blue-500/10 border-blue-500/30' 
                  : ''
              } transition-all duration-200`}
            >
              <div className="flex items-start gap-3">
                {/* Icon */}
                <div className="flex-shrink-0 mt-1">
                  {getNotificationIcon(notification.type)}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-white text-sm">
                      {notification.title}
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-white/50">
                        {formatTime(notification.timestamp)}
                      </span>
                      {!notification.isRead && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      )}
                    </div>
                  </div>

                  <p className="text-sm text-white/70 mb-3">
                    {notification.message}
                  </p>

                  {/* Action Buttons for Connection Requests */}
                  {notification.type === 'connection_request' && notification.data?.connectionId && (
                    <div className="flex gap-2">
                      <ResponsiveButton
                        variant="primary"
                        size="sm"
                        onClick={() => handleConnectionAction(notification.id, 'accept')}
                        loading={processing === notification.id}
                        disabled={!!processing}
                        className="flex-1"
                      >
                        Accept
                      </ResponsiveButton>
                      <ResponsiveButton
                        variant="outline"
                        size="sm"
                        onClick={() => handleConnectionAction(notification.id, 'reject')}
                        loading={processing === notification.id}
                        disabled={!!processing}
                        className="flex-1"
                      >
                        Decline
                      </ResponsiveButton>
                    </div>
                  )}

                  {/* Mark as Read Button */}
                  {!notification.isRead && notification.type !== 'connection_request' && (
                    <ResponsiveButton
                      variant="ghost"
                      size="sm"
                      onClick={() => handleMarkAsRead(notification.id)}
                      className="mt-2"
                    >
                      Mark as Read
                    </ResponsiveButton>
                  )}
                </div>
              </div>
            </ResponsiveCard>
          ))}
        </div>
      )}
    </div>
  );
}
