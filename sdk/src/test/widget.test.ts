import { describe, it, expect, vi, beforeEach } from "vitest";
import { FeedbackWidget } from "../widget"; // or "../index" depending on exports

describe("FeedbackWidget", () => {
  beforeEach(() => {
    // reset module state between tests: easiest is dynamic import, but we keep simple:
    document.body.innerHTML = "";
    localStorage.clear();
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => {
        return new Response(JSON.stringify({ ok: true }), { status: 201 });
      }),
    );
  });

  it("throws if init missing projectId/apiKey", () => {
    expect(() =>
      FeedbackWidget.init({ projectId: "", apiKey: "x" } as any),
    ).toThrow(/projectId/);
    expect(() =>
      FeedbackWidget.init({ projectId: "p", apiKey: "" } as any),
    ).toThrow(/apiKey/);
  });

  it("submitFeedback rejects invalid rating", async () => {
    FeedbackWidget.init({ projectId: "p1", apiKey: "k1" });

    await expect(FeedbackWidget.submit({ rating: 0 })).rejects.toThrow(
      /rating/,
    );
    await expect(FeedbackWidget.submit({ rating: 6 })).rejects.toThrow(
      /rating/,
    );
    await expect(
      FeedbackWidget.submit({ rating: 2.5 }),
    ).rejects.toThrow(/integer/);
  });
});
