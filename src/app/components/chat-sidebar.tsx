import React, { useState } from 'react'
import { Plus, Brain, LogOut } from 'lucide-react'
import {
  SidebarFooter, useSidebar,
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator
} from '@/app/components/ui/sidebar'
import { signOut } from 'next-auth/react'

const items = [
  {
    title: 'New Conversation',
    icon: Plus
  },
  {
    title: 'Models',
    icon: Brain
  }
]

const chats = [
  {
    description: 'chat 1',
    id: '1'
  },
  {
    description: 'chat 2',
    id: '2'
  },
  {
    description: 'chat 3',
    id: '3'
  },
  {
    description: 'chat 4',
    id: '4'
  }
]

export default function ChatSidebar () {
  const { open } = useSidebar()
  const [selectedChatId, setSelectedChatId] = useState()
  return (
    <Sidebar
      collapsible='icon'
      className='glass-surface rounded-3xl shadow-lg h-[90%] top-15 left-1'
    >
      <SidebarContent className='bg-transparent'>
        <SidebarGroup>
          <SidebarGroupLabel className='text-white/80 text-xl'>CrewAI</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    className={`
                        transition-colors duration-200 text-white/80 hover:bg-white/10 hover:text-white rounded-3xl
                      `}
                  >
                    <item.icon />
                    <div className='w-full truncate'>{item.title}</div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
            {open &&
              <div className='pt-1'>
                <SidebarSeparator />
                <div className='m-2'>
                  <div className='mb-2 text-xl'>Conversations</div>
                  <div className='flex flex-col gap-y-1'>
                    {chats.map((chat) => {
                      const isSelected = selectedChatId === chat.id // track selected chat

                      return (
                        <div key={chat.id}>
                          <div
                            className={`
                            flex items-center gap-2 w-full p-3 rounded-3xl cursor-pointer
                            transition-colors duration-200
                            ${isSelected ? 'bg-white/20 text-white' : 'text-white/80 hover:bg-white/10 hover:text-white'}
                          `}
                            onClick={() => setSelectedChatId(chat.id)}
                          >
                            <div className='w-full truncate'>{chat.description}</div>
                          </div>
                        </div>
                      )
                    })}

                  </div>
                </div>
              </div>}
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        {open &&
          <div>
            <SidebarSeparator />
          </div>}
        <SidebarMenuButton
          className={`
                transition-colors duration-200 text-white/80 hover:bg-white/10 hover:text-white rounded-3xl
              `}
        >
          <LogOut />
          <div className='w-full truncate' onClick={async () => await signOut({ callbackUrl: '/' })}>Sign Out</div>
        </SidebarMenuButton>
      </SidebarFooter>
    </Sidebar>
  )
}
