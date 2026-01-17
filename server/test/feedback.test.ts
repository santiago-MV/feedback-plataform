import { describe, it, expect } from "vitest";
import { buildTestApp } from "./helpers/buildTestApp";

describe("POST /feedback", () => {
  const validPayload = {
    projectId: "demo",
    userId: "user-123",
    rating: 5,
    comment: "Nice!",
    timestamp: "2026-01-01T00:00:00.000Z",
  };

  it("401 when API key missing", async () => {
    const t = await buildTestApp();

    const res = await t.app.inject({
      method: "POST",
      url: "/feedback",
      payload: validPayload,
    });

    expect(res.statusCode).toBe(401);
    expect(res.json()).toMatchObject({
  error: expect.any(String),
});

    await t.close();
  });

  it("401 when API key invalid", async () => {
    const t = await buildTestApp();

    const res = await t.app.inject({
      method: "POST",
      url: "/feedback",
      headers: { "x-api-key": "wrong" },
      payload: validPayload,
    });

    expect(res.statusCode).toBe(401);
    await t.close();
  });

  it("400 when rating is out of range", async () => {
    const t = await buildTestApp();

    const res = await t.app.inject({
      method: "POST",
      url: "/feedback",
      headers: { "x-api-key": t.apiKey },
      payload: { ...validPayload, rating: 99 },
    });

    expect(res.statusCode).toBe(400);
    await t.close();
  });

  it("400 when required fields missing", async () => {
    const t = await buildTestApp();

    const res = await t.app.inject({
      method: "POST",
      url: "/feedback",
      headers: { "x-api-key": t.apiKey },
      payload: { rating: 5 },
    });

    expect(res.statusCode).toBe(400);
    await t.close();
  });

  it("201 on valid payload", async () => {
    const t = await buildTestApp();

    const res = await t.app.inject({
      method: "POST",
      url: "/feedback",
      headers: { "x-api-key": t.apiKey },
      payload: validPayload,
    });

    expect(res.statusCode).toBe(201);

    const body = res.json();
    expect(body).toMatchObject({
      id: expect.any(String),
    });

    await t.close();
  });
});
