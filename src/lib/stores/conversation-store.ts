import { createStore, StoreApi, useStore } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { ConversationState, ConversationStore } from '@/lib/types/stores/conversation.types'
import { getConversations, getConversation, createConversation, chat, deleteConversation } from '@/lib/stores/actions/conversation-actions'

export const initialState: ConversationState = {
  conversationId: null,
  conversations: [],
  chats: [],
  fetching: false,
  fetched: false,
  error: null
}

export const createConversationStore = (
  initState: ConversationState = initialState
): StoreApi<ConversationStore> => {
  return createStore<ConversationStore, [['zustand/immer', never]]>(
    immer((...args) => ({
      ...initState,
      ...getConversation(...args),
      ...getConversations(...args),
      ...createConversation(...args),
      ...chat(...args),
      ...deleteConversation(...args)
    }))
  )
}

export const conversationStore = createConversationStore()
export function useConversationStore<T> (selector: (state: ConversationStore) => T): T {
  return useStore(conversationStore, selector)
}
