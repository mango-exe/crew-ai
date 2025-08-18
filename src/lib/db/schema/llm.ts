import { mysqlTable, int, varchar } from 'drizzle-orm/mysql-core'

export const llms = mysqlTable('llms', {
  id: int().primaryKey().autoincrement(),
  name: varchar({ length: 255 }).notNull()
})
