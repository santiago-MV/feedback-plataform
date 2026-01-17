import fp from 'fastify-plugin'
import type { FastifyPluginAsync } from 'fastify'
import type { Kysely } from 'kysely'

import { initSchema } from '../db/init'
import { createDb } from '../db/index'
import type { Database } from '../db/types'

declare module "fastify" {
  interface FastifyInstance {
    db: Kysely<Database>;
  }
}

const dbPlugin: FastifyPluginAsync = async (app) => {
  const db = createDb();

  await initSchema(db);

  app.decorate("db", db);

  app.addHook("onClose", async () => {
    await db.destroy();
  });
};

export const dbp = fp(dbPlugin, { name: "db" });