import { beforeEach, afterEach, vi } from "vitest";

beforeEach(() => {
  vi.restoreAllMocks();
  process.env.NODE_ENV = "test";
});

afterEach(() => {
  delete process.env.API_KEY;
  delete process.env.DB_PATH;
});
