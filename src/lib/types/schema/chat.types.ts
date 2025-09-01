import { chats } from '@/lib/db/schema/chat'

export type Chat = typeof chats.$inferSelect
export type NewChat = typeof chats.$inferInsert

export interface CreateChatBody {
  chat: NewChat
}

export interface PopulatedChat {
  id: number
  textContent: string | null
  timestamp: Date
  fromUser: { id: number, email: string | null } | null
  fromModel: {
    id: number
    name: string | null
    isMultiModal: boolean | null
    llm: { id: number | null, name: string | null }
  } | null
  toUser: { id: number, email: string | null } | null
  toModel: {
    id: number
    name: string | null
    isMultiModal: boolean | null
    llm: { id: number | null, name: string | null }
  } | null
}
