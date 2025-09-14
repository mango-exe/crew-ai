import { DBConnection } from '..'
import { userLLMPreferences } from '../schema/user-llm-preferences'
import { llmModels } from '../schema/llm-model'
import { llms } from '../schema/llm'

import { eq, and } from 'drizzle-orm'

import { PopulatedUserLLMPreferences } from '@/lib/types/schema/user-llm-preferences'

export class UserLLMPreferencesRepository {
  constructor (private readonly connection: DBConnection) {}

  async createUserLLMPreferences (userId: number, llmId: number, llmModelId: number, isDefault: boolean = false): Promise<void> {
    await this.connection.client.insert(userLLMPreferences).values({ userId, llm: llmId, llmModel: llmModelId, isDefault })
  }

  async getUserLLMPreferences (userId: number): Promise<PopulatedUserLLMPreferences[]> {
    const results = await this.connection.client
      .select({
        id: userLLMPreferences.id,
        userId: userLLMPreferences.userId,
        isDefault: userLLMPreferences.isDefault,
        llmId: userLLMPreferences.llm,
        llmName: llms.name,
        llmModelId: userLLMPreferences.llmModel,
        llmModelName: llmModels.modelName,
        llmModelIsMultiModal: llmModels.isMultiModal
      })
      .from(userLLMPreferences)
      .leftJoin(llms, eq(userLLMPreferences.llm, llms.id))
      .leftJoin(llmModels, eq(userLLMPreferences.llmModel, llmModels.id))
      .where(eq(userLLMPreferences.userId, userId))

    return results.map(result => ({
      id: result.id,
      userId: result.userId,
      isDefault: result.isDefault,
      llm: {
        id: result.llmId,
        name: result.llmName
      },
      llmModel: {
        id: result.llmModelId,
        modelName: result.llmModelName,
        isMultiModal: result.llmModelIsMultiModal
      }
    }))
  }

  async setUserLLMPreferencesDefaultLLM (userId: number, llmId: number): Promise<void> {
    await this.connection.client
      .update(userLLMPreferences)
      .set({ isDefault: false })
      .where(
        and(
          eq(userLLMPreferences.userId, userId),
          eq(userLLMPreferences.isDefault, true)
        )
      )

    await this.connection.client
      .update(userLLMPreferences)
      .set({ isDefault: true })
      .where(
        and(
          eq(userLLMPreferences.userId, userId),
          eq(userLLMPreferences.llm, llmId)
        )
      )
  }

  async setUserLLMPreferencesLLMModel (userId: number, llmId: number, llmModelId: number): Promise<void> {
    await this.connection.client
      .update(userLLMPreferences)
      .set({ llmModel: llmModelId })
      .where(
        and(
          eq(userLLMPreferences.userId, userId),
          eq(userLLMPreferences.llm, llmId)
        )
      )
  }
}
