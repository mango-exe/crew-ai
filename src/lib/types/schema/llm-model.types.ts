import { llmModels } from '@/lib/db/schema/llm-model'

export type LLMModel = typeof llmModels.$inferSelect
