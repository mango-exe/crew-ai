import { llms } from '@/lib/db/schema/llm'
import { LLMModel } from '@/lib/types/schema/llm-model.types'

export type LLM = typeof llms.$inferSelect & {
  availableModels: LLMModel[]
}
