// server.ts
import 'reflect-metadata'
import { createServer } from 'http'
import next from 'next'
import { WebSocketServer, WebSocket } from 'ws'
import cookie from 'cookie'
import { getToken } from 'next-auth/jwt'
import { handleNewChatMessage, handleNewConversation } from './handlers/conversation-handler.js'
import dotenv from 'dotenv'

dotenv.config()

type CustomWebSocket = WebSocket & {
  userEmail?: string | null
}

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()
const port = 3001

app.prepare().then(() => {
  const server = createServer((req, res) => {
    handle(req, res)
  })

  const wss = new WebSocketServer({ noServer: true })

  server.on('upgrade', (request, socket, head) => {
    if (request.url === '/_next/webpack-hmr') {
      return
    }

    wss.handleUpgrade(request, socket, head, (ws) => {
      wss.emit('connection', ws, request)
    })
  })

  wss.on('connection', async (ws: CustomWebSocket, req) => {
    const cookies = cookie.parse(req.headers.cookie || '')
    const token = cookies['next-auth.session-token'] || cookies['__Secure-next-auth.session-token']

    const fakeReq = {
      cookies: {
        'next-auth.session-token': token
      }
    } as any

    if (!token) {
      ws.close(4001, 'Unauthorized')
      return
    }

    let decodedToken
    try {
      decodedToken = await getToken({ req: fakeReq, secret: process.env.NEXTAUTH_SECRET })
      ws.userEmail = decodedToken?.email
    } catch (e) {
      console.warn(e)
      ws.close(4001, 'Unauthorized')
      return
    }

    ws.on('message', async (data: string) => {
      const { message, type } = JSON.parse(data)

      switch (type) {
        case 'NEW_CONVERSATION': {
          const { chat, conversationAlias } = await handleNewConversation(ws.userEmail as string, message.chat)
          ws.send(JSON.stringify({ chat, conversationAlias }))
          break
        }
        case 'NEW_CHAT_IN_CONVERSATION': {
          const chat = await handleNewChatMessage(ws.userEmail as string, message.conversationAlias, message.chat)
          ws.send(JSON.stringify(chat))
          break
        }
      }
    })

    ws.on('close', () => {
      console.warn('Client disconnected')
    })
  })

  server.listen(port, () => {
    console.log(`> WebSocket server ready on http://localhost:${port}`)
  })
})
