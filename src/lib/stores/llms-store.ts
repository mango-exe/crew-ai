import { createStore, StoreApi, useStore } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { LLMSStore, LLMSState } from '@/lib/types/stores/llms.types'
import { LLMPopulatedWithModels } from '../types/schema/llm.types'
import { getLLMS, setDefaultLLM, setLLMModel, getLLMSPreferences } from './actions/llms-actions'

export const initialState: LLMSState = {
  defaultLLM: null,
  availableLLMS: [],
  llmsPreferences: [],
  fetching: false,
  fetched: false,
  error: null
}

export const createLLMSStore = (
  initState: LLMSState = initialState
): StoreApi<LLMSStore> => {
  return createStore<LLMSStore, [['zustand/immer', never]]>(
    immer((...args) => ({
      ...initState,
      ...getLLMS(...args),
      ...setDefaultLLM(...args),
      ...setLLMModel(...args),
      ...getLLMSPreferences(...args)
    }))
  )
}

export const llmsStore = createLLMSStore()
export function useLLMStore<T> (selector: (state: LLMSStore) => T): T {
  return useStore(llmsStore, selector)
}
