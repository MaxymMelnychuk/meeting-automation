"use client"

import { useState, useCallback, useMemo, useEffect } from "react"
import type { CalendarEvent } from "@/lib/types"
import { storageGet, storageSet, STORAGE_KEYS } from "@/lib/storage"

function load(): CalendarEvent[] {
  return storageGet<CalendarEvent[]>(STORAGE_KEYS.CALENDAR, [])
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
  const [events, setEvents] = useState<CalendarEvent[]>([])

  useEffect(() => {
    setEvents(sortEvents(load()))
  }, [])

  const addEvent = useCallback(
    (data: Omit<CalendarEvent, "id" | "createdAt">): CalendarEvent => {
      const event: CalendarEvent = {
        ...data,
        id: newId(),
        createdAt: new Date().toISOString(),
      }
      setEvents((prev) => {
        const updated = sortEvents([event, ...prev])
        storageSet(STORAGE_KEYS.CALENDAR, updated)
        return updated
      })
      return event
    },
    []
  )

  const updateEvent = useCallback((id: string, changes: Partial<CalendarEvent>) => {
    setEvents((prev) => {
      const updated = sortEvents(
        prev.map((e) => (e.id === id ? { ...e, ...changes } : e))
      )
      storageSet(STORAGE_KEYS.CALENDAR, updated)
      return updated
    })
  }, [])

  const removeEvent = useCallback((id: string) => {
    setEvents((prev) => {
      const updated = prev.filter((e) => e.id !== id)
      storageSet(STORAGE_KEYS.CALENDAR, updated)
      return updated
    })
  }, [])

  const removeEventsByMeeting = useCallback((meetingId: string) => {
    setEvents((prev) => {
      const updated = prev.filter((e) => e.meetingId !== meetingId)
      storageSet(STORAGE_KEYS.CALENDAR, updated)
      return updated
    })
  }, [])

  const today = new Date().toISOString().split("T")[0]

  const upcomingEvents = useMemo(
    () => events.filter((e) => !e.completed && e.date >= today),
    [events, today]
  )

  return { events, upcomingEvents, addEvent, updateEvent, removeEvent, removeEventsByMeeting }
}
