import React, { useState, useEffect } from 'react'
import { getProfileImageUrl, getDefaultAvatar } from '@/lib/profileAvatar'

interface ProfileAvatarProps {
  /** The user's uploaded profile image URL */
  profileImage?: string | null
  /** The user's unique identifier for consistent default avatar selection */
  userId: string
  /** Alt text for the image */
  alt?: string
  /** CSS classes to apply to the image */
  className?: string
  /** Inline styles to apply to the image */
  style?: React.CSSProperties
  /** Image loading strategy */
  loading?: 'lazy' | 'eager'
  /** Image decoding strategy */
  decoding?: 'async' | 'sync' | 'auto'
  /** Image fetch priority */
  fetchPriority?: 'high' | 'low' | 'auto'
  /** Callback when image loads successfully */
  onLoad?: () => void
  /** Callback when image fails to load */
  onError?: (event: React.SyntheticEvent<HTMLImageElement, Event>) => void
  /** Show loading placeholder */
  showPlaceholder?: boolean
  /** Enable progressive loading */
  progressive?: boolean
}

/**
 * ProfileAvatar Component
 * A reusable component that displays either a user's uploaded profile image
 * or a consistent default avatar based on their user ID.
 * 
 * This ensures that:
 * 1. Users with uploaded images see their custom image
 * 2. Users without uploaded images see a consistent default avatar
 * 3. The same user always gets the same default avatar across the app
 */
export default function ProfileAvatar({
  profileImage,
  userId,
  alt = "Profile",
  className = "",
  style,
  loading = "lazy",
  decoding = "async",
  fetchPriority = "auto",
  onLoad,
  onError
}: ProfileAvatarProps) {
  const imageUrl = getProfileImageUrl(profileImage, userId)

  return (
    <img
      src={imageUrl}
      alt={alt}
      className={className}
      style={style}
      loading={loading}
      decoding={decoding}
      fetchPriority={fetchPriority}
      onLoad={onLoad}
      onError={onError}
    />
  )
}
