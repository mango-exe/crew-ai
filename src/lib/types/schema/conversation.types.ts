import { conversations } from '@/lib/db/schema/conversation'
import { PopulatedChat } from '@/lib/types/schema/chat.types'

export type Conversation = typeof conversations.$inferSelect
export type NewConversation = typeof conversations.$inferInsert

export type ConversationWithChats = Omit<Conversation, 'enabled'> & {
  chats: PopulatedChat[]
}
