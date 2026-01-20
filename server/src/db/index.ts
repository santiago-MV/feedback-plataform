import type { Database } from "./types";
import SQLite from "better-sqlite3";
import { Kysely, SqliteDialect } from "kysely";
import path from "node:path";
import fs from "node:fs";

function resolveDbFile() {
  const defaultDbFile = path.resolve(process.cwd(), "data", "app.db");
  const dbFile = process.env.DB_FILE
    ? path.resolve(process.env.DB_FILE)
    : defaultDbFile;

  fs.mkdirSync(path.dirname(dbFile), { recursive: true });
  return dbFile;
}

export const createDb = () => {
  const dbFile = resolveDbFile();

  const dialect = new SqliteDialect({
    database: new SQLite(dbFile),
  });

  return new Kysely<Database>({
    dialect,
  });
};
