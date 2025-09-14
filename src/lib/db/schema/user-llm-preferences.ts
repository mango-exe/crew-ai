import { int, mysqlTable, boolean } from 'drizzle-orm/mysql-core'
import { llms } from './llm'
import { llmModels } from './llm-model'
import { users } from './user'

export const userLLMPreferences = mysqlTable('user-llm-preferences', {
  id: int().primaryKey().autoincrement(),
  llm: int().notNull().references(() => llms.id),
  llmModel: int().notNull().references(() => llmModels.id).default(2),
  isDefault: boolean().notNull().default(false),
  userId: int().notNull().references(() => users.id)
})
