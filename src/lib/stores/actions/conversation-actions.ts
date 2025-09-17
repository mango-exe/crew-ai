import { StateCreator } from 'zustand'
import { ConversationStore } from '@/lib/types/stores/conversation.types'
import { NewChat, PopulatedChat, NewAiChatWithAnimation } from '@/lib/types/schema/chat.types'
import { SERVER } from '@/lib/global/config'
import axios from 'axios'
import { loadStaticPaths } from 'next/dist/server/dev/static-paths-worker'

export const getConversations: StateCreator<ConversationStore, [], [], { getConversations: () => Promise<void> }> = (set, get) => ({
  getConversations: async () => {
    set({ fetching: true, fetched: false })
    try {
      const response = await axios.get(`${SERVER}/api/conversations`)
      const { conversations, count } = response.data

      set({ conversations, count, fetched: true, fetching: false })
    } catch (err: unknown) {
      if (err instanceof Error) {
        set({ error: err.message, fetching: false })
      } else {
        set({ error: 'An unknown error occurred', fetching: false })
      }
    }
  }
})

export const getConversation: StateCreator<ConversationStore, [], [], { getConversation: (conversationAlias: string) => Promise<void> }> = (set, get) => ({
  getConversation: async (conversationAlias: string) => {
    set({ fetching: true })
    try {
      const response = await axios.get(`${SERVER}/api/conversations/${conversationAlias}`)
      const { conversation } = response.data

      set({ conversationAlias: conversationAlias, chats: conversation.chats, fetching: false })
    } catch (err: unknown) {
      if (err instanceof Error) {
        set({ error: err.message, fetching: false })
      } else {
        set({ error: 'An unknown error occurred', fetching: false })
      }
    }
  }
})

export const selectConversation: StateCreator<ConversationStore, [], [], { selectConversation: () => void }> = (set, get) => ({
  selectConversation: async () => {
    set({ isExistingConversation: true })
  }
})

export const addPopulatedChatToConversation: StateCreator<ConversationStore, [], [], { addPopulatedChatToConversation: (chat: PopulatedChat) => void }> = (set, get) => ({
  addPopulatedChatToConversation: (chat: PopulatedChat) => {
    set({ chats: [...get().chats, chat]  })
  }
})

export const addAiChatToConversation: StateCreator<ConversationStore, [], [], { addAiChatToConversation: (chat:  NewAiChatWithAnimation) => void }> = (set, get) => ({
  addAiChatToConversation: (chat: NewAiChatWithAnimation) => {
    set({ chats: [...get().chats, chat], fetching: false  })
  }
})

export const addUserChatToConversation: StateCreator<ConversationStore, [], [], { addUserChatToConversation: (chat:  NewChat) => void }> = (set, get) => ({
  addUserChatToConversation: (chat: NewChat) => {
    set({ chats: [...get().chats, chat], fetching: true })
  }
})

export const removeMessageAnimation: StateCreator<ConversationStore, [], [], { removeMessageAnimation: () => void }> = (set, get) => ({
  removeMessageAnimation: () => {
    const chats = get().chats
    const lastAiChat = chats[chats.length - 1]
    if (lastAiChat && 'animated' in lastAiChat) {
      delete lastAiChat.animated
    }
    chats[chats.length - 1] = lastAiChat

    set({ chats})
  }
})

export const newConversation: StateCreator<ConversationStore, [], [], { newConversation: () => void }> = (set, get) => ({
  newConversation: () => {
    set({ chats: [], conversationAlias: null, isExistingConversation: false })
  }
})

export const deleteConversation: StateCreator<ConversationStore, [], [], { deleteConversation: (conversationId: string) => Promise<void> }> = (set, get) => ({
  deleteConversation: async (conversationId: string) => {
    set({ fetching: true })
    try {
      // TODO: Implment api call

    } catch (err: unknown) {
      if (err instanceof Error) {
        set({ error: err.message, fetching: false })
      } else {
        set({ error: 'An unknown error occurred', fetching: false })
      }
    }
  }
})

// export const createConversation: StateCreator<ConversationStore, [], [], { createConversation: (chat: NewConversationChat) => Promise<void> }> = (set, get) => ({
//   createConversation: async (chat: NewConversationChat) => {
//     set({ fetching: true })
//     try {
//       const response = await axios.post(`${SERVER}/api/conversations`, { chat })
//       set({ conversationId: response.data.conversationId })
//     } catch (err: unknown) {
//       if (err instanceof Error) {
//         set({ error: err.message, fetching: false })
//       } else {
//         set({ error: 'An unknown error occurred', fetching: false })
//       }
//     }
//   }
// })

// export const chat: StateCreator<ConversationStore, [], [], { chat: (conversationId: string, chat: NewChat) => Promise<void> }> = (set, get) => ({
//   chat: async (conversationId: string, chat: NewChat) => {
//     set({ fetching: true })
//     try {
//       // TODO: Implment api call

//     } catch (err: unknown) {
//       if (err instanceof Error) {
//         set({ error: err.message, fetching: false })
//       } else {
//         set({ error: 'An unknown error occurred', fetching: false })
//       }
//     }
//   }
// })
