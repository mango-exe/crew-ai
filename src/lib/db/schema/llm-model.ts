import { mysqlTable, int, varchar, boolean } from 'drizzle-orm/mysql-core'
import { llms } from './llm'

export const llmModels = mysqlTable('llm_models', {
  id: int().primaryKey().autoincrement(),
  llmId: int().notNull().references(() => llms.id),
  modelName: varchar('model_name', { length: 255 }).notNull().unique(),
  isMultiModal: boolean().notNull().default(false)
})
