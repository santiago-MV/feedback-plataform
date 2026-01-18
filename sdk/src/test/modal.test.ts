import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("../modal", () => ({
  openModal: vi.fn(),
}));

vi.mock("../api", () => ({
  sendFeedback: vi.fn(),
}));

import { FeedbackWidget } from "../widget";
import { openModal } from "../modal";
import { sendFeedback } from "../api";

describe("FeedbackWidget + modal integration", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();

    FeedbackWidget.init({
      projectId: "p1",
      apiKey: "k1",
      backendUrl: "http://localhost:3001",
    });
  });

  it("open() calls openModal", () => {
    FeedbackWidget.open();

    expect(openModal).toHaveBeenCalledTimes(1);
  });

  it("onSubmit triggers sendFeedback with correct payload", async () => {
    FeedbackWidget.open();

    // capture the onSubmit callback passed to modal
    const modalArgs = (openModal as any).mock.calls[0][0];
    const onSubmit = modalArgs.onSubmit;

    await onSubmit({
      rating: 5,
      comment: "hello",
    });

    expect(sendFeedback).toHaveBeenCalledTimes(1);

    const [state, payload] = (sendFeedback as any).mock.calls[0];

    expect(state.projectId).toBe("p1");
    expect(state.apiKey).toBe("k1");

    expect(payload.rating).toBe(5);
    expect(payload.comment).toBe("hello");
    expect(typeof payload.timestamp).toBe("string");
  });

  it("onSubmit rejects invalid rating", async () => {
    FeedbackWidget.open();

    const modalArgs = (openModal as any).mock.calls[0][0];
    const onSubmit = modalArgs.onSubmit;

    await expect(onSubmit({ rating: 10 })).rejects.toThrow(/rating/i);

    expect(sendFeedback).not.toHaveBeenCalled();
  });
});
