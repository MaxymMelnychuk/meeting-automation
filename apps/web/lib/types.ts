import type { MeetingAnalysis } from "@/types/meeting"

export type TaskPriority = "critical" | "high" | "medium" | "low"
export type TaskStatus = "pending" | "approved" | "in_progress" | "done" | "dismissed"
export type TaskConfidence = "confirmed" | "needs_review" | "unresolved"

export type Task = {
  id: string
  meetingId: string | null
  meetingName: string | null
  description: string
  assignee: string | null
  deadline: string | null
  priority: TaskPriority
  status: TaskStatus
  confidence: TaskConfidence
  reason: string
  isAISuggested: boolean
  createdAt: string
  updatedAt: string
}

export type StoredMeeting = {
  id: string
  filename: string
  uploadedAt: string
  analysis: MeetingAnalysis
  transcript: string
  taskIds: string[]
}

export type CalendarEvent = {
  id: string
  title: string
  date: string       // "YYYY-MM-DD"
  startTime: string  // "HH:MM"
  endTime: string | null
  notes: string | null
  meetingId: string | null
  completed: boolean
  createdAt: string
}
