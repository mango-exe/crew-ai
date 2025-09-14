import { LLM, LLMPopulatedWithModels } from '@/lib/types/schema/llm.types'
import { PopulatedUserLLMPreferences } from '@/lib/types/schema/user-llm-preferences'

export interface LLMSState {
  defaultLLM: LLM | null
  availableLLMS: LLMPopulatedWithModels[]
  llmsPreferences: PopulatedUserLLMPreferences[]
  fetching: boolean
  fetched: boolean
  error: string | null
}

export interface LLMSActions {
  getLLMS: () => void
  setDefaultLLM: (llmId: string) => void
  setLLMModel: (llmId: string, modelId: string) => void
  getLLMSPreferences: () => void
}

export type LLMSStore = LLMSState & LLMSActions
