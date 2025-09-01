import 'reflect-metadata'
import { Service } from 'typedi'
import { Runnable } from '@langchain/core/runnables'
import { ChatOpenAI } from '@langchain/openai'
import { BaseMessage, AIMessage } from '@langchain/core/messages'

@Service()
export class ChatGPTModel extends Runnable {
  model: ChatOpenAI
  constructor () {
    super()
    this.model = new ChatOpenAI({ model: 'gpt-4o-mini' })
  }

  lc_namespace = ['ChatGPT']
  name = 'ChatGPT'

  async invoke (input: any): Promise<AIMessage> {
    const messages: BaseMessage[] =
      input.messages ?? input.chat_history ?? []
    return await this.model.invoke(messages)
  }
}
