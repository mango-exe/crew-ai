'use client'
import React, { useState, useEffect } from 'react'
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

import ModelsDialog from './models-dialog'

import { signOut } from 'next-auth/react'
import { useConversationStore } from '@/lib/stores/conversation-store'
import { useLLMStore } from '@/lib/stores/llms-store'
import { useRouter } from 'next/navigation'

export default function ChatSidebar () {
  const [isModelsDialogOpen, setIsModelsDialogOpen] = useState(false)
  const { open } = useSidebar()
  const router = useRouter()

  const { conversationAlias, conversations, count, getConversations, selectConversation, newConversation } = useConversationStore(state => state)
  const { getLLMSPreferences } = useLLMStore(state => state)

  const sidebarActionsModel = [
    {
      title: 'New Conversation',
      icon: Plus,
      action: () => {
        newConversation()
        router.push('/chat')
      }
    },
    {
      title: 'Models',
      icon: Brain,
      action: () => {
        setIsModelsDialogOpen(true)
      }
    }
  ]

  const handleSelectChat = (conversationAlias: string) => {
    selectConversation()
    router.push(`/chat/${conversationAlias}`)
  }

  useEffect(() => {
    getConversations()
    getLLMSPreferences()
  }, [])

  return (
    <>
      <Sidebar
        collapsible='icon'
        className='glass-surface rounded-3xl shadow-lg h-[90%] top-15 left-1'
      >
        <SidebarContent className='bg-transparent'>
          <SidebarGroup>
            <SidebarGroupLabel className='text-white/80 text-xl'>CrewAI</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {sidebarActionsModel.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      onClick={() => item.action()}
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
                      {conversations?.length > 0 && conversations.map((chat) => {
                        const isSelected = conversationAlias === chat.alias

                        return (
                          <div key={chat.id}>
                            <div
                              className={`
                              flex items-center gap-2 w-full p-3 rounded-3xl cursor-pointer
                              transition-colors duration-200
                              ${isSelected ? 'bg-white/20 text-white' : 'text-white/80 hover:bg-white/10 hover:text-white'}
                            `}
                              onClick={() => handleSelectChat(chat.alias)}
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
      {isModelsDialogOpen && <ModelsDialog isVisible={isModelsDialogOpen} onClose={() => setIsModelsDialogOpen(false)} />}
    </>
  )
}
