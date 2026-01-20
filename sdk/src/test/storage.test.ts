import { describe, it, expect, vi, beforeEach } from "vitest";
import { getOrCreateUserId } from "../storage";

describe("storage.getOrCreateUserId", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("returns existing id if present", () => {
    localStorage.setItem("feedback_widget_user_id", "persisted-1");
    expect(getOrCreateUserId()).toBe("persisted-1");
  });

  it("creates and persists a new id if not present", () => {
    const id = getOrCreateUserId();
    expect(id).toBe("uuid-123");
    expect(localStorage.getItem("feedback_widget_user_id")).toBe("uuid-123");
  });

  it("falls back if localStorage throws (should be stable per session)", () => {
    const getSpy = vi
      .spyOn(Storage.prototype, "getItem")
      .mockImplementation(() => {
        throw new Error("blocked");
      });

    const id1 = getOrCreateUserId();
    const id2 = getOrCreateUserId();

    expect(id1).toBe(id2); // this will FAIL until you add memory cache fallback
    getSpy.mockRestore();
  });
});
