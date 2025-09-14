'use client'

import React, { useRef, useState, useEffect } from 'react'
import { Button } from '@/app/components/ui/button'
import { Send } from 'lucide-react'
import { useConversationStore } from '@/lib/stores/conversation-store'
import { NewChat } from '@/lib/types/schema/chat.types'
import { useWebSocket } from '@/hooks/useWebSocket'
import { useSession } from 'next-auth/react'
import { useLLMStore } from '@/lib/stores/llms-store'
import { llms } from '@/lib/db/schema/llm'

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/app/components/ui/avatar"

// sample users — replace with real data from API/store
// const mockUsers: { id: number; name: string }[] = [
//   { id: 1, name: 'Alice' },
//   { id: 2, name: 'Bob' },
//   { id: 3, name: 'Charlie' }
// ]

export default function ChatInput () {
  const { data: session } = useSession()
  const userEmail = session?.user?.email || null
  const { sendMessage } = useWebSocket(userEmail)

  const { llmsPreferences } = useLLMStore(state => state)

  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const { conversationAlias, addChatToConversation } = useConversationStore(state => state)

  const [llmMetions, setLLMMentions] = useState<{ llmId: number, llmModelId: number,  llmName: string, llmModelName: string }[]>([])
  const [isMentionDetected, setIsMentionDetected] = useState(false)
  const [mentionQuery, setMentionQuery] = useState('')
  const [filteredMentions, setFilteredMentions] = useState(llmMetions)


  useEffect(() => {
    if (!llmsPreferences) return

    const mappedPreferences = llmsPreferences.map(e => ({
      llmId: e.llmModel.id,
      llmModelId: e.llmModel.id,
      llmName: e.llm.name ?? '',
      llmModelName: e.llmModel.modelName ?? ''
    }))

    setLLMMentions(mappedPreferences)
  }, [llmsPreferences])


  const handleInput = () => {
    const textarea = textareaRef.current
    if (!textarea) return

    // auto-grow textarea
    textarea.style.height = '2em'
    textarea.style.height = textarea.scrollHeight + 'px'

    const fullText = textarea.value
    const cursorPos = textarea.selectionStart
    const textBeforeCursor = fullText.slice(0, cursorPos)

    // last "@" before cursor (cursor-aware)
    const lastAtIndex = textBeforeCursor.lastIndexOf('@')

    if (lastAtIndex === -1) {
      // no @ before cursor -> no mention UI
      setIsMentionDetected(false)
      setMentionQuery('')
      setFilteredMentions(llmMetions)
      return
    }

    // count total @ in whole text
    const totalAtCount = (fullText.match(/@/g) || []).length

    // If there is already more than one @ in the text, DO NOT show mention dropdown
    // This enforces the "only one mention in the whole text" rule.
    if (totalAtCount > 1) {
      setIsMentionDetected(false)
      setMentionQuery('')
      setFilteredMentions([])
      return
    }

    // Now totalAtCount === 1 and lastAtIndex !== -1 => we're typing/editing the single allowed mention
    const query = textBeforeCursor.slice(lastAtIndex + 1)

    // stop detecting if space/newline typed after @
    if (query.includes(' ') || query.includes('\n')) {
      setIsMentionDetected(false)
      setMentionQuery('')
      setFilteredMentions([])
      return
    }

    setMentionQuery(query.toLowerCase())

    const matches = llmMetions.filter(u => u.llmName.toLowerCase().includes(query.toLowerCase()))
    setFilteredMentions(matches)
    setIsMentionDetected(true)
  }

  const handleSelectMention = (mention: { llmId: number, llmModelId: number,  llmName: string, llmModelName: string }) => {
    const textarea = textareaRef.current
    if (!textarea) return

    const cursorPos = textarea.selectionStart
    const textBeforeCursor = textarea.value.slice(0, cursorPos)
    const textAfterCursor = textarea.value.slice(cursorPos)

    // replace the @query that is right before the cursor with the chosen username + a trailing space
    const newBefore = textBeforeCursor.replace(/@[\w]*$/, `@${mention.llmName} `)
    const newText = newBefore + textAfterCursor

    textarea.value = newText

    // place caret right after the inserted mention
    const newCursorPos = newBefore.length
    textarea.setSelectionRange(newCursorPos, newCursorPos)
    textarea.focus()

    // reset mention UI (we still have exactly one @ in the text now)
    setIsMentionDetected(false)
    setMentionQuery('')
    setFilteredMentions(llmMetions)

    // adjust height after insertion
    textarea.style.height = '2em'
    textarea.style.height = textarea.scrollHeight + 'px'
  }

  const handleSendChat = () => {
    const textValue = textareaRef.current?.value
    if (!textValue || textValue.trim() === '') return

    const chat: NewChat = {
      fromUser: 1,
      fromModel: null,
      toUser: null,
      toModel: 2,
      textContent: textValue,
      timestamp: new Date()
    }

    if (!conversationAlias) {
      addChatToConversation(chat)
      sendMessage({ chat }, 'NEW_CONVERSATION')
    } else {
      addChatToConversation(chat)
      sendMessage({ chat, conversationAlias }, 'NEW_CHAT_IN_CONVERSATION')
    }

    // clear textarea and reset UI
    if (textareaRef.current) {
      textareaRef.current.value = ''
      textareaRef.current.style.height = '2em'
    }
    setIsMentionDetected(false)
    setMentionQuery('')
    setFilteredMentions(llmMetions)
  }

  const mentionDisplay = {
    openai: 'ChatGPT',
    gemini: 'Gemini',
    mistral: 'Mistral'
  } as const;

  type MentionKeys = keyof typeof mentionDisplay;

  return (
    <div className='relative w-[60%]'>
      {isMentionDetected && filteredMentions.length > 0 && (
        <div className='absolute bottom-16 left-4 glass-surface rounded-lg w-40 z-20 p-2'>
          {filteredMentions.map(mention => (
            <div
              key={mention.llmId}
              className={`
                flex items-center gap-2 w-full p-3 rounded-3xl cursor-pointer
                transition-colors duration-200
                hover:bg-white/10 hover:text-white
              `}
              onClick={() => handleSelectMention(mention)}
            >
              <div className="flex flex-row w-full items-center">
                <span className="font-bold text-blue-500">
                  @{mentionDisplay[mention.llmName as MentionKeys]}
                </span>
                <Avatar className="ml-auto">
                  <AvatarImage src={`/${mention.llmName}.svg`} className="p-1" />
                </Avatar>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className='glass-surface flex items-center gap-2 rounded-3xl p-2 shadow-md z-10'>
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
          onClick={handleSendChat}
        >
          <Send className='h-5 w-5' />
        </Button>
      </div>
    </div>
  )
}
