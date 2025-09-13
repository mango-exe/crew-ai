'use client'
import React, { useEffect } from 'react'
import { PopulatedChat } from '@/lib/types/schema/chat.types'
import { useConversationStore } from '@/lib/stores/conversation-store'
import { User } from 'lucide-react'
import { useWebSocket } from '@/hooks/useWebSocket'
import { useSession } from 'next-auth/react'

export default function ChatMessages () {
  const { data: session } = useSession()

  const userEmail = session?.user?.email || null

  const { messages } = useWebSocket(userEmail)

  const { chats, conversationAlias, getConversation } = useConversationStore(state => state)

  useEffect(() => {
    if (conversationAlias) {
      getConversation(conversationAlias)
    }
  }, [conversationAlias])


  const messageTemplate = (message: PopulatedChat) => {
    const isUserMessage: boolean = !!message.fromUser
    const isAIMessage: boolean = !!message.fromModel

    return (
      <div
        key={message.id}
        className={`flex items-end gap-2 ${
          isUserMessage ? 'justify-end' : 'justify-start'
        }`}
      >
        {/* AI avatar on left */}
        {isAIMessage && (
          <User className='h-8 w-8 rounded-full' />
        )}

        <div className='flex flex-col'>
          {/* Message bubble */}
          <div
            className={`max-w-[70%] px-4 py-2 rounded-2xl text-white break-words shadow-md ${
              isUserMessage
                ? `bg-yellow-200 rounded-br-none`
                : `bg-blue-500 rounded-bl-none`
            }`}
          >
            {message.textContent}
          </div>

          {/* AI model info below the bubble */}
          {isAIMessage && (
            <div className='mt-1 text-xs text-gray-300'>
              {message.fromModel?.llm.name} - {message.fromModel?.name}
            </div>
          )}
        </div>

        {/* User avatar on right */}
        {isUserMessage && (
          <User className='h-8 w-8 rounded-full' />
        )}
      </div>
    )

  }

  return (
    <div className='h-[94vh] w-full p-4 flex flex-col gap-3 overflow-y-auto'>
      {chats.map(messageTemplate)}
    </div>
  )
}
