import { useEffect, useState } from 'react'
import { wsClient } from '@/lib/ws-client/ws-client'

interface WSMessage { type: string, [key: string]: any }

export function useWebSocket (userEmail: string | null) {
  const [message, setMessage] = useState<WSMessage | null>(null)

  useEffect(() => {
    if (!userEmail) return
    wsClient.connect(userEmail)

    const unsubscribe = wsClient.subscribe((msg) => {
      setMessage(msg)
    })

    return unsubscribe
  }, [userEmail])

  return {
    message,
    sendMessage: wsClient.send.bind(wsClient)
  }
}
