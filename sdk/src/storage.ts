const USER_ID_KEY = "feedback_widget_user_id";

let memoryUserId: string | null = null;

export function getOrCreateUserId(): string {
  try {
    const existing = window.localStorage.getItem(USER_ID_KEY);
    if (existing) return existing;

    const id = safeUuid();
    window.localStorage.setItem(USER_ID_KEY, id);
    return id;
  } catch {
    if (memoryUserId) return memoryUserId;

    memoryUserId = safeUuid();
    return memoryUserId;
  }
}

function safeUuid(): string {
  const c = crypto as Crypto | undefined;
  if (c?.randomUUID) return c.randomUUID();

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}
