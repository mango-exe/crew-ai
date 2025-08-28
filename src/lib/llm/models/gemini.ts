import { Runnable } from '@langchain/core/runnables'
import { ChatGoogleGenerativeAI } from '@langchain/google-genai'
import { BaseMessage, AIMessage, AIMessageChunk } from '@langchain/core/messages'

export class GeminiModel extends Runnable {
  model: ChatGoogleGenerativeAI
  constructor () {
    super()
    this.model =
      new ChatGoogleGenerativeAI({
        model: 'gemini-2.0-flash',
        temperature: 0
      })
  }

  lc_namespace = ['GeminiModel']
  name = 'Gemini'

  async invoke (input: any): Promise<AIMessageChunk> {
    console.warn({ input })
    const messages: BaseMessage[] =
      input.messages ?? input.chat_history ?? []
    return await this.model.invoke(messages)
  }
}
