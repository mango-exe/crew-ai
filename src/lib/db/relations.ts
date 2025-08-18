import { users } from './schema/user'
import { conversations } from './schema/conversation'
import { chats } from './schema/chat'
import { attachments } from './schema/attachment'
import { llms } from './schema/llm'
import { llmModels } from './schema/llm-model'
import { relations } from 'drizzle-orm'

// user has many conversations
export const userRelations = relations(users, ({ many }) => ({
  conversations: many(conversations)
}))

// a conversations has one user
// a conversations has many chats
export const conversationRelations = relations(conversations, ({ one, many }) => ({
  user: one(users, {
    fields: [conversations.userId],
    references: [users.id]
  }),
  chats: many(chats)
}))

// a chat has one conversation
// a chat can have one fromUser
// a chat can have one fromModel
// a chat can have one toUser
// a chat can have toModel
export const chatRelations = relations(chats, ({ one, many }) => ({
  conversation: one(conversations, {
    fields: [chats.conversationId],
    references: [conversations.id]
  }),
  fromUser: one(users, {
    fields: [chats.fromUser],
    references: [users.id]
  }),
  fromModel: one(llmModels, {
    fields: [chats.fromModel],
    references: [llmModels.id]
  }),
  toUser: one(users, {
    fields: [chats.toUser],
    references: [users.id]
  }),
  toModel: one(llmModels, {
    fields: [chats.toModel],
    references: [llmModels.id]
  }),
  attachments: many(attachments)
}))

// a llm has many models
export const llmRelations = relations(llms, ({ many }) => ({
  models: many(llmModels)
}))

// a llmmodel belongs to one llm
export const llmModelRelations = relations(llmModels, ({ one }) => ({
  llm: one(llms, {
    fields: [llmModels.llmId],
    references: [llms.id]
  })
}))

// an attachment belongs to one chat
export const attachmentsRelations = relations(attachments, ({ one }) => ({
  chat: one(chats, {
    fields: [attachments.chatId],
    references: [chats.id]
  })
}))
