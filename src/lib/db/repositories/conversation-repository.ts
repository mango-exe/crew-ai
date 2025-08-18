// lib/db.ts
import 'dotenv/config'
import { Service } from 'typedi'
import { drizzle } from 'drizzle-orm/mysql2'
import mysql from 'mysql2/promise'
import type { MySql2Database } from 'drizzle-orm/mysql2'

@Service()
export class DBConnection {
  public client: MySql2Database

  constructor () {
    const pool = mysql.createPool({
      uri: process.env.DATABASE_URL
    })

    this.client = drizzle(pool)
  }
}
