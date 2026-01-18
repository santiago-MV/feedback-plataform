import type { NewFeedback, FeedbackRepo, SubmitResult } from "../types";

type Clock = { nowISO(): string };

const submitFeedback = async (repo: FeedbackRepo, clock: Clock, dto: NewFeedback): Promise<SubmitResult> => {
  if (!dto?.projectId || !dto?.userId) {
      return { ok: false, code: "MISSING_FIELDS" };
    }
    if (typeof dto.rating !== "number" || !Number.isInteger(dto.rating) || dto.rating < 1 || dto.rating > 5) {
      return { ok: false, code: "INVALID_RATING" };
    }

    const newFeedback: NewFeedback = {
      projectId: dto.projectId,
      userId: dto.userId,
      rating: dto.rating,
      comment: dto.comment ?? null,
      timestamp: dto.timestamp ?? clock.nowISO(),
    };

    const id = await repo.create(newFeedback);
    return { ok: true, id };
}

export const newFeedbackService = (repo: FeedbackRepo, clock: Clock) => {
  return {
    submitFeedback: (dto: NewFeedback) => submitFeedback(repo, clock, dto),
  };
};
