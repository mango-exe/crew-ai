import { useEffect, useState } from 'react'
import { wsClient } from '@/lib/ws-client/ws-client'

interface WSMessage { type: string, [key: string]: any }

export function useWebSocket (userEmail: string | null) {
  const [messages, setMessages] = useState<WSMessage[]>([])

  useEffect(() => {
    if (!userEmail) return
    wsClient.connect(userEmail)

    const unsubscribe = wsClient.subscribe((msg) => {
      setMessages((prev) => [...prev, msg])
    })

    return unsubscribe
  }, [userEmail])

  return {
    messages,
    sendMessage: wsClient.send.bind(wsClient)
  }
}
