"use client"

import { useCallback, useSyncExternalStore } from "react"
import type { StoredMeeting } from "@/lib/types"
import { storageGet, storageSet, storageSubscribe, STORAGE_KEYS } from "@/lib/storage"
import type { MeetingAnalysis } from "@/types/meeting"

const MAX_MEETINGS = 20
const EMPTY: StoredMeeting[] = []

function getSnapshot(): StoredMeeting[] {
  return storageGet<StoredMeeting[]>(STORAGE_KEYS.MEETINGS, EMPTY)
}

export function useMeetings() {
  const meetings = useSyncExternalStore(storageSubscribe, getSnapshot, () => EMPTY)

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
      const updated = [meeting, ...getSnapshot()].slice(0, MAX_MEETINGS)
      storageSet(STORAGE_KEYS.MEETINGS, updated)
      return meeting
    },
    []
  )

  const removeMeeting = useCallback((id: string) => {
    storageSet(
      STORAGE_KEYS.MEETINGS,
      getSnapshot().filter((m) => m.id !== id)
    )
  }, [])

  const getMeeting = useCallback(
    (id: string) => meetings.find((m) => m.id === id) ?? null,
    [meetings]
  )

  return { meetings, addMeeting, removeMeeting, getMeeting }
}
