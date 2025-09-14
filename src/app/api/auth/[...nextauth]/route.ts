import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import GithubProvider from 'next-auth/providers/github'

import type { AuthOptions, User } from 'next-auth'
import { UserProvider } from '@/lib/types/schema/user.types'

import bcrypt from 'bcrypt'

import { UserRepository } from '@/lib/db/repositories/user-repository'
import { UserLLMPreferencesRepository } from '@/lib/db/repositories/user-llm-preferences-repository'
import { LLMRepository } from '@/lib/db/repositories/llm-repository'
import { LLMModelRepository } from '@/lib/db/repositories/llm-model-repository'
import { AvailableLLMS } from '@/lib/types/schema/llm.types'
import { DefaultLLMModels } from '@/lib/types/schema/llm-model.types'
import { dbConnection } from '@/lib/db'


const userRepository = new UserRepository(dbConnection)
const userLLMPreferencesRepository = new UserLLMPreferencesRepository(dbConnection)
const llmRepository = new LLMRepository(dbConnection)
const llmModelRepostory = new LLMModelRepository(dbConnection)

import { seedLLMModels } from '@/lib/db/seed/llm-models-seed'

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize (credentials) {
        try {
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
        } catch (e) {
          console.warn(e)
          return null
        }
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
      try {
        await seedLLMModels()
        if (!user) return false
        const existingUser = await userRepository.getUserByEmail(user.email)

        if (existingUser == null) {
          await userRepository.createUser({
            email: user.email,
            provider: account?.provider as UserProvider
          })

          const createdUser = await userRepository.getUserByEmail(user.email)

          if (createdUser) {
            for (const availableLLM of Object.values(AvailableLLMS)) {
              const llm = await llmRepository.getLLMByName(availableLLM)
              const defaultModelName = DefaultLLMModels[availableLLM.toUpperCase() as keyof typeof DefaultLLMModels]
              const llmModel = await llmModelRepostory.getModelByName(defaultModelName)

              const isDefault = availableLLM === 'openai'

              if (!llm || !llmModel) {
                continue
              }

              await userLLMPreferencesRepository.createUserLLMPreferences(createdUser.id, llm.id, llmModel.id, isDefault)
            }
          }
        }

        return true
      } catch (e) {
        console.warn(e)
        return false
      }
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
