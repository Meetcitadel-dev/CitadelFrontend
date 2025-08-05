import type { GenderBasedAdjectives, AdjectiveDisplayData } from '@/types'

// Gender-based adjectives as provided by the user
export const GENDER_BASED_ADJECTIVES: GenderBasedAdjectives = {
  male: [
    "Handsome", "Strong", "Brave", "Confident", "Loyal", "Reliable", "Honest",
    "Hardworking", "Protective", "Respectful", "Determined", "Disciplined",
    "Steadfast", "Courageous", "Thoughtful", "Dutiful", "Gallant", "Steady",
    "Vigilant", "Tough", "Sincere", "Decisive", "Witty", "Daring", "Honorable"
  ],
  female: [
    "Beautiful", "Graceful", "Kind", "Caring", "Elegant", "Nurturing", "Gentle",
    "Compassionate", "Radiant", "Warm", "Empathetic", "Intuitive", "Joyful",
    "Poised", "Articulate", "Persistent", "Loving", "Cheerful", "Vibrant",
    "Serene", "Lovable", "Bright", "Charming", "Gracious", "Selfless"
  ],
  neutral: [
    "Smart", "Funny", "Friendly", "Creative", "Optimistic", "Organized",
    "Adaptable", "Generous", "Passionate", "Enthusiastic", "Curious", "Mindful",
    "Innovative", "Dedicated", "Resourceful", "Practical", "Genuine",
    "Considerate", "Collaborative", "Resilient", "Open-minded", "Level-headed",
    "Ambitious", "Analytical", "Patient"
  ]
}

/**
 * Get appropriate adjectives based on viewer's gender and target's gender
 */
export function getAdjectivesForProfile(
  viewerGender: string,
  targetGender: string
): string[] {
  const { male, female, neutral } = GENDER_BASED_ADJECTIVES
  
  // If same gender, show gender-specific + neutral adjectives
  if (viewerGender === targetGender) {
    if (viewerGender === 'Male') {
      return [...male, ...neutral]
    } else if (viewerGender === 'Female') {
      return [...female, ...neutral]
    }
  }
  
  // If different genders, show only neutral adjectives
  return neutral
}

/**
 * Generate 4 adjectives for display based on user engagement
 * 1 selected adjective (if exists) + 3 random adjectives
 */
export function generateAdjectiveDisplay(
  availableAdjectives: string[],
  selectedAdjective?: string
): AdjectiveDisplayData {
  const allAdjectives = [...availableAdjectives]
  let randomAdjectives: string[] = []
  
  if (selectedAdjective) {
    // Remove selected adjective from available pool
    const remainingAdjectives = allAdjectives.filter(adj => adj !== selectedAdjective)
    
    // Select 3 random adjectives from remaining pool
    randomAdjectives = getRandomAdjectives(remainingAdjectives, 3)
  } else {
    // No previous selection, select 4 random adjectives
    randomAdjectives = getRandomAdjectives(allAdjectives, 4)
  }
  
  return {
    selectedAdjective: selectedAdjective || '',
    randomAdjectives,
    allAdjectives: selectedAdjective ? [selectedAdjective, ...randomAdjectives] : randomAdjectives,
    isMatched: false
  }
}

/**
 * Get random adjectives from a pool
 */
function getRandomAdjectives(adjectives: string[], count: number): string[] {
  const shuffled = [...adjectives].sort(() => 0.5 - Math.random())
  return shuffled.slice(0, count)
}

/**
 * Generate ice-breaking prompt for matched users
 */
export function generateIceBreakingPrompt(mutualAdjective: string): string {
  const prompts = [
    `You both find each other ${mutualAdjective.toLowerCase()}! Start a conversation!`,
    `Mutual ${mutualAdjective.toLowerCase()} vibes! Time to connect!`,
    `You're both ${mutualAdjective.toLowerCase()} - perfect match! Say hello!`,
    `${mutualAdjective} minds think alike! Break the ice!`,
    `Your ${mutualAdjective.toLowerCase()} energy is a match! Start chatting!`
  ]
  
  return prompts[Math.floor(Math.random() * prompts.length)]
}

/**
 * Check if two users have matched (selected same adjective)
 */
export function checkForMatch(
  user1Selection: string,
  user2Selection: string
): boolean {
  return user1Selection.toLowerCase() === user2Selection.toLowerCase()
} 