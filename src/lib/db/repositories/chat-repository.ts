import 'reflect-metadata'

import { DBConnection } from '@/lib/db/index'
import { Service, Inject } from 'typedi'
import { eq } from 'drizzle-orm'

import { Chat, NewChat } from '@/lib/types/schema/chat.types'

import { chats } from '@/lib/db/schema/chat'

@Service()
export class ChatRepository {
  constructor (@Inject(() => DBConnection) private readonly connection: DBConnection) {}

  async createChat (data: NewChat): Promise<Chat> {
    const [result] = await this.connection.client.insert(chats).values(data).$returningId()
    const [newChat] = await this.connection.client.select().from(chats).where(eq(chats.id, result.id))
    return newChat
  }
}
