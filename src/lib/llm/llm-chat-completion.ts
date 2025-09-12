import { ChatGPTModel } from '@/lib/llm/models/chat-gpt'
import { GeminiModel } from '@/lib/llm/models/gemini'
import { MistralModel } from '@/lib/llm/models/mistral'
import { LLMGraph } from '@/lib/llm/llm-graph'

import { AvailableLLMS } from '@/lib/types/schema/llm.types'

export class LLMChatCompletion {
  private readonly llmGraph: LLMGraph

  constructor (
    chatGPTModel?: ChatGPTModel,
    geminiModel?: GeminiModel,
    mistralModel?: MistralModel
  ) {
    // Instantiate models if not provided
    this.chatGPTModel = chatGPTModel ?? new ChatGPTModel()
    this.geminiModel = geminiModel ?? new GeminiModel()
    this.mistralModel = mistralModel ?? new MistralModel()

    this.llmGraph = new LLMGraph()
  }

  private readonly chatGPTModel: ChatGPTModel
  private readonly geminiModel: GeminiModel
  private readonly mistralModel: MistralModel

  async invoke (
    llm: AvailableLLMS,
    model: string,
    prompt: string,
    conversationAlias: string
  ): Promise<{ answer: string, context: string }> {
    switch (llm) {
      case AvailableLLMS.OPENAI:
        return await this.llmGraph.getChat(this.chatGPTModel, prompt, conversationAlias)
      case AvailableLLMS.GEMINI:
        return await this.llmGraph.getChat(this.geminiModel, prompt, conversationAlias)
      case AvailableLLMS.MISTRAL:
        return await this.llmGraph.getChat(this.mistralModel, prompt, conversationAlias)
      default:
        throw new Error('Unsupported LLM')
    }
  }
}
