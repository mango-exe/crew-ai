import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

import { UserRepository } from '@/lib/db/repositories/user-repository'
import { LLMRepository } from '@/lib/db/repositories/llm-repository'
import { LLMModelRepository } from '@/lib/db/repositories/llm-model-repository'
import { UserLLMPreferencesRepository } from '@/lib/db/repositories/user-llm-preferences-repository'
import { dbConnection } from '@/lib/db'

const userRepository = new UserRepository(dbConnection)
const llmRepository = new LLMRepository(dbConnection)
const llmModelRepository = new LLMModelRepository(dbConnection)
const userLLMPreferencesRepository = new UserLLMPreferencesRepository(dbConnection)

// set model for LLM
export async function PUT (request: Request, { params }: { params: Promise<{ llmId: string, llmModelId: string }> }) {
  try {
    const session = await getServerSession(authOptions)

    if (session == null) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const user = await userRepository.getUserByEmail(session.user.email)

    if (user == null) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const { llmId, llmModelId } = await params

    const llm = await llmRepository.getLLMById(parseInt(llmId))

    if (llm == null) {
      return NextResponse.json({ message: 'Bad request' }, { status: 400 })
    }

    const llmModel = await llmModelRepository.getModelById(parseInt(llmModelId))

    if (llmModel == null) {
      return NextResponse.json({ message: 'Bad request' }, { status: 400 })
    }

    if (llmModel.llmId !== llm.id) {
      return NextResponse.json({ message: 'Bad request' }, { status: 400 })
    }

    await userLLMPreferencesRepository.setUserLLMPreferencesLLMModel(user.id, llm.id, llmModel.id)

    const llmsPreferences = await userLLMPreferencesRepository.getUserLLMPreferences(user.id)

    return NextResponse.json({ llmsPreferences }, { status: 200 })
  } catch (e) {
    console.warn(e)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
