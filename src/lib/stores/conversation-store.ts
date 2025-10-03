import { createStore, StoreApi, useStore } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { ConversationState, ConversationStore } from '@/lib/types/stores/conversation.types'
import { getConversations, getConversation, deleteConversation, selectConversation, newConversation, removeMessageAnimation, addAiChatToConversation, addPopulatedChatToConversation, addUserChatToConversation, setConversationAlias } from '@/lib/stores/actions/conversation-actions'

export const initialState: ConversationState = {
  conversationAlias: null,
  conversations: [],
  isExistingConversation: null,
  count: 0,
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
      ...addAiChatToConversation(...args),
      ...addPopulatedChatToConversation(...args),
      ...addUserChatToConversation(...args),
      ...selectConversation(...args),
      ...deleteConversation(...args),
      ...newConversation(...args),
      ...removeMessageAnimation(...args),
      ...setConversationAlias(...args)
    }))
  )
}

export const conversationStore = createConversationStore()
export function useConversationStore<T> (selector: (state: ConversationStore) => T): T {
  return useStore(conversationStore, selector)
}
