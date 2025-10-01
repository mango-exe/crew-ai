'use client'

import React, { useRef, useState, useEffect } from 'react'
import { Button } from '@/app/components/ui/button'
import { Send } from 'lucide-react'
import { useConversationStore } from '@/lib/stores/conversation-store'
import { NewChat } from '@/lib/types/schema/chat.types'
import { useWebSocket } from '@/hooks/useWebSocket'
import { useSession } from 'next-auth/react'
import { useLLMStore } from '@/lib/stores/llms-store'

import { Spinner } from '@/app/components/ui/shadcn-io/spinner'

import { Avatar, AvatarImage } from "@/app/components/ui/avatar"

export default function ChatInput() {
  const { data: session } = useSession()
  const userEmail = session?.user?.email || null
  const { sendMessage } = useWebSocket(userEmail)
  const { llmsPreferences } = useLLMStore(state => state)
  const { conversationAlias, addUserChatToConversation, fetching } = useConversationStore(state => state)

  const editorRef = useRef<HTMLDivElement>(null)
  const [llmMetions, setLLMMentions] = useState<{ llmId: number, llmModelId: number, llmName: string, llmModelName: string }[]>([])
  const [isMentionDetected, setIsMentionDetected] = useState(false)
  const [mentionQuery, setMentionQuery] = useState('')
  const [filteredMentions, setFilteredMentions] = useState(llmMetions)
  const [selectedMention, setSelectedMention] = useState<{
    llmId: number, llmModelId: number, llmName: string, llmModelName: string
  } | null>(null)

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

  const mentionDisplay = {
    openai: 'ChatGPT',
    gemini: 'Gemini',
    mistral: 'Mistral'
  } as const

  type MentionKeys = keyof typeof mentionDisplay

  const handleInput = () => {
    const editor = editorRef.current
    if (!editor) return

    const text = editor.innerText
    const cursorPos = window.getSelection()?.anchorOffset || 0
    const textBeforeCursor = text.slice(0, cursorPos)

    if (text.trim() === '') {
      setSelectedMention(null)
    }

    normalizeEditor()

    if (selectedMention) {
      setIsMentionDetected(false)
      setFilteredMentions([])
      return
    }


    if (!text.startsWith('@') || text.includes('@', 1)) {
      setIsMentionDetected(false)
      setFilteredMentions([])
      return
    }

    const query = textBeforeCursor.slice(1)
    if ((query.includes(' ') || query.includes('\n'))) {
      setIsMentionDetected(false)
      setFilteredMentions([])
      return
    }


    setMentionQuery(query.toLowerCase())
    const matches = llmMetions.filter(u =>
      u.llmName.toLowerCase().includes(query.toLowerCase())
    )
    setFilteredMentions(matches)
    setIsMentionDetected(true)
  }

  const handleSelectMention = (mention: { llmId: number, llmModelId: number, llmName: string, llmModelName: string }) => {
    const editor = editorRef.current
    if (!editor) return

    const displayName = mentionDisplay[mention.llmName as MentionKeys] || mention.llmName

    editor.innerHTML = `<span class="text-blue-500 font-bold">@${displayName}</span>&nbsp;`

    const range = document.createRange()
    const sel = window.getSelection()
    const lastNode = editor.childNodes[editor.childNodes.length - 1]
    if (lastNode) {
      range.setStart(lastNode, lastNode.textContent?.length ?? 0)
      range.collapse(true)
      sel?.removeAllRanges()
      sel?.addRange(range)
    }

    editor.focus()
    setIsMentionDetected(false)
    setMentionQuery('')
    setFilteredMentions(llmMetions)
    setSelectedMention(mention)
  }


  const handleSendChat = () => {
    const editor = editorRef.current
    if (!editor) return
    const text = editor.innerText.trim()
    if (!text) return

    const defaultModel = llmsPreferences.find(llm => llm.isDefault)

    const chat: NewChat = {
      fromUser: 1,
      fromModel: null,
      toUser: null,
      toModel: selectedMention?.llmModelId || defaultModel?.llmModel.id,
      textContent: text,
      timestamp: new Date()
    }


    if (!conversationAlias) {
      addUserChatToConversation(chat)
      sendMessage({ chat }, 'NEW_CONVERSATION')
    } else {
      addUserChatToConversation(chat)
      sendMessage({ chat, conversationAlias }, 'NEW_CHAT_IN_CONVERSATION')
    }

    editor.innerHTML = ''
    setIsMentionDetected(false)
    setMentionQuery('')
    setFilteredMentions(llmMetions)
    setSelectedMention(null)
  }

  const normalizeEditor = () => {
    const editor = editorRef.current
    if (!editor) return

    const selection = window.getSelection()
    if (!selection || !selection.rangeCount) return
    const preCaretOffset = getCaretCharacterOffsetWithin(editor)

    editor.querySelectorAll('font, b').forEach(el => {
      const textNode = document.createTextNode(el.textContent || '')
      el.replaceWith(textNode)
    })

    setCaretPosition(editor, preCaretOffset)
  }

  function getCaretCharacterOffsetWithin(element: HTMLElement) {
    const selection = window.getSelection()
    let caretOffset = 0
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0)
      const preCaretRange = range.cloneRange()
      preCaretRange.selectNodeContents(element)
      preCaretRange.setEnd(range.endContainer, range.endOffset)
      caretOffset = preCaretRange.toString().length
    }
    return caretOffset
  }

  function setCaretPosition(element: HTMLElement, chars: number) {
    const nodeStack: ChildNode[] = Array.from(element.childNodes)
    let node: ChildNode | undefined
    let charCount = 0

    for (node of nodeStack) {
      const nodeLength = node.textContent?.length ?? 0
      if (charCount + nodeLength >= chars) {
        const range = document.createRange()
        const sel = window.getSelection()
        range.setStart(node, chars - charCount)
        range.collapse(true)
        sel?.removeAllRanges()
        sel?.addRange(range)
        break
      }
      charCount += nodeLength
    }
  }




  return (
    <div className='relative w-[60%]'>
      {isMentionDetected && filteredMentions.length > 0 && (
        <div className='absolute bottom-16 left-4 glass-surface rounded-lg w-40 z-20 p-2'>
          {filteredMentions.map(mention => (
            <div
              key={mention.llmId}
              className='flex items-center gap-2 w-full p-3 rounded-3xl cursor-pointer transition-colors duration-200 hover:bg-white/10 hover:text-white'
              onClick={() => handleSelectMention(mention)}
            >
              <span className='font-bold text-blue-500'>
                @{mentionDisplay[mention.llmName as MentionKeys]}
              </span>
              <Avatar className="ml-auto">
                <AvatarImage src={`/${mention.llmName}.svg`} className="p-1" />
              </Avatar>
            </div>
          ))}
        </div>
      )}

      <div className='glass-surface flex items-center gap-2 rounded-3xl p-2 shadow-md z-10'>
        <div
          ref={editorRef}
          contentEditable
          onInput={handleInput}
          className='w-full pt-1 text-xl rounded bg-transparent focus:outline-none focus:ring-0 resize-none overflow-auto'
          style={{ minHeight: '2em', maxHeight: '8em' }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault()
              handleSendChat()
            }
          }}
        />
        <Button
          size='icon'
          className='rounded-3xl flex items-center justify-center'
          onClick={handleSendChat}
          disabled={fetching}
        >
          {fetching ? <Spinner height={10} width={10} /> : <Send className='h-5 w-5' />}
        </Button>
      </div>
    </div>
  )
}
