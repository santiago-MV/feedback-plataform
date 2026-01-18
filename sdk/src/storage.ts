const USER_ID_KEY = "feedback_widget_user_id";

export function getOrCreateUserId(): string {
  // If storage is blocked (some browsers / privacy modes), we still want it to work.
  try {
    const existing = window.localStorage.getItem(USER_ID_KEY);
    if (existing) return existing;

    const id = safeUuid();
    window.localStorage.setItem(USER_ID_KEY, id);
    return id;
  } catch {
    // Fallback: session-only id
    return safeUuid();
  }
}

function safeUuid(): string {
  // crypto.randomUUID is widely supported, but keep fallback
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const c = crypto as any;
  if (c?.randomUUID) return c.randomUUID();

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}
