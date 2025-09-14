import { NextResponse } from 'next/server'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { getServerSession } from 'next-auth'

import { ConversationRepository } from '@/lib/db/repositories/conversation-repository'
import { UserRepository } from '@/lib/db/repositories/user-repository'
import { dbConnection } from '@/lib/db'

import { PAGE_SIZE } from '@/lib/constants/api-constants'

// Instantiate repositories manually using the singleton DB connection
const conversationRepository = new ConversationRepository(dbConnection)
const userRepository = new UserRepository(dbConnection)

// get conversations
export async function GET (request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (session === null) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const user = await userRepository.getUserByEmail(session.user.email)

    if (user == null) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const url = new URL(request.url)
    const page = url.searchParams.get('page')
    const offset = page ? parseInt(page) * PAGE_SIZE : 0

    const { conversations, count } = await conversationRepository.getUserConversations(user?.id, offset)

    return NextResponse.json({ conversations, count }, { status: 200 })
  } catch (e) {
    console.warn(e)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
