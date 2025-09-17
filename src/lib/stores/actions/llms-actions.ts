import { StateCreator } from 'zustand'
import { LLMSStore } from '@/lib/types/stores/llms.types'
import { SERVER } from '@/lib/global/config'
import axios from 'axios'

export const getLLMS: StateCreator<LLMSStore, [], [], { getLLMS: () => Promise<void> }> = (set, get) => ({
  getLLMS: async () => {
    set({ fetching: true })
    try {
      const response = await axios.get(`${SERVER}/api/llms`)
      set({ availableLLMS: response.data.llms, fetching: false })
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
    try {
      const response = await axios.put(`${SERVER}/api/llms/${llmId}/default`)
      set({ llmsPreferences: response.data.llmsPreferences })
    } catch (err: unknown) {
      if (err instanceof Error) {
        set({ error: err.message })
      } else {
        set({ error: 'Unknown error' })
      }
    }
  }
})

export const setLLMModel: StateCreator<LLMSStore, [], [], { setLLMModel: (llmId: string, llmModelId: string) => Promise<void> }> = (set, get) => ({
  setLLMModel: async (llmId: string, llmModelId: string) => {
    try {
      const response = await axios.put(`${SERVER}/api/llms/${llmId}/models/${llmModelId}`)
      set({ llmsPreferences: response.data.llmsPreferences })
    } catch (err: unknown) {
      if (err instanceof Error) {
        set({ error: err.message })
      } else {
        set({ error: 'Unknown error', fetching: false })
      }
    }
  }
})

export const getLLMSPreferences: StateCreator<LLMSStore, [], [], { getLLMSPreferences: () => Promise<void> }> = (set, get) => ({
  getLLMSPreferences: async () => {
    set({ fetching: true })
    try {
      const response = await axios.get(`${SERVER}/api/llms/preferences`)
      set({ llmsPreferences: response.data.llmsPreferences, fetching: false })
    } catch (err: unknown) {
      if (err instanceof Error) {
        set({ error: err.message, fetching: false })
      } else {
        set({ error: 'Unknown error', fetching: false })
      }
    }
  }
})
