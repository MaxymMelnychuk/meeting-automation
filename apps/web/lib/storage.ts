export const STORAGE_KEYS = {
  MEETINGS: "ma_meetings",
  TASKS: "ma_tasks",
  CALENDAR: "ma_calendar_events",
} as const

function isAvailable(): boolean {
  try {
    localStorage.setItem("__ma_test__", "1")
    localStorage.removeItem("__ma_test__")
    return true
  } catch {
    return false
  }
}

const AVAILABLE = typeof window !== "undefined" && isAvailable()

export function storageGet<T>(key: string, fallback: T): T {
  if (!AVAILABLE) return fallback
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

export function storageSet<T>(key: string, value: T): void {
  if (!AVAILABLE) {
    throw new Error(
      "Local storage is unavailable in this browser. Your data cannot be saved. " +
      "Please check that you are not in private/incognito mode."
    )
  }
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (e) {
    if (e instanceof DOMException && e.name === "QuotaExceededError") {
      throw new Error("Local storage is full. Please clear some space and try again.")
    }
    throw e
  }
}

export function storageRemove(key: string): void {
  if (!AVAILABLE) return
  localStorage.removeItem(key)
}

export function storageAvailable(): boolean {
  return AVAILABLE
}
