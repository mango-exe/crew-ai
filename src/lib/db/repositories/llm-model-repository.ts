// repositories/llmModelRepository.ts
import { eq } from 'drizzle-orm'
import { dbConnection, DBConnection } from '@/lib/db'
import { llmModels } from '@/lib/db/schema/llm-model'
import { LLMModel } from '@/lib/types/schema/llm-model.types'

export class LLMModelRepository {
  constructor (private readonly connection: DBConnection = dbConnection) {}

  async getModelByName (name: string): Promise<LLMModel | null> {
    const [model] = await this.connection.client
      .select()
      .from(llmModels)
      .where(eq(llmModels.modelName, name))

    return model || null
  }

  async getModelById (id: number): Promise<LLMModel | null> {
    const [model] = await this.connection.client
      .select()
      .from(llmModels)
      .where(eq(llmModels.id, id))

    return model || null
  }
}
