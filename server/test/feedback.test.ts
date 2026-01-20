import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { buildTestApp } from "./helpers/buildTestApp";

describe("POST /feedback", () => {
  let t: Awaited<ReturnType<typeof buildTestApp>>;

  const validPayload = {
    projectId: "demo",
    userId: "user-123",
    rating: 5,
    comment: "Nice!",
    timestamp: "2026-01-01T00:00:00.000Z",
  };

  beforeEach(async () => {
    t = await buildTestApp();
  });

  afterEach(async () => {
    await t.close();
  });

  const post = (opts?: { apiKey?: string; payload?: any }) => {
    const headers = opts?.apiKey ? { "x-api-key": opts.apiKey } : undefined;

    return t.app.inject({
      method: "POST",
      url: "/feedback",
      headers,
      payload: opts?.payload ?? validPayload,
    });
  };

  const expectJsonError = (res: any, status: number) => {
    expect(res.statusCode).toBe(status);
    expect(res.headers["content-type"]).toMatch(/application\/json/i);

    expect(res.json()).toMatchObject({ error: expect.any(String) });
  };

  it("401 when API key missing", async () => {
    const res = await post();
    expectJsonError(res, 401);
  });

  it("401 when API key invalid", async () => {
    const res = await post({ apiKey: "wrong" });
    expectJsonError(res, 401);
  });

  it("400 when required fields missing", async () => {
    const res = await post({ apiKey: t.apiKey, payload: { rating: 5 } });
    expectJsonError(res, 400);
  });

  it("400 when rating is out of range", async () => {
    const res = await post({
      apiKey: t.apiKey,
      payload: { ...validPayload, rating: 99 },
    });
    expectJsonError(res, 400);
  });

  it("400 when rating is not an integer", async () => {
    const res = await post({
      apiKey: t.apiKey,
      payload: { ...validPayload, rating: 2.5 },
    });
    expectJsonError(res, 400);
  });

  it("400 when timestamp is invalid", async () => {
    const res = await post({
      apiKey: t.apiKey,
      payload: { ...validPayload, timestamp: "not-a-date" },
    });
    expectJsonError(res, 400);
  });
});
