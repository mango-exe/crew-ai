import { mysqlTable, int, varchar, float } from 'drizzle-orm/mysql-core'
import { chats } from './chat'

export const attachments = mysqlTable('attachments', {
  id: int('id').primaryKey().autoincrement(),
  type: varchar('filetype', { length: 255 }).notNull(),
  name: varchar('filename', { length: 255 }).notNull(),
  size: float().notNull(),
  path: varchar('filepath', { length: 255 }).notNull(),
  chatId: int().notNull().references(() => chats.id)
})
