import { RepoErrorCode } from "../types";

export class RepoError extends Error {
  constructor(
    public readonly code: RepoErrorCode,
    message: string,
    public readonly cause?: unknown
  ) {
    super(message);
    this.name = "RepoError";
  }
}

export const mapDbError = (err: unknown): RepoError => {
  const msg = err instanceof Error ? err.message : String(err);

  if (msg.includes("SQLITE_BUSY") || msg.toLowerCase().includes("database is locked")) {
    return new RepoError("DB_LOCKED", "Database is temporarily unavailable", err);
  }

  if (msg.includes("SQLITE_CONSTRAINT")) {
    return new RepoError("CONSTRAINT_VIOLATION", "Constraint violation", err);
  }

  return new RepoError("UNKNOWN_DB_ERROR", "Database error", err);
};
