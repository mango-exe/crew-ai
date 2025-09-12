import { eq } from 'drizzle-orm'
import { dbConnection, DBConnection } from '@/lib/db'
import { users } from '@/lib/db/schema/user'
import { User, NewUser } from '@/lib/types/schema/user.types'

export class UserRepository {
  constructor (private readonly connection: DBConnection = dbConnection) {}

  async getUserById (id: number): Promise<User | null> {
    const result = await this.connection.client
      .select()
      .from(users)
      .where(eq(users.id, id))
    return result[0] || null
  }

  async getUserByEmail (email: string): Promise<User | null> {
    const result = await this.connection.client
      .select()
      .from(users)
      .where(eq(users.email, email))
    return result[0] || null
  }

  async createUser (user: NewUser): Promise<User> {
    await this.connection.client
      .insert(users)
      .values(user)
    const result = await this.connection.client
      .select()
      .from(users)
      .where(eq(users.email, user.email))
    return result[0]
  }
}
