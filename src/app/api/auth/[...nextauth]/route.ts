import 'reflect-metadata'

import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import GithubProvider from 'next-auth/providers/github'

import type { AuthOptions, User } from 'next-auth'
import { UserProvider } from '@/lib/types/schema/user.types'

import { Container } from 'typedi'
import bcrypt from 'bcrypt'

import { UserRepository } from '@/lib/db/repositories/user-repository'

const userRepository = Container.get(UserRepository)

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password ' }
      },
      async authorize (credentials) {
        const email = credentials?.email as string
        const password = credentials?.password as string

        if (!email || !password) return null

        const user = await userRepository.getUserByEmail(email)

        if (user == null) return null

        const isPasswordValid = await bcrypt.compare(password, user.hashedPassword)

        if (!isPasswordValid) return null

        return {
          id: user.id.toString(),
          email: user.email
        } as User
      }
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!
    })
  ],
  session: {
    strategy: 'jwt'
  },
  callbacks: {
    async signIn ({ user, account }) {
      const existingUser = await userRepository.getUserByEmail(user.email)

      if (existingUser == null) {
        await userRepository.createUser({
          email: user.email,
          provider: account?.provider as UserProvider
        })
      }

      return true
    },
    async jwt ({ token, user }) {
      if (user) {
        token.id = user.id
        token.email = user.email
      }

      return token
    },
    async session ({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id
        session.user.email = token.email
      }
      return session
    }
  },
  secret: process.env.NEXTAUTH_SECRET
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
