import { StateCreator } from 'zustand'
import { ConversationStore } from '@/lib/types/stores/conversation.types'
import { NewChat, PopulatedChat } from '@/lib/types/schema/chat.types'
import { SERVER } from '@/lib/global/config'
import axios from 'axios'

export const getConversations: StateCreator<ConversationStore, [], [], { getConversations: () => Promise<void> }> = (set, get) => ({
  getConversations: async () => {
    set({ fetching: true })
    try {
      const response = await axios.get(`${SERVER}/api/conversations`)
      const { conversations, count } = response.data

      set({ conversations, count, fetched: true })
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

      set({ chats: conversation.chats })
    } catch (err: unknown) {
      if (err instanceof Error) {
        set({ error: err.message, fetching: false })
      } else {
        set({ error: 'An unknown error occurred', fetching: false })
      }
    }
  }
})

export const selectConversation: StateCreator<ConversationStore, [], [], { selectConversation: (conversationAlias: string) => void }> = (set, get) => ({
  selectConversation: async (conversationAlias: string) => {
    set({ conversationAlias })
  }
})

export const addChatToConversation: StateCreator<ConversationStore, [], [], { addChatToConversation: (chat: PopulatedChat | NewChat) => void }> = (set, get) => ({
  addChatToConversation: (chat: PopulatedChat | NewChat) => {
    set({ chats: [...get().chats, chat] })
  }
})

export const newConversation: StateCreator<ConversationStore, [], [], { newConversation: () => void }> = (set, get) => ({
  newConversation: () => {
    set({ chats: [], conversationAlias: null })
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
