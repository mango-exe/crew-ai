import { int, mysqlTable, varchar, boolean, mysqlEnum } from 'drizzle-orm/mysql-core'

export const users = mysqlTable('users', {
  id: int().primaryKey().autoincrement(),
  email: varchar({ length: 255 }).unique().notNull(),
  provider: mysqlEnum('provider_enum', ['credentials', 'google', 'github']).notNull(),
  hashedPassword: varchar({ length: 255 }),
  enabled: boolean().notNull().default(true)
})
