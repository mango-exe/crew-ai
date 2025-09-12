import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

import { ConversationRepository } from '@/lib/db/repositories/conversation-repository'
import { UserRepository } from '@/lib/db/repositories/user-repository'
import { dbConnection } from '@/lib/db'

// Instantiate repositories manually using the singleton DB connection
const conversationRepository = new ConversationRepository(dbConnection)
const userRepository = new UserRepository(dbConnection)

// get conversation by id
export async function GET (request: Request, { params }: { params: Promise<{ conversationAlias: string }> }) {
  try {
    const session = await getServerSession(authOptions)

    if (session == null) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const user = await userRepository.getUserByEmail(session.user.email)

    if (user == null) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const { conversationAlias } = await params

    const conversation = await conversationRepository.getUserPopulatedConversation(user.id, conversationAlias)

    if (conversation == null) {
      return NextResponse.json({ message: 'Not Found' }, { status: 404 })
    }

    return NextResponse.json({ conversation }, { status: 200 })
  } catch (e) {
    console.warn(e)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

// delete conversation by id
export async function DELETE (request: Request, { params }: { params: Promise<{ conversationAlias: string }> }) {
  try {
    const session = await getServerSession(authOptions)

    if (session == null) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const user = await userRepository.getUserByEmail(session.user.email)

    if (user == null) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const { conversationAlias } = await params

    await conversationRepository.deleteConversation(user.id, conversationAlias)

    return NextResponse.json({ message: 'Ok' }, { status: 200 })
  } catch (e) {
    console.warn(e)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
