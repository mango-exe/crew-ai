type WSMessage =
  | { type: 'NEW_CONVERSATION_SUCCESS', conversationId: string, chat: any }
  | { type: 'NEW_CHAT_SUCCESS', chat: any }
  | { type: 'ERROR', message: string }
  | { type: string, [key: string]: any }

type Listener = (msg: WSMessage) => void

type MessageType = 'NEW_CONVERSATION' | 'NEW_CHAT' | 'ERROR'

class WebSocketClient {
  private static instance: WebSocketClient
  private ws: WebSocket | null = null
  private listeners: Listener[] = []

  private constructor () {}

  static getInstance (): WebSocketClient {
    if (!WebSocketClient.instance) {
      WebSocketClient.instance = new WebSocketClient()
    }
    return WebSocketClient.instance
  }

  connect (userEmail: string) {
    if ((this.ws != null) && this.ws.readyState === WebSocket.OPEN) return

    this.ws = new WebSocket('ws://localhost:3001') // adjust for prod
    this.ws.onopen = () => {
      console.log('✅ WebSocket connected')
    }

    this.ws.onmessage = (event) => {
      try {
        const data: WSMessage = JSON.parse(event.data)
        console.warn(data)
        this.listeners.forEach((l) => l(data))
      } catch (err) {
        console.error('❌ Invalid WS message', err)
      }
    }

    this.ws.onclose = () => {
      console.log('⚠️ WS closed. Reconnecting in 3s...')
      setTimeout(() => this.connect(userEmail), 3000)
    }
  }

  send (message: any, type: MessageType) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ message, type }))
    } else {
      console.warn('⚠️ WebSocket not ready')
    }
  }

  subscribe (listener: Listener) {
    this.listeners.push(listener)
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener)
    }
  }
}

export const wsClient = WebSocketClient.getInstance()
