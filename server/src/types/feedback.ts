export interface Feedback {
  id: string;
  projectId: string;
  userId: string;
  rating: number;
  comment: string | null;
  timestamp: string;
}

export interface FeedbackRepo {
  create(feedback: NewFeedback): Promise<string>;
}

export type SubmitResult =
  | { ok: true; id: string }
  | { ok: false; code: "INVALID_RATING" | "MISSING_FIELDS" };

export type RepoErrorCode =
  | "DB_LOCKED"
  | "CONSTRAINT_VIOLATION"
  | "UNKNOWN_DB_ERROR";

export type NewFeedback = Omit<Feedback, "id">;
