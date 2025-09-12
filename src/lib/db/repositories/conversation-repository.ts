// repositories/conversationRepository.ts
import { and, eq, sql } from 'drizzle-orm'
import { alias } from 'drizzle-orm/mysql-core'

import { dbConnection, DBConnection } from '@/lib/db'
import { conversations } from '@/lib/db/schema/conversation'
import { users } from '@/lib/db/schema/user'
import { llmModels } from '@/lib/db/schema/llm-model'
import { llms } from '@/lib/db/schema/llm'
import { chats } from '@/lib/db/schema/chat'

import { NewConversation, Conversation, ConversationWithChats } from '@/lib/types/schema/conversation.types'

export class ConversationRepository {
  constructor (private readonly connection: DBConnection = dbConnection) {}

  async getUserPopulatedConversation (
    userId: number,
    conversationAlias: string
  ): Promise<ConversationWithChats | null> {
    const fromUserAlias = alias(users, 'fromUser')
    const toUserAlias = alias(users, 'toUser')
    const fromModelAlias = alias(llmModels, 'fromModel')
    const toModelAlias = alias(llmModels, 'toModel')
    const fromLLMAlias = alias(llms, 'fromLLM')
    const toLLMAlias = alias(llms, 'toLLM')

    const rows = await this.connection.client
      .select({
        conversationId: conversations.id,
        conversationUserId: conversations.userId,
        description: conversations.description,
        alias: conversations.alias,

        chatId: chats.id,
        textContent: chats.textContent,
        timestamp: chats.timestamp,

        fromUserId: chats.fromUser,
        fromUserEmail: fromUserAlias.email,

        fromModelId: chats.fromModel,
        fromModelName: fromModelAlias.modelName,
        fromModelIsMultiModal: fromModelAlias.isMultiModal,
        fromModelLLMId: fromModelAlias.llmId,
        fromModelLLMName: fromLLMAlias.name,

        toUserId: chats.toUser,
        toUserEmail: toUserAlias.email,

        toModelId: chats.toModel,
        toModelName: toModelAlias.modelName,
        toModelIsMultiModal: toModelAlias.isMultiModal,
        toModelLLMId: toModelAlias.llmId,
        toModelLLMName: toLLMAlias.name
      })
      .from(conversations)
      .innerJoin(chats, eq(chats.conversationId, conversations.id))
      .leftJoin(fromUserAlias, eq(fromUserAlias.id, chats.fromUser))
      .leftJoin(toUserAlias, eq(toUserAlias.id, chats.toUser))
      .leftJoin(fromModelAlias, eq(fromModelAlias.id, chats.fromModel))
      .leftJoin(toModelAlias, eq(toModelAlias.id, chats.toModel))
      .leftJoin(fromLLMAlias, eq(fromModelAlias.llmId, fromLLMAlias.id))
      .leftJoin(toLLMAlias, eq(toModelAlias.llmId, toLLMAlias.id))
      .where(
        and(
          eq(conversations.alias, conversationAlias),
          eq(conversations.userId, userId)
        )
      )
      .orderBy(chats.timestamp)

    if (rows.length === 0) return null

    return {
      id: rows[0].conversationId,
      userId: rows[0].conversationUserId,
      description: rows[0].description,
      alias: rows[0].alias,
      chats: rows.map(r => ({
        id: r.chatId,
        textContent: r.textContent,
        timestamp: r.timestamp,
        fromUser: r.fromUserId
          ? { id: r.fromUserId, email: r.fromUserEmail }
          : null,
        fromModel: r.fromModelId
          ? {
              id: r.fromModelId,
              name: r.fromModelName,
              isMultiModal: r.fromModelIsMultiModal,
              llm: { id: r.fromModelLLMId, name: r.fromModelLLMName }
            }
          : null,
        toUser: r.toUserId
          ? { id: r.toUserId, email: r.toUserEmail }
          : null,
        toModel: r.toModelId
          ? {
              id: r.toModelId,
              name: r.toModelName,
              isMultiModal: r.toModelIsMultiModal,
              llm: { id: r.toModelLLMId, name: r.toModelLLMName }
            }
          : null
      }))
    }
  }

  async getUserConversationByAlias (userId: number, conversationAlias: string): Promise<Conversation | null> {
    const [conversation] = await this.connection.client
      .select()
      .from(conversations)
      .where(
        and(
          eq(conversations.userId, userId),
          eq(conversations.alias, conversationAlias)
        )
      )
    return conversation
  }

  async getUserConversations (userId: number, offset = 0, limit = 10): Promise<{ conversations: Conversation[], count: number }> {
    const result = await this.connection.client
      .select()
      .from(conversations)
      .where(eq(conversations.userId, userId))
      .limit(limit)
      .offset(offset)

    const [countResult] = await this.connection.client
      .select({ count: sql<number>`COUNT(*)` })
      .from(conversations)
      .where(eq(conversations.userId, userId))

    return { conversations: result, count: countResult.count }
  }

  async createConversation (conversation: NewConversation): Promise<Conversation> {
    const [inserted] = await this.connection.client.insert(conversations).values(conversation).$returningId()
    const [newConversation] = await this.connection.client.select().from(conversations).where(eq(conversations.id, inserted.id))
    return newConversation
  }

  async deleteConversation (userId: number, conversationAlias: string): Promise<void> {
    await this.connection.client.delete(conversations).where(
      and(
        eq(conversations.alias, conversationAlias),
        eq(conversations.userId, userId)
      )
    )
  }
}
