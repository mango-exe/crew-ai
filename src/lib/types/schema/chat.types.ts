import { chats } from '@/lib/db/schema/chat'

export type Chat = typeof chats.$inferSelect
export type NewChat = Omit<typeof chats.$inferInsert, 'conversationId' | 'id'>

export interface PopulatedChat {
  id: number
  textContent: string | null
  timestamp: Date
  fromUser: { id: number | null, email: string | null } | null
  fromModel: {
    id: number | null
    modelName: string | null
    isMultiModal: boolean | null
    llm: { id: number | null, name: string | null }
  } | null
  toUser: { id: number | null, email: string | null } | null
  toModel: {
    id: number | null
    modelName: string | null
    isMultiModal: boolean | null
    llm: { id: number | null, name: string | null }
  } | null
  conversationId: number | null
}
