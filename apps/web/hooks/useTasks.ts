"use client"

import { useState, useCallback, useEffect } from "react"
import type { Task, TaskPriority, TaskStatus } from "@/lib/types"
import { storageGet, storageSet, STORAGE_KEYS } from "@/lib/storage"
import type { Action, MeetingAnalysis } from "@/types/meeting"

function load(): Task[] {
  return storageGet<Task[]>(STORAGE_KEYS.TASKS, [])
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
  const [tasks, setTasks] = useState<Task[]>([])

  useEffect(() => {
    setTasks(load())
  }, [])

  function persist(updated: Task[]) {
    setTasks(updated)
    storageSet(STORAGE_KEYS.TASKS, updated)
  }

  const addTasks = useCallback((newTasks: Task[]): string[] => {
    setTasks((prev) => {
      const updated = [...newTasks, ...prev]
      storageSet(STORAGE_KEYS.TASKS, updated)
      return updated
    })
    return newTasks.map((t) => t.id)
  }, [])

  const addTask = useCallback(
    (task: Omit<Task, "id" | "createdAt" | "updatedAt">): Task => {
      const now = new Date().toISOString()
      const full: Task = { ...task, id: newId(), createdAt: now, updatedAt: now }
      setTasks((prev) => {
        const updated = [full, ...prev]
        storageSet(STORAGE_KEYS.TASKS, updated)
        return updated
      })
      return full
    },
    []
  )

  const updateTask = useCallback((id: string, changes: Partial<Task>) => {
    setTasks((prev) => {
      const updated = prev.map((t) =>
        t.id === id
          ? { ...t, ...changes, updatedAt: new Date().toISOString() }
          : t
      )
      storageSet(STORAGE_KEYS.TASKS, updated)
      return updated
    })
  }, [])

  const removeTask = useCallback((id: string) => {
    setTasks((prev) => {
      const updated = prev.filter((t) => t.id !== id)
      storageSet(STORAGE_KEYS.TASKS, updated)
      return updated
    })
  }, [])

  const removeTasksByMeeting = useCallback((meetingId: string) => {
    setTasks((prev) => {
      const updated = prev.filter((t) => t.meetingId !== meetingId)
      storageSet(STORAGE_KEYS.TASKS, updated)
      return updated
    })
  }, [])

  const approveTask = useCallback((id: string) => {
    setTasks((prev) => {
      const updated = prev.map((t) =>
        t.id === id
          ? { ...t, status: "approved" as TaskStatus, updatedAt: new Date().toISOString() }
          : t
      )
      storageSet(STORAGE_KEYS.TASKS, updated)
      return updated
    })
  }, [])

  const dismissTask = useCallback((id: string) => {
    setTasks((prev) => {
      const updated = prev.map((t) =>
        t.id === id
          ? { ...t, status: "dismissed" as TaskStatus, updatedAt: new Date().toISOString() }
          : t
      )
      storageSet(STORAGE_KEYS.TASKS, updated)
      return updated
    })
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
