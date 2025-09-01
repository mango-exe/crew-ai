'use client'

import React, { useRef } from 'react'
import { Button } from '@/app/components/ui/button'
import { Send } from 'lucide-react'

export default function ChatInput () {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleInput = () => {
    const textarea = textareaRef.current
    if (textarea != null) {
      textarea.style.height = '2em' // reset to initial height
      textarea.style.height = textarea.scrollHeight + 'px' // expand to fit content
    }
  }

  return (
    <div className='w-[60%] glass-surface flex items-center gap-2 rounded-3xl p-2 shadow-md'>
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
      >
        <Send className='h-5 w-5' />
      </Button>
    </div>
  )
}
