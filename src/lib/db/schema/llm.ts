import { mysqlTable, int, varchar, boolean } from 'drizzle-orm/mysql-core'

export const llms = mysqlTable('llms', {
  id: int().primaryKey().autoincrement(),
  name: varchar({ length: 255 }).notNull(),
  isDefault: boolean().notNull().default(false)
})
