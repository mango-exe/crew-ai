import { Chat, NewConversationChat, NewChat } from '@/lib/types/schema/chat.types'
import { Conversation } from '@/lib/types/schema/conversation.types'

export interface ConversationState {
  conversationId: string | null
  chats: Chat[]
  conversations: Conversation[]
  fetching: boolean
  fetched: boolean
  error: string | null
}

export interface ConversationActions {
  getConversations: () => void
  getConversation: (conversationId: string) => void
  createConversation: (chat: NewConversationChat) => void
  chat: (conversationId: string, chat: NewChat) => void
  deleteConversation: (conversationId: string) => void
}

export type ConversationStore = ConversationState & ConversationActions
