import { useState, useEffect } from 'react'
import { chatSocketService } from '../socket'

export function useWebSocket() {
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    const checkConnection = () => {
      setIsConnected(chatSocketService.getConnectionStatus())
    }

    // Check connection status every second
    const interval = setInterval(checkConnection, 1000)

    return () => clearInterval(interval)
  }, [])

  return { isConnected }
} 