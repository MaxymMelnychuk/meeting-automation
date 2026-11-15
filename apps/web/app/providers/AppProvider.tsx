"use client"

import React, { createContext, useContext, useState } from "react"
import { useMeetings } from "@/hooks/useMeetings"
import { useTasks } from "@/hooks/useTasks"
import { useCalendar } from "@/hooks/useCalendar"
import type { StoredMeeting, Task, CalendarEvent } from "@/lib/types"
import type { MeetingAnalysis } from "@/types/meeting"

type AppContextType = {
  selectedMeetingId: string | null
  openMeeting: (id: string) => void
  closeMeeting: () => void

  meetings: StoredMeeting[]
  addMeeting: (filename: string, analysis: MeetingAnalysis, transcript: string, taskIds: string[], id?: string) => StoredMeeting
  removeMeeting: (id: string) => void
  getMeeting: (id: string) => StoredMeeting | null

  tasks: Task[]
  addTasks: (tasks: Task[]) => string[]
  addTask: (task: Omit<Task, "id" | "createdAt" | "updatedAt">) => Task
  updateTask: (id: string, changes: Partial<Task>) => void
  removeTask: (id: string) => void
  approveTask: (id: string) => void
  dismissTask: (id: string) => void

  events: CalendarEvent[]
  upcomingEvents: CalendarEvent[]
  addEvent: (data: Omit<CalendarEvent, "id" | "createdAt">) => CalendarEvent
  updateEvent: (id: string, changes: Partial<CalendarEvent>) => void
  removeEvent: (id: string) => void

  isProcessing: boolean
  setIsProcessing: (v: boolean) => void
  processingError: string | null
  setProcessingError: (v: string | null) => void
}

const AppContext = createContext<AppContextType | null>(null)

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [selectedMeetingId, setSelectedMeetingId] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [processingError, setProcessingError] = useState<string | null>(null)

  const meetingHook = useMeetings()
  const taskHook = useTasks()
  const calendarHook = useCalendar()

  function removeMeeting(id: string) {
    meetingHook.removeMeeting(id)
    taskHook.removeTasksByMeeting(id)
    calendarHook.removeEventsByMeeting(id)
    if (selectedMeetingId === id) setSelectedMeetingId(null)
  }

  const value: AppContextType = {
    selectedMeetingId,
    openMeeting: (id) => setSelectedMeetingId(id),
    closeMeeting: () => setSelectedMeetingId(null),
    ...meetingHook,
    ...taskHook,
    ...calendarHook,
    removeMeeting,
    isProcessing,
    setIsProcessing,
    processingError,
    setProcessingError,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp(): AppContextType {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error("useApp must be used inside <AppProvider>")
  return ctx
}
