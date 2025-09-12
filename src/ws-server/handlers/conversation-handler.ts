// src/server/handlers/conversationHandler.ts
import { ConversationRepository } from '../../lib/db/repositories/conversation-repository'
import { ChatRepository } from '../../lib/db/repositories/chat-repository'
import { LLMRepository } from '../../lib/db/repositories/llm-repository'
import { LLMModelRepository } from '../../lib/db/repositories/llm-model-repository'
import { UserRepository } from '../../lib/db/repositories/user-repository'
import { LLMChatCompletion } from '../../lib/llm/llm-chat-completion'

import { dbConnection } from '../../lib/db'
import { NewConversation } from '../../lib/types/schema/conversation.types'
import { NewChat, Chat } from '../../lib/types/schema/chat.types'
import { v4 as uuidv4 } from 'uuid'
import { AvailableLLMS } from '../../lib/types/schema/llm.types'

// Instantiate repositories using the singleton DB connection
const conversationRepository = new ConversationRepository(dbConnection)
const chatRepository = new ChatRepository(dbConnection)
const llmRepository = new LLMRepository(dbConnection)
const llmModelRepository = new LLMModelRepository(dbConnection)
const userRepository = new UserRepository(dbConnection)
const llmChatCompletion = new LLMChatCompletion() // assuming this class doesn't require DI

export async function handleNewConversation (userEmail: string, chat: NewChat): Promise<{ chat: Chat, conversationAlias: string }> {
  if (!chat) {
    throw new Error('Bad request: chat is missing')
  }

  const user = await userRepository.getUserByEmail(userEmail)
  if (user == null) {
    throw new Error('Unauthorized: user not found')
  }

  const conversationAlias = uuidv4()

  const newConversationDetails: NewConversation = {
    userId: user.id,
    description: chat.textContent,
    alias: conversationAlias
  }

  const newConversation = await conversationRepository.createConversation(newConversationDetails)

  const newUserChatDetails: NewChat = {
    fromUser: user.id,
    fromModel: null,
    toUser: null,
    toModel: chat.toModel,
    textContent: chat.textContent,
    conversationId: newConversation.id
  }

  const newUserChat = await chatRepository.createChat(newUserChatDetails)

  const llmModel = await llmModelRepository.getModelById(newUserChat.toModel!)
  if (llmModel == null) {
    throw new Error('LLM model not found')
  }

  const llm = await llmRepository.getLLMById(llmModel.llmId)
  if (llm == null) {
    throw new Error('LLM not found')
  }

  const aiResponse = await llmChatCompletion.invoke(
    llm.name as AvailableLLMS,
    llmModel.modelName!,
    newUserChat.textContent as string,
    newConversation.alias as string
  )

  const newAIChatDetails: NewChat = {
    fromUser: null,
    fromModel: llmModel.id,
    toUser: user.id,
    toModel: null,
    textContent: aiResponse.answer,
    conversationId: newConversation.id
  }

  const newAIChat = await chatRepository.createChat(newAIChatDetails)

  return {
    conversationAlias: newConversation.alias as string,
    chat: newAIChat
  }
}

export async function handleNewChatMessage (
  userEmail: string,
  conversationAlias: string,
  chat: NewChat
): Promise<Chat> {
  if (!chat) {
    throw new Error('Bad request: chat is missing')
  }

  const user = await userRepository.getUserByEmail(userEmail)
  if (user == null) {
    throw new Error('Unauthorized: user not found')
  }

  const conversation = await conversationRepository.getUserConversationByAlias(
    user.id,
    conversationAlias
  )

  if (conversation == null) {
    throw new Error('Conversation not found')
  }

  const newUserChatDetails: NewChat = {
    fromUser: user.id,
    fromModel: null,
    toUser: null,
    toModel: chat.toModel,
    textContent: chat.textContent,
    conversationId: conversation.id
  }

  const newUserChat = await chatRepository.createChat(newUserChatDetails)

  const llmModel = await llmModelRepository.getModelById(newUserChat.toModel!)
  if (llmModel == null) {
    throw new Error('LLM model not found')
  }

  const llm = await llmRepository.getLLMById(llmModel.llmId)
  if (llm == null) {
    throw new Error('LLM not found')
  }

  const aiResponse = await llmChatCompletion.invoke(
    llm.name as AvailableLLMS,
    llmModel.modelName!,
    newUserChat.textContent as string,
    conversation.alias as string
  )

  const newAIChatDetails: NewChat = {
    fromUser: null,
    fromModel: llmModel.id,
    toUser: user.id,
    toModel: null,
    textContent: aiResponse.answer,
    conversationId: conversation.id
  }

  const newAIChat = await chatRepository.createChat(newAIChatDetails)

  return { chat: newAIChat }
}
