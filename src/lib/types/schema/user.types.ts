import { users } from '@/lib/db/schema/user'

export type User = typeof users.$inferSelect
export type UserProvider = 'credentials' | 'google' | 'github'
export type NewUser = Pick<typeof users.$inferInsert, 'email' | 'hashedPassword'> & { provider: UserProvider, hashedPassword?: string }
export type CreateUser = Pick<User, 'email'> & { password: string }
