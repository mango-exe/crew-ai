import { mysqlTable, int, mysqlEnum, boolean } from 'drizzle-orm/mysql-core'
import { AvailableLLMS } from '@/lib/types/schema/llm.types'

const llmEnumValues = Object.values(AvailableLLMS) as [string, ...string[]]

export const llms = mysqlTable('llms', {
  id: int().primaryKey().autoincrement(),
  name: mysqlEnum('name', llmEnumValues).notNull()
})
