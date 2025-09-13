import { Chat, NewConversationChat, NewChat, PopulatedChat } from '@/lib/types/schema/chat.types'
import { Conversation } from '@/lib/types/schema/conversation.types'

export interface ConversationState {
  conversationAlias: string | null
  chats: PopulatedChat[]
  conversations: Conversation[]
  count: number,
  fetching: boolean
  fetched: boolean
  error: string | null
}

export interface ConversationActions {
  getConversations: () => void
  getConversation: (conversationId: string) => void
  selectConversation: (conversationAlias: string) => void
  deleteConversation: (conversationId: string) => void
}

export type ConversationStore = ConversationState & ConversationActions
