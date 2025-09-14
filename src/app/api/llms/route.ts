import { NextResponse } from 'next/server'
import { authOptions } from '../auth/[...nextauth]/route'
import { getServerSession } from 'next-auth'

import { LLMRepository } from '@/lib/db/repositories/llm-repository'
import { dbConnection } from '@/lib/db'

const llmRepository = new LLMRepository(dbConnection)

export async function GET (request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (session === null) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const populatedLLMs = await llmRepository.getPopulatedLLMS()

    return NextResponse.json({ llms: populatedLLMs }, { status: 200 })
  } catch (e) {
    console.warn(e)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
