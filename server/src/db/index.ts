import { Database } from './types' // this is the Database interface we defined earlier
import SQLite from 'better-sqlite3'
import { Kysely, SqliteDialect } from 'kysely'
import path from 'node:path';
import fs from "node:fs";

const defaultDbFile = path.resolve(process.cwd(), "data", "app.db");
const dbFile = process.env.DB_FILE
  ? path.resolve(process.env.DB_FILE)
  : defaultDbFile;

fs.mkdirSync(path.dirname(dbFile), { recursive: true });

const dialect = new SqliteDialect({
  database: new SQLite(dbFile),
})

export const db = new Kysely<Database>({
  dialect,
})