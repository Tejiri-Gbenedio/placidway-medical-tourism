let memorySessionId: string | null = null;

function generateUUID(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

const STORAGE_KEY = "clarity_assistant_session_id";

export function getOrCreateSessionId(): string {
  if (typeof window === "undefined") {
    return generateUUID();
  }

  try {
    const existing = window.localStorage.getItem(STORAGE_KEY);
    if (existing && existing.length > 5) {
      return existing;
    }
    const fresh = generateUUID();
    window.localStorage.setItem(STORAGE_KEY, fresh);
    return fresh;
  } catch {
    // LocalStorage blocked (private mode or sandbox)
    if (!memorySessionId) {
      memorySessionId = generateUUID();
    }
    return memorySessionId;
  }
}

export function resetSessionId(): string {
  const fresh = generateUUID();
  memorySessionId = fresh;
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(STORAGE_KEY, fresh);
    } catch {
      // ignore
    }
  }
  return fresh;
}
