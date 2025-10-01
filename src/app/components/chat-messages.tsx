'use client'
import React, { useEffect } from 'react'

import * as motion from 'motion/react-client'

import { NewAiChatWithAnimation } from '@/lib/types/schema/chat.types'
import { useConversationStore } from '@/lib/stores/conversation-store'
import { useWebSocket } from '@/hooks/useWebSocket'
import { useSession } from 'next-auth/react'
import { useRouter, useParams } from 'next/navigation'

import { User } from 'lucide-react'

import {
  Avatar,
  AvatarImage,
} from "@/app/components/ui/avatar"

import AICompletion from './ai-completion'

export default function ChatMessages () {
  const { data: session } = useSession()
  const router = useRouter()
  const params = useParams<{ conversationAlias: string }>()

  const urlConversationAlias = params.conversationAlias

  const userEmail = session?.user?.email || null

  const { message } = useWebSocket(userEmail)

  const { chats, getConversation, addAiChatToConversation, getConversations, isExistingConversation, removeMessageAnimation } = useConversationStore(state => state)


  useEffect(() => {
    if (urlConversationAlias && (isExistingConversation || isExistingConversation === null)) {
      getConversation(urlConversationAlias as string)
    }
  }, [urlConversationAlias])

  useEffect(() => {
    if (message != null) {
      if (message.conversationAlias) {
        router.push(`/chat/${message.conversationAlias}`)
        getConversations()
      }

      const newAiChat: NewAiChatWithAnimation = {
        ...message.chat,
        animated: true
      }
      addAiChatToConversation(newAiChat)
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

    const onAnimationEnd = () => {
      removeMessageAnimation()
    }

    return (
      <div className={`flex items-end gap-2 ${isUserMessage ? 'justify-end' : 'justify-start'}`}>
        {isAIMessage &&
          <Avatar>
            <AvatarImage src={`/${message.fromModel.llm.name}.svg` } className='p-1' />
          </Avatar>
        }

        <div className='flex flex-col'>
          <div
            className={`px-4 py-2 rounded-2xl text-white break-words shadow-md ${
              isUserMessage ? 'bg-purple-800 rounded-br-none' : 'bg-blue-500 rounded-bl-none'
            }`}
          >
            {message?.animated ? <AICompletion text={removeModelNameFromChatText(message.textContent)} speed={10} onAnimationEnd={onAnimationEnd} /> : removeModelNameFromChatText(message.textContent)}
          </div>

          {isAIMessage && (
            <div className='mt-1 text-xs text-gray-300'>
              {message.fromModel.llm.name} - {message.fromModel.modelName}
            </div>
          )}
        </div>

        {isUserMessage &&
          <Avatar className='flex items-center justify-center rounded-full'>
            <User />
          </Avatar>
        }
      </div>
    )
  }

  return (
    <div className='h-[94vh] w-full p-4 flex flex-col gap-3 overflow-y-auto'>
      {urlConversationAlias && chats.map(messageTemplate)}
      {!urlConversationAlias && !(chats.length > 0) &&
      <div className='flex items-center justify-center h-[94vh] w-full p-4'>
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', damping: 20, stiffness: 120, duration: 0.8, delay: 0.3 }}
          className='mb-8 max-w-3xl text-lg leading-relaxed '
        >
          <div className='text-2xl'>
            The Crew is Ready when you are Ready!
          </div>
        </motion.section>
      </div>}
    </div>
  )
}
