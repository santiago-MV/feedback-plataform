import { Database } from './types' // this is the Database interface we defined earlier
import SQLite from 'better-sqlite3'
import { Kysely, SqliteDialect } from 'kysely'

const dbFile = process.env.DB_FILE ?? "./data/app.db";

const dialect = new SqliteDialect({
  database: new SQLite(dbFile),
})

export const db = new Kysely<Database>({
  dialect,
})