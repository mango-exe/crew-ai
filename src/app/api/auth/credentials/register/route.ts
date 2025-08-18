import 'reflect-metadata'

import { NextResponse } from 'next/server'

import { Container } from 'typedi'
import bcrypt from 'bcrypt'

import { UserRepository } from '@/lib/db/repositories/user-repository'
import { CreateUser, NewUser } from '@/lib/types/schema/user.types'

const userRespository = Container.get(UserRepository)

export async function POST (request: Request) {
  try {
    const body: CreateUser | null = await request.json()

    if (body == null) {
      return NextResponse.json({ message: 'Invalid request body' }, { status: 400 })
    }

    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json({ message: 'Invalid request body' }, { status: 400 })
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const user: NewUser = {
      email,
      hashedPassword,
      provider: 'credentials'
    }

    await userRespository.createUser(user)

    return NextResponse.json({ message: 'Created' }, { status: 201 })
  } catch (e) {
    console.warn(e)
    return NextResponse.json({ message: 'Internal server error ' }, { status: 500 })
  }
}
