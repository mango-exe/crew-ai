import { llmModels } from '@/lib/db/schema/llm-model'

export type LLMModel = typeof llmModels.$inferSelect

export enum DefaultLLMModels {
  OPENAI = 'gpt-4',
  GEMINI = 'gemini-2.5-pro',
  MISTRAL = 'mistral-medium-2508'
}
