import { userLLMPreferences } from '@/lib/db/schema/user-llm-preferences'

export type UserLLMPreferences = typeof userLLMPreferences.$inferSelect
export type PopulatedUserLLMPreferences = Omit<typeof userLLMPreferences.$inferSelect, 'llm' | 'llmModel'> & {
  llm: { id: number, name: string | null }
  llmModel: { id: number, modelName: string | null, isMultiModal: boolean | null }
}
