import path from "node:path";
import os from "node:os";
import fs from "node:fs";
import { randomUUID } from "node:crypto";

import { buildApp } from "../../src/app";

type TestAppOpts = {
  apiKey?: string;
};

/**
 * Creates an isolated Fastify instance + isolated sqlite file for each test.
 * No shared state, no flakiness.
 */
export async function buildTestApp(opts: TestAppOpts = {}) {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "feedback-server-"));
  const dbPath = path.join(tmpDir, `test-${randomUUID()}.db`);

  process.env.DB_PATH = dbPath;
  process.env.API_KEY = opts.apiKey ?? "test-api-key";

  const app = await buildApp();

  return {
    app,
    apiKey: process.env.API_KEY!,
    dbPath,
    async close() {
      await app.close();
      try { fs.rmSync(tmpDir, { recursive: true, force: true }); } catch {}
    },
  };
}
