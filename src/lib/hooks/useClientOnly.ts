import { useEffect, useState } from 'react'

/**
 * Hook to ensure code only runs on the client side
 * Prevents hydration mismatches by ensuring server and client render the same thing initially
 */
export function useClientOnly() {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  return isClient
}

/**
 * Hook to safely access localStorage
 * Returns null during SSR and the actual value on client
 */
export function useLocalStorage<T>(key: string, defaultValue: T): [T, (value: T) => void] {
  const [storedValue, setStoredValue] = useState<T>(defaultValue)
  const isClient = useClientOnly()

  useEffect(() => {
    if (isClient) {
      try {
        const item = localStorage.getItem(key)
        if (item) {
          setStoredValue(JSON.parse(item))
        }
      } catch (error) {
        console.error(`Error reading localStorage key "${key}":`, error)
      }
    }
  }, [isClient, key])

  const setValue = (value: T) => {
    try {
      setStoredValue(value)
      if (isClient) {
        localStorage.setItem(key, JSON.stringify(value))
      }
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error)
    }
  }

  return [storedValue, setValue]
}

/**
 * Hook to safely access sessionStorage
 * Returns null during SSR and the actual value on client
 */
export function useSessionStorage<T>(key: string, defaultValue: T): [T, (value: T) => void] {
  const [storedValue, setStoredValue] = useState<T>(defaultValue)
  const isClient = useClientOnly()

  useEffect(() => {
    if (isClient) {
      try {
        const item = sessionStorage.getItem(key)
        if (item) {
          setStoredValue(JSON.parse(item))
        }
      } catch (error) {
        console.error(`Error reading sessionStorage key "${key}":`, error)
      }
    }
  }, [isClient, key])

  const setValue = (value: T) => {
    try {
      setStoredValue(value)
      if (isClient) {
        sessionStorage.setItem(key, JSON.stringify(value))
      }
    } catch (error) {
      console.error(`Error setting sessionStorage key "${key}":`, error)
    }
  }

  return [storedValue, setValue]
}
