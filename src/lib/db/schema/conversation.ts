import { int, mysqlTable, boolean, varchar } from 'drizzle-orm/mysql-core'
import { users } from './user'

export const conversations = mysqlTable('conversations', {
  id: int().primaryKey().autoincrement(),
  userId: int().notNull().references(() => users.id),
  description: varchar({ length: 255 }),
  alias: varchar({ length: 255 }).unique(),
  enabled: boolean().notNull().default(true)
})
