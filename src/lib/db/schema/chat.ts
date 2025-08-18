import { mysqlTable, int, longtext, datetime } from 'drizzle-orm/mysql-core'
import { sql } from 'drizzle-orm'
import { llmModels } from './llm-model'
import { users } from './user'
import { conversations } from './conversation'

export const chats = mysqlTable('chats', {
  id: int('id').primaryKey().autoincrement(),
  fromUser: int('from_user').references(() => users.id),
  fromModel: int('from_model').references(() => llmModels.id),
  toUser: int('to_user').references(() => users.id),
  toModel: int('to_model').references(() => llmModels.id),
  textContent: longtext('text_content'),
  timestamp: datetime('timestamp').notNull().default(sql`CURRENT_TIMESTAMP`),
  conversationId: int().notNull().references(() => conversations.id)
})
