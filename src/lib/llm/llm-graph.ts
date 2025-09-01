/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  AIMessage,
  BaseMessage,
  HumanMessage,
  RemoveMessage
} from '@langchain/core/messages'
import {
  StateGraph,
  START,
  END,
  MemorySaver
} from '@langchain/langgraph'
import { RunnableSequence, Runnable } from '@langchain/core/runnables'
import { ChatPromptTemplate, MessagesPlaceholder } from '@langchain/core/prompts'
import { z } from 'zod'
import dotenv from 'dotenv'
dotenv.config()

export const stateSchema = z.object({
  input: z.string(),
  llm: z.string().optional(),
  chat_history: z.array(z.any()),
  summary: z.string().optional(),
  context: z.any().optional(),
  answer: z.union([z.string(), z.array(z.any())]).optional()
})

export type ChatStateType = z.infer<typeof stateSchema>

export class LLMGraph {
  workflow!: StateGraph<typeof stateSchema>
  app!: Runnable<any, any>

  constructor () {
    this.initializeWorkflow()
    this.compileWorkflow()
  }

  initializeWorkflow (): void {
    this.workflow = new StateGraph<typeof stateSchema>(stateSchema as any)
      .addNode('summarize', this.summarizeHistory as any)
      .addNode('model', this.callModel as any)
      .addEdge(START, 'summarize')
      .addEdge('summarize', 'model')
      .addEdge('model', END) as any
  }

  summarizeHistory = async (
    state: ChatStateType,
    config: any
  ): Promise<Partial<ChatStateType>> => {
    const model = config?.configurable?.model

    if (!model) {
      throw new Error('No model provided for summarization')
    }

    if (state.chat_history && state.chat_history.length > 6) {
      const summary = state.summary || ''

      const summaryMessage = summary
        ? `This is a summary of the conversation to date: ${summary}\n\nExtend the summary by taking into account the new messages above:`
        : 'Create a summary of the conversation above:'

      const messages: BaseMessage[] = [
        ...state.chat_history,
        new HumanMessage({ content: summaryMessage })
      ]

      const response = await model.invoke(messages)

      const deleteMessages: RemoveMessage[] = state.chat_history
        .slice(0, -2)
        .map((m) => new RemoveMessage({ id: m.id as string }))

      return {
        summary: response.content as string,
        chat_history: deleteMessages
      }
    }

    return {}
  }

  callModel = async (
    state: ChatStateType,
    config: any
  ): Promise<Partial<ChatStateType>> => {
    const model = config?.configurable?.model

    if (!model) {
      throw new Error('No model provided for callModel method')
    }

    const promptTemplate = ChatPromptTemplate.fromMessages([
      ['system', 'You are a helpful assistant which is a member of a conversation like a group chat with other models like ChatGPT, Gemini, Mistral and the user. The chat history or the summary repesents all interactions between the user and the models from the group chat. You can use the context if relevant. This is the cconversation summary so far: {summary}'],
      new MessagesPlaceholder('chat_history'),
      ['human', '{input}']
    ])

    const ragChain = RunnableSequence.from([
      {
        input: (state: any) => state.input,
        llm: (state: any) => state.llm,
        context: (state: any) => state.context,
        chat_history: (state: any) => state.chat_history ?? [],
        summary: (state: any) => state.summary
      },
      promptTemplate,
      model,
      {
        answer: (msg: AIMessage) => `<${state.llm}>: ${msg.content}`,
        context: (prev: any) => prev.context
      }
    ])

    const response = await ragChain.invoke(state)

    return {
      chat_history: [
        ...(state.chat_history || []),
        new HumanMessage({ content: state.input }),
        new AIMessage({ content: response.answer })
      ],
      context: response.context,
      answer: response.answer
    }
  }

  compileWorkflow = async (): Promise<void> => {
    const memory = new MemorySaver()
    this.app = this.workflow.compile({ checkpointer: memory })
  }

  async getChat (model: Runnable, prompt: string, conversationId: string) {
    return await this.app.invoke(
      { input: prompt, llm: model.name },
      { configurable: { thread_id: conversationId, model } }
    )
  }
}
