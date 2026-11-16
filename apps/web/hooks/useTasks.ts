"use client"

import { useCallback, useSyncExternalStore } from "react"
import type { Task, TaskPriority, TaskStatus } from "@/lib/types"
import { storageGet, storageSet, storageSubscribe, STORAGE_KEYS } from "@/lib/storage"
import type { Action, MeetingAnalysis } from "@/types/meeting"

const EMPTY: Task[] = []

function getSnapshot(): Task[] {
  return storageGet<Task[]>(STORAGE_KEYS.TASKS, EMPTY)
}

function newId(): string {
  return `task_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`
}

function assignPriority(action: Action): TaskPriority {
  if (action.deadline) {
    try {
      const hoursUntil =
        (new Date(action.deadline).getTime() - Date.now()) / 3_600_000
      if (hoursUntil < 48) return "critical"
      if (hoursUntil < 168) return "high"
    } catch {
      // unparseable date — fall through
    }
  }
  if (action.assignee && action.deadline) return "high"
  if (action.assignee || action.deadline) return "medium"
  return "low"
}

export function generateTasksFromMeeting(
  analysis: MeetingAnalysis,
  meetingId: string,
  meetingName: string
): Task[] {
  const now = new Date().toISOString()
  const tasks: Task[] = []

  for (const action of analysis.actions) {
    const isExplicit = action.certainty === "explicit"
    const hasAssignee = action.assignee !== null
    const hasDeadline = action.deadline !== null

    let confidence: Task["confidence"]
    let reason: string

    if (isExplicit && hasAssignee && hasDeadline) {
      confidence = "confirmed"
      reason = "Explicitly stated in the meeting with a clear owner and deadline."
    } else if (!isExplicit) {
      confidence = "needs_review"
      reason = "Inferred from context — verify this is an actual requirement."
    } else if (!hasAssignee && !hasDeadline) {
      confidence = "needs_review"
      reason = "Clearly stated but missing both owner and deadline."
    } else if (!hasAssignee) {
      confidence = "needs_review"
      reason = "No owner identified — assign this task before it gets lost."
    } else {
      confidence = "needs_review"
      reason = "No deadline mentioned — set a due date to track progress."
    }

    tasks.push({
      id: newId(),
      meetingId,
      meetingName,
      description: action.description,
      assignee: action.assignee,
      deadline: action.deadline,
      priority: assignPriority(action),
      status: "pending",
      confidence,
      reason,
      isAISuggested: true,
      createdAt: now,
      updatedAt: now,
    })
  }

  for (const problem of analysis.problems) {
    tasks.push({
      id: newId(),
      meetingId,
      meetingName,
      description: problem.description,
      assignee: null,
      deadline: null,
      priority: "high",
      status: "pending",
      confidence: "unresolved",
      reason: "This issue was raised but not resolved during the meeting.",
      isAISuggested: true,
      createdAt: now,
      updatedAt: now,
    })
  }

  return tasks
}

export function useTasks() {
  const tasks = useSyncExternalStore(storageSubscribe, getSnapshot, () => EMPTY)

  const addTasks = useCallback((newTasks: Task[]): string[] => {
    storageSet(STORAGE_KEYS.TASKS, [...newTasks, ...getSnapshot()])
    return newTasks.map((t) => t.id)
  }, [])

  const addTask = useCallback(
    (task: Omit<Task, "id" | "createdAt" | "updatedAt">): Task => {
      const now = new Date().toISOString()
      const full: Task = { ...task, id: newId(), createdAt: now, updatedAt: now }
      storageSet(STORAGE_KEYS.TASKS, [full, ...getSnapshot()])
      return full
    },
    []
  )

  const updateTask = useCallback((id: string, changes: Partial<Task>) => {
    storageSet(
      STORAGE_KEYS.TASKS,
      getSnapshot().map((t) =>
        t.id === id
          ? { ...t, ...changes, updatedAt: new Date().toISOString() }
          : t
      )
    )
  }, [])

  const removeTask = useCallback((id: string) => {
    storageSet(
      STORAGE_KEYS.TASKS,
      getSnapshot().filter((t) => t.id !== id)
    )
  }, [])

  const removeTasksByMeeting = useCallback((meetingId: string) => {
    storageSet(
      STORAGE_KEYS.TASKS,
      getSnapshot().filter((t) => t.meetingId !== meetingId)
    )
  }, [])

  const approveTask = useCallback((id: string) => {
    storageSet(
      STORAGE_KEYS.TASKS,
      getSnapshot().map((t) =>
        t.id === id
          ? { ...t, status: "approved" as TaskStatus, updatedAt: new Date().toISOString() }
          : t
      )
    )
  }, [])

  const dismissTask = useCallback((id: string) => {
    storageSet(
      STORAGE_KEYS.TASKS,
      getSnapshot().map((t) =>
        t.id === id
          ? { ...t, status: "dismissed" as TaskStatus, updatedAt: new Date().toISOString() }
          : t
      )
    )
  }, [])

  return {
    tasks,
    addTasks,
    addTask,
    updateTask,
    removeTask,
    removeTasksByMeeting,
    approveTask,
    dismissTask,
  }
}
