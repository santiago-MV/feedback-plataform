import type { Kysely } from "kysely";
import { sql } from "kysely";
import type { Database } from "./types";

export async function initSchema(db: Kysely<Database>) {
  await sql`
    CREATE TABLE IF NOT EXISTS feedback (
      id TEXT PRIMARY KEY,
      project_id TEXT NOT NULL,
      user_id TEXT NOT NULL,
      rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
      comment TEXT,
      created_at TEXT NOT NULL,
      saved_at TEXT NOT NULL
    );
  `.execute(db);
}
