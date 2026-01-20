import type { WidgetState, WidgetInitOptions } from "./types";
import { openModal } from "./modal";
import { sendFeedback } from "./api";
import { getOrCreateUserId } from "./storage";

const DEFAULT_BACKEND_URL = "http://localhost:3001";

let state: WidgetState | null = null;

export const FeedbackWidget = {
  init(options: WidgetInitOptions) {
    if (!options.projectId?.trim()) throw new Error("projectId is required");
    if (!options.apiKey?.trim()) throw new Error("apiKey is required");

    const backendUrl = (
      options.backendUrl?.trim() || DEFAULT_BACKEND_URL
    ).replace(/\/+$/, "");

    state = {
      userId: getOrCreateUserId(),
      projectId: options.projectId.trim(),
      apiKey: options.apiKey.trim(),
      backendUrl,
    };

    return { userId: state.userId };
  },

  open() {
    if (!state)
      throw new Error(
        "Widget not initialized. Call FeedbackWidget.init() first.",
      );

    openModal({
      onSubmit: async ({ rating, comment }) => {
        // minimal validation (optional)
        if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
          throw new Error("rating must be an integer between 1 and 5");
        }

        await sendFeedback(state!, {
          rating,
          comment: comment ?? null,
          timestamp: new Date().toISOString(),
        });
      },
    });
  },
  submitFeedback: async (payload: {
    rating: number;
    comment?: string | null;
  }) => {
    if (!state)
      throw new Error(
        "Widget not initialized. Call FeedbackWidget.init() first.",
      );

    // minimal validation (optional)
    if (
      !Number.isInteger(payload.rating) ||
      payload.rating < 1 ||
      payload.rating > 5
    ) {
      throw new Error("rating must be an integer between 1 and 5");
    }

    return await sendFeedback(state, {
      rating: payload.rating,
      comment: payload.comment ?? null,
      timestamp: new Date().toISOString(),
    });
  },
};
