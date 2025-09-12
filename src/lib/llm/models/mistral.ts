import { Runnable } from '@langchain/core/runnables'
import { ChatMistralAI } from '@langchain/mistralai'
import { BaseMessage, AIMessage } from '@langchain/core/messages'

export class MistralModel extends Runnable {
  public model: ChatMistralAI

  constructor () {
    super()
    this.model = new ChatMistralAI({
      model: 'mistral-large-latest',
      temperature: 0
    })
  }

  lc_namespace = ['Mistral']
  name = 'Mistral'

  async invoke (input: any): Promise<AIMessage> {
    const messages: BaseMessage[] = input.messages ?? input.chat_history ?? []
    return await this.model.invoke(messages)
  }
}
