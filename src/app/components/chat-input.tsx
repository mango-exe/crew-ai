'use client'

import React, { useRef, useEffect } from 'react'
import { Button } from '@/app/components/ui/button'
import { Send } from 'lucide-react'
import { useConversationStore } from '@/lib/stores/conversation-store'
import { NewConversationChat } from '@/lib/types/schema/chat.types'
import { useWebSocket } from '@/hooks/useWebSocket'
import { useSession } from 'next-auth/react'

export default function ChatInput () {
  const { data: session } = useSession()

  const userEmail = session?.user?.email || null

  const { messages, sendMessage } = useWebSocket(userEmail)

  useEffect(() => {
    console.warn(messages)
  }, [messages])

  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const { conversationId, createConversation } = useConversationStore(state => state)

  const handleInput = () => {
    const textarea = textareaRef.current
    if (textarea != null) {
      textarea.style.height = '2em' // reset to initial height
      textarea.style.height = textarea.scrollHeight + 'px' // expand to fit content
    }
  }

  const handleSendChat = () => {
    const conversationId = 'f60840e2-1c7d-48b3-90a9-a7a15bfde82e'
    if (!conversationId) {
      const chat: NewConversationChat = {
        fromUser: 1,
        fromModel: null,
        toUser: null,
        toModel: 2,
        textContent: textareaRef.current?.value,
        timestamp: new Date()
      }
      sendMessage({ chat }, 'NEW_CONVERSATION')
    } else {
      const chat: NewConversationChat = {
        fromUser: 1,
        fromModel: null,
        toUser: null,
        toModel: 2,
        textContent: textareaRef.current?.value,
        timestamp: new Date()
      }
      sendMessage({ chat, conversationAlias: 'f60840e2-1c7d-48b3-90a9-a7a15bfde82e' }, 'NEW_CHAT')
    }
  }

  return (
    <div className='w-[60%] glass-surface flex items-center gap-2 rounded-3xl p-2 shadow-md z-10'>
      <textarea
        ref={textareaRef}
        placeholder='Ask the crew...'
        className='w-full pt-1 text-xl rounded bg-transparent focus:outline-none focus:ring-0 resize-none overflow-hidden'
        style={{ height: '2em' }} // initial height
        onInput={handleInput}
      />
      <Button
        size='icon'
        className='rounded-3xl flex items-center justify-center'
        onClick={() => handleSendChat()}
      >
        <Send className='h-5 w-5' />
      </Button>
    </div>
  )
}
