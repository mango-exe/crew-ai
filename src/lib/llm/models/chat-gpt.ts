import { Runnable } from '@langchain/core/runnables'
import { ChatOpenAI } from '@langchain/openai'
import { BaseMessage, AIMessage, AIMessageChunk } from '@langchain/core/messages'

export class ChatGPTModel extends Runnable {
  model: ChatOpenAI
  constructor () {
    super()
    this.model = new ChatOpenAI({ model: 'gpt-4o-mini' })
  }

  lc_namespace = ['ChatGPT']
  name = 'ChatGPT'

  async invoke (input: any): Promise<AIMessageChunk> {
    const messages: BaseMessage[] =
      input.messages ?? input.chat_history ?? []
    return await this.model.invoke(messages)
  }
}
