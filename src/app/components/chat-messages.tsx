'use client'
import React, { useEffect } from 'react'
import { PopulatedChat, NewChat } from '@/lib/types/schema/chat.types'
import { useConversationStore } from '@/lib/stores/conversation-store'
import { User } from 'lucide-react'
import { useWebSocket } from '@/hooks/useWebSocket'
import { useSession } from 'next-auth/react'
import { useRouter, useParams } from 'next/navigation'

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/app/components/ui/avatar"


export default function ChatMessages () {
  const { data: session } = useSession()
  const router = useRouter()
  const params = useParams<{ conversationAlias: string }>()

  const urlConversationAlias = params.conversationAlias

  const userEmail = session?.user?.email || null

  const { message } = useWebSocket(userEmail)

  const { chats, conversationAlias, getConversation, addChatToConversation, getConversations } = useConversationStore(state => state)

  useEffect(() => {
    if (urlConversationAlias) {
      getConversation(urlConversationAlias)
    }
  }, [urlConversationAlias])

  useEffect(() => {
    if (message != null) {
      if (message.conversationAlias) {
        router.push(`/chat/${message.conversationAlias}`)
        getConversations()
      }
      addChatToConversation(message.chat)
    }
  }, [message])

  const removeModelNameFromChatText = (chatText: string): string => {
    return chatText.replace(/<[^>]+>:\s*/, '')
  }

  const messageTemplate = (message: any) => {
    let isUserMessage = false
    let isAIMessage = false

    // Type guard for user message
    if (message.fromUser && message.fromUser.email !== null) {
      isUserMessage = true
    } else if (message.fromModel) {
      isAIMessage = true
    }

    return (
      <div className={`flex items-end gap-2 ${isUserMessage ? 'justify-end' : 'justify-start'}`}>
        {isAIMessage &&
          <Avatar>
            <AvatarImage src={`/${message.fromModel.modelName}.svg` } />
          </Avatar>
        }

        <div className='flex flex-col'>
          <div
            className={`max-w-[70%] px-4 py-2 rounded-2xl text-white break-words shadow-md ${
              isUserMessage ? 'bg-yellow-200 rounded-br-none' : 'bg-blue-500 rounded-bl-none'
            }`}
          >
            {removeModelNameFromChatText(message.textContent)}
          </div>

          {isAIMessage && (
            <div className='mt-1 text-xs text-gray-300'>
              {message.fromModel.llm.name} - {message.fromModel.modelName}
            </div>
          )}
        </div>

        {isUserMessage &&
          <Avatar>
            <AvatarImage src='/user.svg' className='h-8 w-8 rounded-full' />
          </Avatar>
        }
      </div>
    )
  }

  // <User className='h-8 w-8 rounded-full' />

  return (
    <div className='h-[94vh] w-full p-4 flex flex-col gap-3 overflow-y-auto'>
      {chats.map(messageTemplate)}
    </div>
  )
}
