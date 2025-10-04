/**
 * Profile Avatar Utility
 * Handles consistent default profile avatar selection across the application
 */

// Import the SVG assets
import Group940 from '@/assets/Group 940.svg'
import Group941 from '@/assets/Group 941.svg'
import Group942 from '@/assets/Group 942.svg'
import Group943 from '@/assets/Group 943.svg'
import Group944 from '@/assets/Group 944.svg'
import Group945 from '@/assets/Group 945.svg'

// Array of available default avatars
const DEFAULT_AVATARS = [
  Group940,
  Group941,
  Group942,
  Group943,
  Group944,
  Group945
]

/**
 * Generates a consistent default avatar for a user based on their ID
 * This ensures the same user always gets the same default avatar across the app
 * @param userId - The user's unique identifier
 * @returns The path to the default avatar SVG
 */
export function getDefaultAvatar(userId: string): string {
  if (!userId) {
    return DEFAULT_AVATARS[0] // Fallback to first avatar
  }
  
  // Use a simple hash function to consistently map userId to avatar index
  let hash = 0
  for (let i = 0; i < userId.length; i++) {
    const char = userId.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32-bit integer
  }
  
  // Use absolute value and modulo to get a valid index
  const avatarIndex = Math.abs(hash) % DEFAULT_AVATARS.length
  return DEFAULT_AVATARS[avatarIndex]
}

/**
 * Gets the appropriate profile image URL - either the user's uploaded image or a default avatar
 * @param profileImage - The user's uploaded profile image URL (can be null/undefined)
 * @param userId - The user's unique identifier for consistent default avatar selection
 * @returns The URL to display for the profile image
 */
export function getProfileImageUrl(profileImage: string | null | undefined, userId: string): string {
  // If user has uploaded a profile image, use it
  if (profileImage && profileImage.trim() !== '') {
    return profileImage
  }
  
  // Otherwise, use a consistent default avatar based on user ID
  return getDefaultAvatar(userId)
}

/**
 * Gets a random default avatar (useful for new users before they have an ID)
 * @returns A random default avatar path
 */
export function getRandomDefaultAvatar(): string {
  const randomIndex = Math.floor(Math.random() * DEFAULT_AVATARS.length)
  return DEFAULT_AVATARS[randomIndex]
}
