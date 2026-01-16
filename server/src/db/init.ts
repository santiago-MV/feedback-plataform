import type { Kysely } from "kysely";
import type { Database } from "./types.js";

export async function initSchema(db: Kysely<Database>) {
  await db.schema
    .createTable("feedback").ifNotExists()
    .addColumn("id", "text", (col) => col.primaryKey())
    .addColumn("project_id", "text", (col) => col.notNull())
    .addColumn("user_id", "text", (col) => col.notNull())
    .addColumn("rating", "integer", (col) => col.notNull())
    .addColumn("comment", "text")
    .addColumn("created_at", "text", (col) => col.notNull())
    .execute();
}