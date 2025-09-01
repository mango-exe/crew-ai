import { StateCreator } from 'zustand'
import { LLMSStore } from '@/lib/types/stores/llms.types'
import axios from 'axios'

export const getLLMS: StateCreator<LLMSStore, [], [], { getLLMS: () => Promise<void> }> = (set, get) => ({
  getLLMS: async () => {
    set({ fetching: true })
    try {
      // TOOD: Implement api call

    } catch (err: unknown) {
      if (err instanceof Error) {
        set({ error: err.message, fetching: false })
      } else {
        set({ error: 'Unknown error', fetching: false })
      }
    }
  }
})

export const setDefaultLLM: StateCreator<LLMSStore, [], [], { setDefaultLLM: (llmId: string) => Promise<void> }> = (set, get) => ({
  setDefaultLLM: async (llmId: string) => {
    set({ fetching: true })
    try {
      // TOOD: Implement api call
    } catch (err: unknown) {
      if (err instanceof Error) {
        set({ error: err.message, fetching: false })
      } else {
        set({ error: 'Unknown error', fetching: false })
      }
    }
  }
})

export const setLLMModel: StateCreator<LLMSStore, [], [], { setLLMModel: (llmId: string, modelId: string) => Promise<void> }> = (set, get) => ({
  setLLMModel: async (llmId: string, modelId: string) => {
    set({ fetching: true })
    try {
      // TOOD: Implement api call
    } catch (err: unknown) {
      if (err instanceof Error) {
        set({ error: err.message, fetching: false })
      } else {
        set({ error: 'Unknown error', fetching: false })
      }
    }
  }
})
