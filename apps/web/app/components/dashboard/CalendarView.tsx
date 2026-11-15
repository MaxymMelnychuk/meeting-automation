"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, CalendarDays, Check, Trash2 } from "lucide-react"
import { useApp } from "../../providers/AppProvider"
import { Button } from "../ui/Button"
import { PageHeader, SectionHeader } from "../ui/PageHeader"
import type { CalendarEvent } from "@/lib/types"
import clsx from "clsx"

function formatHeading(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00")
  const today = new Date().toISOString().split("T")[0]
  const tomorrow = new Date(Date.now() + 86_400_000).toISOString().split("T")[0]
  if (dateStr === today) return "Today"
  if (dateStr === tomorrow) return "Tomorrow"
  return d.toLocaleDateString("en", { weekday: "long", month: "long", day: "numeric" })
}

function groupByDate(events: CalendarEvent[]): Record<string, CalendarEvent[]> {
  return events.reduce<Record<string, CalendarEvent[]>>((acc, ev) => {
    ;(acc[ev.date] ??= []).push(ev)
    return acc
  }, {})
}

export function CalendarView() {
  const { events, addEvent, updateEvent, removeEvent } = useApp()
  const [showAdd, setShowAdd] = useState(false)
  const [filter, setFilter] = useState<"upcoming" | "all">("upcoming")
  const [form, setForm] = useState({
    title: "",
    date: new Date().toISOString().split("T")[0],
    startTime: "09:00",
    endTime: "",
    notes: "",
  })

  const today = new Date().toISOString().split("T")[0]

  const filtered =
    filter === "upcoming"
      ? events.filter((e) => !e.completed && e.date >= today)
      : events

  const grouped = groupByDate(filtered)
  const sortedDates = Object.keys(grouped).sort()

  function handleAdd() {
    if (!form.title.trim()) return
    addEvent({
      title: form.title.trim(),
      date: form.date,
      startTime: form.startTime,
      endTime: form.endTime.trim() || null,
      notes: form.notes.trim() || null,
      meetingId: null,
      completed: false,
    })
    setForm({ title: "", date: today, startTime: "09:00", endTime: "", notes: "" })
    setShowAdd(false)
  }

  return (
    <div className="mx-auto max-w-[680px]">
      <PageHeader
        title="Schedule"
        subtitle={`${events.length} events total`}
        action={
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex rounded-xl border border-white/20 bg-white/[0.04] p-1">
              {(["upcoming", "all"] as const).map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setFilter(f)}
                  className={clsx(
                    "h-10 cursor-pointer rounded-lg px-3.5 text-[13px] font-semibold capitalize transition-all",
                    filter === f ? "bg-white text-black" : "text-fg-3 hover:bg-white/10 hover:text-white"
                  )}
                >
                  {f}
                </button>
              ))}
            </div>
            <Button variant="primary" onClick={() => setShowAdd((v) => !v)}>
              <Plus size={14} />
              New event
            </Button>
          </div>
        }
      />

      <AnimatePresence>
        {showAdd && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="mb-8 flex flex-col gap-3 rounded-2xl border border-white/12 bg-surface p-5"
          >
            <h2 className="text-lg font-semibold text-white">New event</h2>
            <input
              autoFocus
              type="text"
              placeholder="Title"
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleAdd()
                if (e.key === "Escape") setShowAdd(false)
              }}
              className="h-10 w-full rounded-lg border border-line-2 bg-transparent px-3 text-sm text-fg outline-none placeholder:text-fg-4 focus:border-line-strong"
            />
            <div className="grid grid-cols-2 gap-4">
              <label className="flex flex-col gap-1 text-[11px] font-medium text-fg-3">
                Date
                <input
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                  className="h-9 rounded-lg border border-line-2 bg-transparent px-2 text-sm text-fg-2 outline-none focus:border-line-strong"
                />
              </label>
              <label className="flex flex-col gap-1 text-[11px] font-medium text-fg-3">
                Start time
                <input
                  type="time"
                  value={form.startTime}
                  onChange={(e) => setForm((f) => ({ ...f, startTime: e.target.value }))}
                  className="h-9 rounded-lg border border-line-2 bg-transparent px-2 text-sm text-fg-2 outline-none focus:border-line-strong"
                />
              </label>
            </div>
            <label className="flex flex-col gap-1 text-[11px] font-medium text-fg-3">
              Notes (optional)
              <input
                type="text"
                placeholder="Add notes…"
                value={form.notes}
                onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                className="h-9 w-full rounded-lg border border-line-2 bg-transparent px-3 text-sm text-fg-2 outline-none placeholder:text-fg-4 focus:border-line-strong"
              />
            </label>
            <div className="flex justify-end gap-2 pt-1">
              <Button variant="ghost" onClick={() => setShowAdd(false)}>Cancel</Button>
              <Button variant="primary" onClick={handleAdd}>Save event</Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {sortedDates.length === 0 && (
        <div className="rounded-2xl border border-white/12 bg-surface px-6 py-16 text-center">
          <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-xl border border-white/20 bg-white/8 text-fg-2">
            <CalendarDays size={20} />
          </div>
          <p className="text-sm font-semibold text-white">No events scheduled</p>
          <Button variant="primary" className="mt-5" onClick={() => setShowAdd(true)}>
            Add your first event
          </Button>
        </div>
      )}

      <div className="flex flex-col gap-8">
        {sortedDates.map((date) => (
          <section key={date}>
            <SectionHeader title={formatHeading(date)} />
            <div className="overflow-hidden rounded-2xl border border-white/12 bg-surface">
              {grouped[date].map((ev, i) => {
                const isLast = i === grouped[date].length - 1
                return (
                  <div
                    key={ev.id}
                    className={clsx("flex items-start gap-4 px-5 py-4", !isLast && "border-b border-white/8")}
                  >
                    <div className="w-14 shrink-0 pt-0.5 text-right">
                      <p className="text-xs font-semibold tabular-nums text-white">{ev.startTime}</p>
                      {ev.endTime && <p className="text-[10px] text-fg-4">{ev.endTime}</p>}
                    </div>
                    <div className={clsx("mt-1 w-px self-stretch", ev.meetingId ? "bg-white/30" : "bg-white/10")} />
                    <div className="min-w-0 flex-1">
                      <p className={clsx("text-sm font-semibold text-white", ev.completed && "text-fg-4 line-through")}>
                        {ev.title}
                      </p>
                      {ev.notes && <p className="mt-0.5 text-xs text-fg-3">{ev.notes}</p>}
                      {ev.meetingId && (
                        <span className="mt-2 inline-block rounded-md border border-white/20 bg-white/8 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-fg-2 uppercase">
                          Recorded
                        </span>
                      )}
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      {!ev.completed && (
                        <Button
                          variant="outline"
                          className="size-10 px-0"
                          onClick={() => updateEvent(ev.id, { completed: true })}
                          aria-label="Mark complete"
                        >
                          <Check size={14} />
                        </Button>
                      )}
                      <Button
                        variant="icon"
                        onClick={() => removeEvent(ev.id)}
                        aria-label="Delete event"
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}
