"use client"

import { useState, useCallback, useEffect } from "react"
import type { StoredMeeting } from "@/lib/types"
import { storageGet, storageSet, STORAGE_KEYS } from "@/lib/storage"
import type { MeetingAnalysis } from "@/types/meeting"

const MAX_MEETINGS = 20

function load(): StoredMeeting[] {
  return storageGet<StoredMeeting[]>(STORAGE_KEYS.MEETINGS, [])
}

export function useMeetings() {
  const [meetings, setMeetings] = useState<StoredMeeting[]>([])

  useEffect(() => {
    setMeetings(load())
  }, [])

  const addMeeting = useCallback(
    (
      filename: string,
      analysis: MeetingAnalysis,
      transcript: string,
      taskIds: string[],
      id?: string
    ): StoredMeeting => {
      const meeting: StoredMeeting = {
        id: id ?? `meeting_${Date.now()}`,
        filename,
        uploadedAt: new Date().toISOString(),
        analysis,
        transcript,
        taskIds,
      }
      setMeetings((prev) => {
        const updated = [meeting, ...prev].slice(0, MAX_MEETINGS)
        storageSet(STORAGE_KEYS.MEETINGS, updated)
        return updated
      })
      return meeting
    },
    []
  )

  const removeMeeting = useCallback((id: string) => {
    setMeetings((prev) => {
      const updated = prev.filter((m) => m.id !== id)
      storageSet(STORAGE_KEYS.MEETINGS, updated)
      return updated
    })
  }, [])

  const getMeeting = useCallback(
    (id: string) => meetings.find((m) => m.id === id) ?? null,
    [meetings]
  )

  return { meetings, addMeeting, removeMeeting, getMeeting }
}
