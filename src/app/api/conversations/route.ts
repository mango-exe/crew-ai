import { NextResponse } from 'next/server'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { getServerSession } from 'next-auth'
import { ConversationRepository } from '@/lib/db/repositories/conversation-repository'
import { ChatRepository } from '@/lib/db/repositories/chat-repository'
import { Container } from 'typedi'
import { NewConversation } from '@/lib/types/schema/conversation.types'
import { CreateChatBody, NewChat } from '@/lib/types/schema/chat.types'

import { LLMChatCompletion } from '@/lib/llm/llm-chat-completion'

import { ChatGPTModel } from '@/lib/llm/models/chat-gpt'

import { v4 as uuidv4 } from 'uuid'

const conversationRepository = Container.get(ConversationRepository)
const chatRepository = Container.get(ChatRepository)
const llmChatCompletion = Container.get(LLMChatCompletion)

// create conversation
export async function POST (request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (session == null) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = session.user

    const body: CreateChatBody = await request.json()
    const { chat } = body

    if (!chat) {
      return NextResponse.json({ error: 'Bad request' }, { status: 400 })
    }

    const conversationAlias = uuidv4()

    const newConversationDetails: NewConversation = {
      userId: parseInt(user.id),
      description: chat.textContent,
      alias: conversationAlias
    }

    const newConversation = await conversationRepository.createConversation(newConversationDetails)

    const newUserChatDetails: NewChat = {
      fromUser: parseInt(user.id),
      fromModel: null,
      toUser: null,
      toModel: chat.toModel,
      textContent: chat.textContent,
      conversationId: newConversation.id
    }

    const newChat = await chatRepository.createChat(newUserChatDetails)

    // TODO: Add models to DB and reference them here
    await llmChatCompletion.invoke(ChatGPTModel, 'gpt-3.5-turbo', newChat.textContent as string, newConversation.alias as string)

    // create conversation
    // create chat for conversation
    // get chat completion
  } catch (e) {
    console.warn(e)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

// get conversations
export async function GET (request: Request) {
  try {

  } catch (e) {
    console.warn(e)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
