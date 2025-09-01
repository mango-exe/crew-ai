import { LLM } from '@/lib/types/schema/llm.types'

export interface LLMSState {
  defaultLLM: LLM | null
  availableLLMS: LLM[]
  fetching: boolean
  fetched: boolean
  error: string | null
}

export interface LLMSActions {
  getLLMS: () => void
  setDefaultLLM: (llmId: string) => void
  setLLMModel: (llmId: string, modelId: string) => void
}

export type LLMSStore = LLMSState & LLMSActions
