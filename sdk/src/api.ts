import type { FeedbackPayload, WidgetState } from "./types";

export const sendFeedback = async (
  state: WidgetState,
  payload: FeedbackPayload,
): Promise<{ id: string }> => {
  const response = await fetch(`${state.backendUrl}/feedback`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": state.apiKey,
    },
    body: JSON.stringify({
      projectId: state.projectId,
      userId: state.userId,
      ...payload,
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Feedback failed (${response.status}): ${text}`);
  }

  return response.json();
};
