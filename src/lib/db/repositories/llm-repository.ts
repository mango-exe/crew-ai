import { eq } from 'drizzle-orm'
import { dbConnection, DBConnection } from '@/lib/db'
import { llms } from '@/lib/db/schema/llm'
import { LLM, LLMPopulatedWithModels } from '@/lib/types/schema/llm.types'
import { llmModels } from '../schema/llm-model'

export class LLMRepository {
  constructor (private readonly connection: DBConnection = dbConnection) {}

  async getPopulatedLLMS (): Promise<LLMPopulatedWithModels[]> {
    const rows = await this.connection.client
      .select({
        llmId: llms.id,
        llmName: llms.name,

        modelId: llmModels.id,
        modelName: llmModels.modelName,
        modelIsMultiModal: llmModels.isMultiModal,
        modelLLMId: llmModels.llmId
      })
      .from(llms)
      .leftJoin(llmModels, eq(llms.id, llmModels.llmId))

    const grouped = new Map<number, LLMPopulatedWithModels>()

    for (const row of rows) {
      if (!grouped.has(row.llmId)) {
        grouped.set(row.llmId, {
          id: row.llmId,
          name: row.llmName,
          availableModels: []
        })
      }

      if (row.modelId != null && row.modelIsMultiModal != null) {
        grouped.get(row.llmId)!.availableModels.push({
          id: row.modelId,
          llmId: row.modelLLMId!,
          modelName: row.modelName!,
          isMultiModal: row.modelIsMultiModal
        })
      }
    }

    return Array.from(grouped.values())
  }

  async getLLMByName (name: string): Promise<LLM | null> {
    const [llm] = await this.connection.client
      .select()
      .from(llms)
      .where(eq(llms.name, name))

    return llm || null
  }

  async getLLMById (id: number): Promise<LLM | null> {
    const [llm] = await this.connection.client
      .select()
      .from(llms)
      .where(eq(llms.id, id))

    return llm || null
  }
}
