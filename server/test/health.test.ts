import { describe, it, expect } from "vitest";
import { buildTestApp } from "./helpers/buildTestApp";

describe("GET /health", () => {
  it("returns 200", async () => {
    const t = await buildTestApp();
    const res = await t.app.inject({ method: "GET", url: "/health" });

    expect(res.statusCode).toBe(200);
    expect(res.headers["content-type"]).toMatch(/application\/json/);

    await t.close();
  });
});
