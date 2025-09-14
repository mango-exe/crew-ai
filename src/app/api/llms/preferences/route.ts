import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]/route'

import { UserLLMPreferencesRepository } from '@/lib/db/repositories/user-llm-preferences-repository'
import { UserRepository } from '@/lib/db/repositories/user-repository'
import { dbConnection } from '@/lib/db'

const userRepository = new UserRepository(dbConnection)
const userLLMPreferencesRepository = new UserLLMPreferencesRepository(dbConnection)

export async function GET (request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (session == null) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const user = await userRepository.getUserByEmail(session.user.email)

    if (user == null) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }
    const llmsPreferences = await userLLMPreferencesRepository.getUserLLMPreferences(user.id)

    return NextResponse.json({ llmsPreferences }, { status: 200 })
  } catch (e) {
    console.warn(e)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
