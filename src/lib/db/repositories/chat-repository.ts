import { eq } from 'drizzle-orm'
import { dbConnection, DBConnection } from '@/lib/db'
import { chats } from '@/lib/db/schema/chat'
import { users } from '@/lib/db/schema/user'
import { llms } from '@/lib/db/schema/llm'
import { llmModels } from '../schema/llm-model'
import { Chat, NewChat, PopulatedChat } from '@/lib/types/schema/chat.types'
import { alias } from 'drizzle-orm/mysql-core'

export class ChatRepository {
  constructor (private readonly connection: DBConnection = dbConnection) {}

  async createChat (data: NewChat): Promise<PopulatedChat> {
    const [result] = await this.connection.client
      .insert(chats)
      .values(data)
      .$returningId()

    const fromUserAlias = alias(users, 'fromUser')
    const fromModelAlias = alias(llmModels, 'fromModel')
    const toUserAlias = alias(users, 'toUser')
    const toModelAlias = alias(llmModels, 'toModel')
    const toModelLLMAlias = alias(llms, 'toModelLLM')
    const fromModelLLMAlias = alias(llms, 'fromModelLLM')


    const rows = await this.connection.client
      .select({
        id: chats.id,
        fromUser: chats.fromUser,
        fromModel: chats.fromModel,
        toUser: chats.toUser,
        toModel: chats.toModel,
        textContent: chats.textContent,
        timestamp: chats.timestamp,
        conversationId: chats.conversationId,

        fromUserEmail: fromUserAlias.email,

        toUserEmail: toUserAlias.email,


        fromModelName: fromModelAlias.modelName,
        fromModelIsMultiModal: fromModelAlias.isMultiModal,
        fromModelLLMId: fromModelAlias.llmId,
        fromModelLLMName: fromModelLLMAlias.name,
        fromModelLLMIsDefault: fromModelLLMAlias.isDefault,

        toModelName: toModelAlias.modelName,
        toModelIsMultiModal: toModelAlias.isMultiModal,
        toModelLLMId: toModelAlias.llmId,
        toModelLLMName: toModelLLMAlias.name,
        toModelLLMIsDefault: toModelLLMAlias.isDefault,

      })
      .from(chats)
      .leftJoin(fromUserAlias, eq(chats.fromUser, fromUserAlias.id))
      .leftJoin(fromModelAlias, eq(chats.fromModel, fromModelAlias.id))
      .leftJoin(toUserAlias, eq(chats.toUser, toUserAlias.id))
      .leftJoin(toModelAlias, eq(chats.toModel, toModelAlias.id))
      .leftJoin(toModelLLMAlias, eq(toModelAlias.llmId, toModelLLMAlias.id))
      .leftJoin(fromModelLLMAlias, eq(fromModelAlias.llmId, fromModelLLMAlias.id))
      .where(eq(chats.id, result.id))


    return {
      id: rows[0].id,
      fromUser: {
        id: rows[0].fromUser || null,
        email: rows[0].fromUserEmail
      },
      toUser: {
        id: rows[0].toUser || null,
        email: rows[0].toUserEmail || null
      },
      fromModel: {
        id: rows[0].fromModel,
        modelName: rows[0].fromModelName,
        isMultiModal: rows[0].fromModelIsMultiModal,
        llm: {
          id: rows[0].fromModelLLMId,
          name: rows[0].fromModelLLMName
        }
      },
      toModel: {
        id: rows[0].toModel,
        modelName: rows[0].toModelName,
        isMultiModal: rows[0].toModelIsMultiModal,
        llm: {
          id: rows[0].toModelLLMId,
          name: rows[0].toModelLLMName
        }
      },
      textContent: rows[0].textContent || null,
      timestamp: rows[0].timestamp,
      conversationId: rows[0].conversationId || null,
    }
  }
}
