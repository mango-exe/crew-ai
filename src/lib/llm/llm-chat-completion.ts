import { ChatGPTModel } from '@/lib/llm/models/chat-gpt'
import { GeminiModel } from '@/lib/llm/models/gemini'
import { MistralModel } from '@/lib/llm/models/mistral'
import { LLMGraph } from '@/lib/llm/llm-graph'

import { AvailableLLMS } from '@/lib/types/schema/llm.types'
import { AIMessage, HumanMessage, BaseMessage } from '@langchain/core/messages'

import { ConversationRepository } from '../db/repositories/conversation-repository'

const conversationRepository = new ConversationRepository()

class LLMChatCompletion {
  private readonly llmGraph: LLMGraph
  private preloadedConversations: Set<string>

  constructor (
    chatGPTModel?: ChatGPTModel,
    geminiModel?: GeminiModel,
    mistralModel?: MistralModel
  ) {
    this.chatGPTModel = chatGPTModel ?? new ChatGPTModel()
    this.geminiModel = geminiModel ?? new GeminiModel()
    this.mistralModel = mistralModel ?? new MistralModel()

    this.llmGraph = new LLMGraph()
    this.preloadedConversations = new Set()
  }

  private readonly chatGPTModel: ChatGPTModel
  private readonly geminiModel: GeminiModel
  private readonly mistralModel: MistralModel

  async invoke (
    llm: AvailableLLMS,
    model: string,
    prompt: string,
    conversationAlias: string,
    userId: number
  ): Promise<{ answer: string, context: string }> {

    if (!this.preloadedConversations.has(conversationAlias)) {
      const conversation = await conversationRepository.getUserPopulatedConversation(userId, conversationAlias)

      if (conversation) {
        const  existingMessages: BaseMessage[] = conversation.chats.map(chat => {
          const isUserMessage = !!chat.fromUser

          const message = isUserMessage ? new HumanMessage({ content: chat.textContent as string }) : new AIMessage({ content: chat.textContent as string  })

          return message
        })

        if (existingMessages.length > 0) {
          await this.llmGraph.app.updateState(
            { configurable: { thread_id: conversationAlias } },
            { chat_history: existingMessages }
          )
          this.preloadedConversations.add(conversationAlias)
        }
      }
    }

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

export const llmChatCompletion = new LLMChatCompletion()
