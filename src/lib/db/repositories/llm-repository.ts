import { eq } from 'drizzle-orm'
import { dbConnection, DBConnection } from '@/lib/db'
import { llms } from '@/lib/db/schema/llm'
import { LLM } from '@/lib/types/schema/llm.types'

export class LLMRepository {
  constructor (private readonly connection: DBConnection = dbConnection) {}

  async getLLMById (id: number): Promise<LLM | null> {
    const [llm] = await this.connection.client
      .select()
      .from(llms)
      .where(eq(llms.id, id))

    return llm || null
  }
}
