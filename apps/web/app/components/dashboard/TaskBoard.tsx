"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, Sparkles, Trash2 } from "lucide-react"
import { useApp } from "../../providers/AppProvider"
import { ConfidenceBadge } from "../meeting/ConfidenceBadge"
import { Button, btn } from "../ui/Button"
import type { Task, TaskPriority } from "@/lib/types"
import clsx from "clsx"

const PRIORITY: Record<TaskPriority, string> = {
  critical: "text-red-400",
  high: "text-orange-400",
  medium: "text-yellow-400",
  low: "text-fg-4",
}

type Tab = "suggested" | "active" | "done"

type TaskCardProps = {
  task: Task
  onApprove?: () => void
  onDismiss?: () => void
  onUpdate?: (changes: Partial<Task>) => void
  onDelete?: () => void
  onOpenMeeting?: () => void
}

function TaskCard({ task, onApprove, onDismiss, onUpdate, onDelete, onOpenMeeting }: TaskCardProps) {
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({
    description: task.description,
    assignee: task.assignee ?? "",
    deadline: task.deadline ?? "",
    priority: task.priority,
  })

  const isSuggested = task.isAISuggested && task.status === "pending"
  const isDone = task.status === "done" || task.status === "dismissed"

  function saveEdit() {
    onUpdate?.({
      description: form.description.trim() || task.description,
      assignee: form.assignee.trim() || null,
      deadline: form.deadline.trim() || null,
      priority: form.priority,
    })
    setEditing(false)
  }

  if (editing) {
    return (
      <div className="flex flex-col gap-3 rounded-xl border border-white/10 bg-surface-2 p-4">
        <textarea
          value={form.description}
          onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
          className="w-full resize-none rounded-lg border border-line-2 bg-transparent px-3 py-2 text-sm text-fg outline-none focus:border-line-strong"
          rows={2}
        />
        <div className="grid grid-cols-3 gap-3">
          <label className="flex flex-col gap-1 text-[11px] font-medium text-fg-3">
            Assignee
            <input
              type="text"
              placeholder="Name"
              value={form.assignee}
              onChange={(e) => setForm((f) => ({ ...f, assignee: e.target.value }))}
              className="h-8 rounded-lg border border-line-2 bg-transparent px-2 text-xs text-fg-2 outline-none focus:border-line-strong"
            />
          </label>
          <label className="flex flex-col gap-1 text-[11px] font-medium text-fg-3">
            Deadline
            <input
              type="text"
              placeholder="e.g. Oct 15"
              value={form.deadline}
              onChange={(e) => setForm((f) => ({ ...f, deadline: e.target.value }))}
              className="h-8 rounded-lg border border-line-2 bg-transparent px-2 text-xs text-fg-2 outline-none focus:border-line-strong"
            />
          </label>
          <label className="flex flex-col gap-1 text-[11px] font-medium text-fg-3">
            Priority
            <select
              value={form.priority}
              onChange={(e) => setForm((f) => ({ ...f, priority: e.target.value as TaskPriority }))}
              className="h-8 rounded-lg border border-line-2 bg-bg px-2 text-xs text-fg-2 outline-none focus:border-line-strong"
            >
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </label>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={() => setEditing(false)}>Cancel</Button>
          <Button variant="primary" onClick={saveEdit}>Save</Button>
        </div>
      </div>
    )
  }

  return (
    <div className={clsx("flex items-start gap-3 py-5", isDone && "opacity-45")}>
      {!isSuggested && (
        <button
          type="button"
          onClick={() => onUpdate?.({ status: task.status === "done" ? "approved" : "done" })}
          aria-label={task.status === "done" ? "Mark not done" : "Mark done"}
          className={clsx(
            "mt-0.5 flex size-6 shrink-0 cursor-pointer items-center justify-center rounded-md border text-[11px] font-bold transition-all hover:border-white/50 hover:bg-white/10",
            task.status === "done" ? "border-white/50 bg-white/15 text-fg" : "border-white/30 text-transparent"
          )}
        >
          ✓
        </button>
      )}

      <div className="min-w-0 flex-1">
        <p className={clsx("text-sm leading-snug font-medium text-white", task.status === "done" && "text-fg-4 line-through")}>
          {task.description}
        </p>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <span className={clsx("rounded-md bg-white/8 px-1.5 py-0.5 text-[10px] font-semibold tracking-wider uppercase", PRIORITY[task.priority])}>
            {task.priority}
          </span>
          {task.assignee && <span className="text-xs text-fg-3">→ {task.assignee}</span>}
          {task.deadline && <span className="text-xs text-fg-3">· {task.deadline}</span>}
          {task.meetingName && onOpenMeeting && (
            <button type="button" onClick={onOpenMeeting} className={clsx(btn.outline, "h-7 px-2.5 text-[11px]")}>
              Open meeting
            </button>
          )}
        </div>
        {isSuggested && (
          <div className="mt-2">
            <ConfidenceBadge confidence={task.confidence} reason={task.reason} size="sm" />
          </div>
        )}
      </div>

      <div className="flex shrink-0 flex-wrap items-center justify-end gap-2">
        {isSuggested && (
          <>
            <Button variant="primary" onClick={onApprove}>Approve</Button>
            <Button variant="outline" onClick={onDismiss}>Dismiss</Button>
          </>
        )}
        {!isSuggested && !isDone && (
          <Button variant="outline" onClick={() => setEditing(true)}>Edit</Button>
        )}
        <Button variant="icon" className="size-10" onClick={onDelete} aria-label="Delete task">
          <Trash2 size={14} />
        </Button>
      </div>
    </div>
  )
}

