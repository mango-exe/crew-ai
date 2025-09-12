import { llms } from '@/lib/db/schema/llm'
import { LLMModel } from '@/lib/types/schema/llm-model.types'

export type LLM = typeof llms.$inferSelect
export type LLMPopulatedWithModels = typeof llms.$inferSelect & {
  availableModels: LLMModel[]
}

export enum AvailableLLMS {
  OPENAI = 'openai',
  GEMINI = 'gemini',
  MISTRAL = 'mistral'
}
