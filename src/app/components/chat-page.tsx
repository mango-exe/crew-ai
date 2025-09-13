'use client'
import { withAuth } from '@/app/components/auth-guard'
import { SidebarProvider, SidebarTrigger } from '../components/ui/sidebar'

import ChatInput from '@/app/components/chat-input'
import ChatMessages from '@/app/components/chat-messages'
import ChatSidebar from '../components/chat-sidebar'

function ChatPage() {
  return (
    <div>
      <SidebarProvider>
        <ChatSidebar />
        <main className='flex-1 flex flex-col'>
          <div className='absolute top-4 left-4'>
            <SidebarTrigger className='rounded-3xl' />
          </div>
          <div className='flex flex-col items-center'>
            <ChatMessages />
            <ChatInput />
          </div>
        </main>
      </SidebarProvider>
    </div>
  )
}

export default withAuth(ChatPage)
