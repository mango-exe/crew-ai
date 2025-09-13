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


  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const { conversationAlias } = useConversationStore(state => state)

  const handleInput = () => {
    const textarea = textareaRef.current
    if (textarea != null) {
      textarea.style.height = '2em' // reset to initial height
      textarea.style.height = textarea.scrollHeight + 'px' // expand to fit content
    }
  }

  const handleSendChat = () => {
    if (!conversationAlias) {
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
      sendMessage({ chat, conversationAlias }, 'NEW_CHAT_IN_CONVERSATION')
    }
  }

  return (
    <div className='w-[60%] glass-surface flex items-center gap-2 rounded-3xl p-2 shadow-md z-10'>
      <textarea
        ref={textareaRef}
        placeholder='Ask the crew...'
        className='w-full pt-1 text-xl rounded bg-transparent focus:outline-none focus:ring-0 resize-none overflow-hidden'
        style={{ height: '2em' }}
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
