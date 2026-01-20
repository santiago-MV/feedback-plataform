import path from "node:path";
import os from "node:os";
import fs from "node:fs";
import { randomUUID } from "node:crypto";

type TestAppOpts = {
  apiKey?: string;
};

export async function buildTestApp(opts: TestAppOpts = {}) {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "feedback-server-"));
  const dbPath = path.join(tmpDir, `test-${randomUUID()}.db`);

  const prevDb = process.env.DB_FILE;
  const prevKey = process.env.API_KEY;

  // Set env BEFORE loading app/db modules
  process.env.DB_PATH = dbPath;
  process.env.API_KEY = opts.apiKey ?? "test-api-key";

  // IMPORTANT: clear Node module cache for ESM imports between tests
  // so db/index.ts re-reads process.env.DB_PATH.
  const { buildApp } = await import("../../src/app");

  const app = await buildApp();

  return {
    app,
    apiKey: process.env.API_KEY!,
    dbPath,
    async close() {
      await app.close();
      process.env.DB_PATH = prevDb;
      process.env.API_KEY = prevKey;
      try {
        fs.rmSync(tmpDir, { recursive: true, force: true });
      } catch (e) {
        console.error(e);
      }
    },
  };
}
