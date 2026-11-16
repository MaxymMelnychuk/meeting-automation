export const STORAGE_KEYS = {
  MEETINGS: "ma_meetings",
  TASKS: "ma_tasks",
  CALENDAR: "ma_calendar_events",
} as const

type CacheEntry = { raw: string | null; value: unknown }

const cache = new Map<string, CacheEntry>()
const listeners = new Set<() => void>()

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

function notify() {
  listeners.forEach((listener) => listener())
}

export function storageSubscribe(onStoreChange: () => void): () => void {
  listeners.add(onStoreChange)
  if (typeof window === "undefined") {
    return () => {
      listeners.delete(onStoreChange)
    }
  }

  const onStorage = (event: StorageEvent) => {
    if (event.key && !event.key.startsWith("ma_")) return
    cache.clear()
    onStoreChange()
  }

  window.addEventListener("storage", onStorage)
  return () => {
    listeners.delete(onStoreChange)
    window.removeEventListener("storage", onStorage)
  }
}

export function storageGet<T>(key: string, fallback: T): T {
  if (!AVAILABLE) return fallback
  try {
    const raw = localStorage.getItem(key)
    const cached = cache.get(key)
    if (cached && cached.raw === raw) return cached.value as T
    const value = raw ? (JSON.parse(raw) as T) : fallback
    cache.set(key, { raw, value })
    return value
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
    const raw = JSON.stringify(value)
    localStorage.setItem(key, raw)
    cache.set(key, { raw, value })
    notify()
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
  cache.delete(key)
  notify()
}

export function storageAvailable(): boolean {
  return AVAILABLE
}
