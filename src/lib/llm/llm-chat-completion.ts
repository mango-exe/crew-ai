// import { LLMGraph } from './llm/llm-graph.js'
// import { v4 as uuidv4 } from 'uuid'

import { Inject, Service } from 'typedi'

import { ChatGPTModel } from '@/lib/llm/models/chat-gpt'
import { GeminiModel } from '@/lib/llm/models/gemini'
import { MistralModel } from '@/lib/llm/models/mistral'
import { LLMGraph } from '@/lib/llm/llm-graph'

import { AIMessage } from '@langchain/core/messages'

@Service({ transient: true })
export class LLMChatCompletion {
  llmGraph: LLMGraph
  constructor (
    @Inject(() => ChatGPTModel) private readonly chatGPTModel: ChatGPTModel,
    @Inject(() => GeminiModel) private readonly geminiModel: GeminiModel,
    @Inject(() => MistralModel) private readonly mistralModel: MistralModel
  ) {
    this.llmGraph = new LLMGraph()
  }

  async invoke (llm: typeof ChatGPTModel | typeof GeminiModel | typeof MistralModel, model: string, prompt: string, conversationAlias: string): Promise<AIMessage> {
    switch (llm) {
      case ChatGPTModel:
        return await this.llmGraph.getChat(this.chatGPTModel, prompt, conversationAlias)
      case GeminiModel:
        return await this.llmGraph.getChat(this.geminiModel, prompt, conversationAlias)
      case MistralModel:
        return await this.llmGraph.getChat(this.mistralModel, prompt, conversationAlias)
      default:
        throw new Error('Unsupported LLM')
    }
  }
}
