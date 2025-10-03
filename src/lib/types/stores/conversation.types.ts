import { Chat, NewChat, PopulatedChat, NewAiChatWithAnimation } from '@/lib/types/schema/chat.types'
import { Conversation } from '@/lib/types/schema/conversation.types'

type ChatItems = PopulatedChat | NewChat

export interface ConversationState {
  conversationAlias: string | null
  chats: ChatItems[]
  conversations: Conversation[]
  count: number
  isExistingConversation: boolean | null
  fetching: boolean
  fetched: boolean
  error: string | null
}

export interface ConversationActions {
  getConversations: () => void
  getConversation: (conversationId: string) => void
  selectConversation: () => void
  deleteConversation: (conversationId: string) => void
  addAiChatToConversation: (chat: NewAiChatWithAnimation) => void,
  addPopulatedChatToConversation: (chat: PopulatedChat) => void,
  addUserChatToConversation: (chat: NewChat) => void,
  newConversation: () => void,
  removeMessageAnimation: () => void
  setConversationAlias: (conversationAlias: string) => void
}

export type ConversationStore = ConversationState & ConversationActions
