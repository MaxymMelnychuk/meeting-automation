"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, CalendarDays, CheckCircle2, Trash2 } from "lucide-react"
import { useApp } from "../../providers/AppProvider"
import type { CalendarEvent } from "@/lib/types"

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00")
  const today = new Date().toISOString().split("T")[0]
  const tomorrow = new Date(Date.now() + 86_400_000).toISOString().split("T")[0]
  if (dateStr === today) return "Today"
  if (dateStr === tomorrow) return "Tomorrow"
  return d.toLocaleDateString("en", { weekday: "short", month: "short", day: "numeric" })
}

type EventRowProps = {
  event: CalendarEvent
  onComplete: () => void
  onDelete: () => void
}

function EventRow({ event, onComplete, onDelete }: EventRowProps) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      className="flex items-start gap-3 px-4 py-3 transition-colors"
      style={{ borderBottom: "1px solid var(--border)" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Date badge */}
      <div className="flex flex-col items-center flex-shrink-0" style={{ minWidth: 44 }}>
        <span
          className="text-[9px] font-bold uppercase tracking-wider"
          style={{ color: "var(--text-5)" }}
        >
          {formatDate(event.date)}
        </span>
        <span className="text-xs font-medium tabular-nums" style={{ color: "var(--text-3)", marginTop: 1 }}>
          {event.startTime}
        </span>
      </div>

      {/* Left accent line */}
      <div
        className="flex-shrink-0 w-px self-stretch mt-1"
        style={{ background: event.meetingId ? "rgba(74,222,128,0.3)" : "var(--border-2)" }}
      />

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p
          className="text-sm font-medium truncate"
          style={{
            color: event.completed ? "var(--text-4)" : "var(--text-1)",
            textDecoration: event.completed ? "line-through" : "none",
          }}
        >
          {event.title}
        </p>
        {event.notes && (
          <p className="text-xs truncate mt-0.5" style={{ color: "var(--text-4)" }}>
            {event.notes}
          </p>
        )}
        {event.meetingId && (
          <span
            className="inline-block px-1.5 py-0.5 rounded mt-1 font-semibold uppercase tracking-wide"
            style={{
              fontSize: 9,
              background: "rgba(74,222,128,0.07)",
              color: "#4ade80",
              border: "1px solid rgba(74,222,128,0.18)",
            }}
          >
            Recorded
          </span>
        )}
      </div>

      {/* Hover actions */}
      <AnimatePresence>
        {hovered && !event.completed && (
          <motion.div
            initial={{ opacity: 0, x: 4 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 4 }}
            className="flex items-center gap-1 flex-shrink-0"
          >
            <button
              onClick={onComplete}
              className="w-6 h-6 flex items-center justify-center rounded-md transition-colors"
              style={{ color: "#4ade80", background: "rgba(74,222,128,0.07)", border: "1px solid rgba(74,222,128,0.18)" }}
              title="Mark complete"
            >
              <CheckCircle2 size={12} />
            </button>
            <button
              onClick={onDelete}
              className="w-6 h-6 flex items-center justify-center rounded-md transition-colors"
              style={{ color: "var(--text-4)", background: "var(--surface-2)" }}
              title="Delete"
            >
              <Trash2 size={11} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export function UpcomingEvents() {
  const { upcomingEvents, addEvent, updateEvent, removeEvent, setView } = useApp()
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    title: "",
    date: new Date().toISOString().split("T")[0],
    startTime: "09:00",
    notes: "",
  })

  function handleAdd() {
    if (!form.title.trim()) return
    addEvent({
      title: form.title.trim(),
      date: form.date,
      startTime: form.startTime,
      endTime: null,
      notes: form.notes.trim() || null,
      meetingId: null,
      completed: false,
    })
    setForm({ title: "", date: new Date().toISOString().split("T")[0], startTime: "09:00", notes: "" })
    setShowForm(false)
  }

  const displayEvents = upcomingEvents.slice(0, 5)
  const extra = upcomingEvents.length - 5

  return (
    <div className="bento-card flex flex-col h-full" style={{ minHeight: 0 }}>
      {/* Header */}
      <div className="bento-card-header">
        <span className="label">Upcoming</span>
        <div className="flex items-center gap-2">
          {extra > 0 && (
            <button onClick={() => setView("calendar")} style={{ fontSize: 11, color: "var(--text-4)" }}>
              +{extra} more
            </button>
          )}
          <button
            onClick={() => setShowForm((v) => !v)}
            className="w-7 h-7 flex items-center justify-center rounded-lg transition-colors"
            style={{
              background: "var(--surface-2)",
              color: "var(--text-2)",
              border: "1px solid var(--border-2)",
            }}
            title="Add event"
          >
            <Plus size={14} />
          </button>
        </div>
      </div>

      {/* Add form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            style={{ overflow: "hidden" }}
          >
            <div
              className="px-4 py-3 flex flex-col gap-2"
              style={{ borderBottom: "1px solid var(--border)", background: "var(--surface-2)" }}
            >
              <input
                autoFocus type="text" placeholder="Event title *"
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                onKeyDown={(e) => { if (e.key === "Enter") handleAdd(); if (e.key === "Escape") setShowForm(false) }}
                className="w-full bg-transparent text-sm outline-none"
                style={{ color: "var(--text-1)", borderBottom: "1px solid var(--border-strong)", paddingBottom: 3 }}
              />
              <div className="flex gap-2">
                <input type="date" value={form.date}
                  onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                  className="flex-1 bg-transparent text-xs outline-none"
                  style={{ color: "var(--text-3)", borderBottom: "1px solid var(--border)" }} />
                <input type="time" value={form.startTime}
                  onChange={(e) => setForm((f) => ({ ...f, startTime: e.target.value }))}
                  className="bg-transparent text-xs outline-none" style={{ width: 72, color: "var(--text-3)", borderBottom: "1px solid var(--border)" }} />
              </div>
              <input type="text" placeholder="Notes (optional)" value={form.notes}
                onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                className="w-full bg-transparent text-xs outline-none"
                style={{ color: "var(--text-3)", borderBottom: "1px solid var(--border)", paddingBottom: 3 }} />
              <div className="flex justify-end gap-2 pt-1">
                <button onClick={() => setShowForm(false)} style={{ fontSize: 11, color: "var(--text-4)" }}>Cancel</button>
                <button onClick={handleAdd} className="btn-primary text-[11px] px-3 py-1">Save</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* List */}
      <div className="flex-1 overflow-y-auto">
        {displayEvents.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full py-10 px-4 text-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: "var(--surface-2)", border: "1px solid var(--border-2)" }}>
              <CalendarDays size={18} color="var(--text-4)" />
            </div>
            <p className="text-sm" style={{ color: "var(--text-4)" }}>No upcoming events</p>
            <button onClick={() => setShowForm(true)} className="text-xs underline" style={{ color: "var(--text-4)" }}>
              Add your first event
            </button>
          </div>
        ) : (
          displayEvents.map((event) => (
            <EventRow
              key={event.id}
              event={event}
              onComplete={() => updateEvent(event.id, { completed: true })}
              onDelete={() => removeEvent(event.id)}
            />
          ))
        )}
      </div>

      {/* Calendar link */}
      {upcomingEvents.length > 0 && (
        <button
          onClick={() => setView("calendar")}
          className="w-full px-4 py-2.5 text-left transition-colors flex items-center gap-1.5"
          style={{ borderTop: "1px solid var(--border)", fontSize: 11, color: "var(--text-4)" }}
        >
          <CalendarDays size={11} />
          View full calendar
        </button>
      )}
    </div>
  )
}
