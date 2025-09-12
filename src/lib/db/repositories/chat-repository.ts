import { eq } from 'drizzle-orm'
import { dbConnection, DBConnection } from '@/lib/db'
import { chats } from '@/lib/db/schema/chat'
import { Chat, NewChat } from '@/lib/types/schema/chat.types'

export class ChatRepository {
  constructor (private readonly connection: DBConnection = dbConnection) {}

  async createChat (data: NewChat): Promise<Chat> {
    const [result] = await this.connection.client
      .insert(chats)
      .values(data)
      .$returningId()

    const [newChat] = await this.connection.client
      .select()
      .from(chats)
      .where(eq(chats.id, result.id))

    return newChat
  }
}