type Props = { fullPage?: boolean }

export function TaskBoard({ fullPage = false }: Props) {
  const { tasks, approveTask, dismissTask, updateTask, removeTask, addTask, openMeeting, getMeeting } = useApp()

  const [tab, setTab] = useState<Tab>("suggested")
  const [showAdd, setShowAdd] = useState(false)
  const [newTask, setNewTask] = useState({
    description: "",
    assignee: "",
    deadline: "",
    priority: "medium" as TaskPriority,
  })

  const suggested = tasks.filter((t) => t.status === "pending" && t.isAISuggested)
  const active = tasks.filter((t) =>
    t.status === "approved" || t.status === "in_progress" ||
    (t.status === "pending" && !t.isAISuggested)
  )
  const done = tasks.filter((t) => t.status === "done" || t.status === "dismissed")

  const tabTasks = tab === "suggested" ? suggested : tab === "active" ? active : done

  function handleAddTask() {
    if (!newTask.description.trim()) return
    addTask({
      description: newTask.description.trim(),
      assignee: newTask.assignee.trim() || null,
      deadline: newTask.deadline.trim() || null,
      priority: newTask.priority,
      status: "approved",
      confidence: "confirmed",
      reason: "Manually created task.",
      isAISuggested: false,
      meetingId: null,
      meetingName: null,
    })
    setNewTask({ description: "", assignee: "", deadline: "", priority: "medium" })
    setShowAdd(false)
    setTab("active")
  }

  const TABS: { id: Tab; label: string; count: number }[] = [
    { id: "suggested", label: "Suggested", count: suggested.length },
    { id: "active", label: "Active", count: active.length },
    { id: "done", label: "Done", count: done.length },
  ]

  return (
    <div className="flex flex-col">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex rounded-xl border border-white/20 bg-white/[0.04] p-1">
          {TABS.map(({ id, label, count }) => (
            <button
              key={id}
              type="button"
              onClick={() => setTab(id)}
              className={clsx(
                "inline-flex h-10 cursor-pointer items-center gap-1.5 rounded-lg px-3.5 text-[13px] font-semibold transition-all",
                tab === id
                  ? "bg-white text-black"
                  : "text-fg-3 hover:bg-white/10 hover:text-white"
              )}
            >
              {id === "suggested" && <Sparkles size={13} />}
              {label}
              {count > 0 && (
                <span className={clsx("min-w-4 text-center text-[11px] font-semibold", tab === id ? "text-black/55" : "text-fg-3")}>
                  {count}
                </span>
              )}
            </button>
          ))}
        </div>
        <Button variant="primary" onClick={() => setShowAdd((v) => !v)}>
          <Plus size={14} />
          Add task
        </Button>
      </div>

      <AnimatePresence>
        {showAdd && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="mb-4 flex flex-col gap-3 rounded-2xl border border-white/12 bg-surface p-5">
              <input
                autoFocus
                type="text"
                placeholder="Task description"
                value={newTask.description}
                onChange={(e) => setNewTask((f) => ({ ...f, description: e.target.value }))}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleAddTask()
                  if (e.key === "Escape") setShowAdd(false)
                }}
                className="h-10 w-full rounded-lg border border-line-2 bg-transparent px-3 text-sm text-fg outline-none placeholder:text-fg-4 focus:border-line-strong"
              />
              <div className="grid grid-cols-3 gap-3">
                <input
                  type="text"
                  placeholder="Assignee"
                  value={newTask.assignee}
                  onChange={(e) => setNewTask((f) => ({ ...f, assignee: e.target.value }))}
                  className="h-8 rounded-lg border border-line-2 bg-transparent px-2 text-xs text-fg-2 outline-none placeholder:text-fg-4 focus:border-line-strong"
                />
                <input
                  type="text"
                  placeholder="Deadline"
                  value={newTask.deadline}
                  onChange={(e) => setNewTask((f) => ({ ...f, deadline: e.target.value }))}
                  className="h-8 rounded-lg border border-line-2 bg-transparent px-2 text-xs text-fg-2 outline-none placeholder:text-fg-4 focus:border-line-strong"
                />
                <select
                  value={newTask.priority}
                  onChange={(e) => setNewTask((f) => ({ ...f, priority: e.target.value as TaskPriority }))}
                  className="h-8 rounded-lg border border-line-2 bg-bg px-2 text-xs text-fg-2 outline-none focus:border-line-strong"
                >
                  <option value="critical">Critical</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="ghost" onClick={() => setShowAdd(false)}>Cancel</Button>
                <Button variant="primary" onClick={handleAddTask}>Add</Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className={clsx("rounded-2xl border border-white/12 bg-surface px-5", fullPage && "min-h-64")}>
        {tabTasks.length === 0 ? (
          <p className="py-12 text-center text-sm text-fg-3">
            {tab === "suggested"
              ? "No AI suggestions yet. Process a meeting to generate tasks."
              : tab === "active"
                ? "No active tasks. Add one or approve suggested tasks."
                : "No completed tasks yet."}
          </p>
        ) : (
          <div className="divide-y divide-line">
            {tabTasks.map((task) => {
              const linkedMeeting = task.meetingId ? getMeeting(task.meetingId) : null
              return (
                <TaskCard
                  key={task.id}
                  task={task}
                  onApprove={() => approveTask(task.id)}
                  onDismiss={() => dismissTask(task.id)}
                  onUpdate={(changes) => updateTask(task.id, changes)}
                  onDelete={() => removeTask(task.id)}
                  onOpenMeeting={linkedMeeting ? () => openMeeting(linkedMeeting.id) : undefined}
                />
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
