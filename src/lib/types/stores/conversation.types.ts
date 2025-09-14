import { Chat, NewChat, PopulatedChat } from '@/lib/types/schema/chat.types'
import { Conversation } from '@/lib/types/schema/conversation.types'

type ChatItems = PopulatedChat | NewChat

export interface ConversationState {
  conversationAlias: string | null
  chats: ChatItems[]
  conversations: Conversation[]
  count: number
  fetching: boolean
  fetched: boolean
  error: string | null
}

export interface ConversationActions {
  getConversations: () => void
  getConversation: (conversationId: string) => void
  selectConversation: (conversationAlias: string) => void
  deleteConversation: (conversationId: string) => void
  addChatToConversation: (chat: PopulatedChat | NewChat) => void
  newConversation: () => void
}

export type ConversationStore = ConversationState & ConversationActions
