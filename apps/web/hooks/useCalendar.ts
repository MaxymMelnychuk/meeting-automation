"use client"

import { useCallback, useMemo, useSyncExternalStore } from "react"
import type { CalendarEvent } from "@/lib/types"
import { storageGet, storageSet, storageSubscribe, STORAGE_KEYS } from "@/lib/storage"

const EMPTY: CalendarEvent[] = []

function getSnapshot(): CalendarEvent[] {
  return storageGet<CalendarEvent[]>(STORAGE_KEYS.CALENDAR, EMPTY)
}

function newId(): string {
  return `evt_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`
}

function sortEvents(events: CalendarEvent[]): CalendarEvent[] {
  return [...events].sort(
    (a, b) =>
      a.date.localeCompare(b.date) || a.startTime.localeCompare(b.startTime)
  )
}

export function useCalendar() {
  const events = useSyncExternalStore(storageSubscribe, getSnapshot, () => EMPTY)

  const addEvent = useCallback(
    (data: Omit<CalendarEvent, "id" | "createdAt">): CalendarEvent => {
      const event: CalendarEvent = {
        ...data,
        id: newId(),
        createdAt: new Date().toISOString(),
      }
      storageSet(STORAGE_KEYS.CALENDAR, sortEvents([event, ...getSnapshot()]))
      return event
    },
    []
  )

  const updateEvent = useCallback((id: string, changes: Partial<CalendarEvent>) => {
    storageSet(
      STORAGE_KEYS.CALENDAR,
      sortEvents(getSnapshot().map((e) => (e.id === id ? { ...e, ...changes } : e)))
    )
  }, [])

  const removeEvent = useCallback((id: string) => {
    storageSet(
      STORAGE_KEYS.CALENDAR,
      getSnapshot().filter((e) => e.id !== id)
    )
  }, [])

  const removeEventsByMeeting = useCallback((meetingId: string) => {
    storageSet(
      STORAGE_KEYS.CALENDAR,
      getSnapshot().filter((e) => e.meetingId !== meetingId)
    )
  }, [])

  const today = new Date().toISOString().split("T")[0]

  const upcomingEvents = useMemo(
    () => events.filter((e) => !e.completed && e.date >= today),
    [events, today]
  )

  return { events, upcomingEvents, addEvent, updateEvent, removeEvent, removeEventsByMeeting }
}
