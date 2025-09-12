import 'dotenv/config'
import { drizzle } from 'drizzle-orm/mysql2'
import mysql from 'mysql2/promise'
import type { MySql2Database } from 'drizzle-orm/mysql2'

export class DBConnection {
  public client: MySql2Database
  private static instance: DBConnection

  private constructor () {
    const pool = mysql.createPool({
      uri: process.env.DATABASE_URL
    })
    this.client = drizzle(pool)
  }

  public static getInstance (): DBConnection {
    if (!DBConnection.instance) {
      DBConnection.instance = new DBConnection()
    }
    return DBConnection.instance
  }
}

// Optional: export the singleton directly
export const dbConnection = DBConnection.getInstance()
