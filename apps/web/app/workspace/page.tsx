"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { FileAudio, ArrowRight } from "lucide-react"
import { useApp } from "../providers/AppProvider"
import { Button, btn } from "../components/ui/Button"
import { PageHeader, SectionHeader } from "../components/ui/PageHeader"
import { CaptureZone } from "../components/dashboard/CaptureZone"

function relative(iso: string) {
  const mins = Math.floor((Date.now() - new Date(iso).getTime()) / 60_000)
  if (mins < 1) return "just now"
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

function formatWhen(dateStr: string, time: string) {
  const today = new Date().toISOString().split("T")[0]
  const tomorrow = new Date(Date.now() + 86_400_000).toISOString().split("T")[0]
  const day = dateStr === today ? "Today" : dateStr === tomorrow ? "Tomorrow" : dateStr
  return `${day} · ${time}`
}

export default function WorkspaceOverview() {
  const { meetings, tasks, upcomingEvents, openMeeting, approveTask, dismissTask } = useApp()
  const latest = meetings[0] ?? null
  const suggested = tasks.filter((t) => t.status === "pending" && t.isAISuggested).slice(0, 4)
  const next = upcomingEvents.slice(0, 4)
  const [today, setToday] = useState("")
  const activeCount = tasks.filter((t) => t.status === "approved" || t.status === "in_progress").length

  useEffect(() => {
    setToday(new Date().toLocaleDateString("en", { weekday: "long", month: "long", day: "numeric" }))
  }, [])

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-12">
      <PageHeader title="Overview" subtitle={today} />
      <CaptureZone />

      <section>
        <SectionHeader
          kicker="Action needed"
          title="Needs a decision"
          action={
            <Link href="/workspace/tasks" className={btn.outline}>
              All tasks <ArrowRight size={14} />
            </Link>
          }
        />
        <div className="rounded-2xl border border-white/12 bg-surface p-2">
          {suggested.length === 0 ? (
            <p className="px-4 py-8 text-sm text-fg-3">
              No suggested tasks. Process a meeting and owners show up here to approve.
            </p>
          ) : (
            <ul className="flex flex-col gap-2">
              {suggested.map((task) => (
                <li
                  key={task.id}
                  className="flex flex-col gap-4 rounded-xl border border-white/8 bg-white/[0.03] px-4 py-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <p className="text-sm leading-snug font-medium text-white">{task.description}</p>
                  <div className="flex shrink-0 flex-wrap items-center gap-2">
                    <Button variant="primary" onClick={() => approveTask(task.id)}>
                      Approve
                    </Button>
                    <Button variant="outline" onClick={() => dismissTask(task.id)}>
                      Dismiss
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <div className="grid gap-12 lg:grid-cols-2">
        <section>
          <SectionHeader
            kicker="Recent"
            title="Latest meeting"
            action={
              <Link href="/workspace/meetings" className={btn.outline}>
                All meetings <ArrowRight size={14} />
              </Link>
            }
          />
          <div className="rounded-2xl border border-white/12 bg-surface p-6">
            {!latest ? (
              <div className="flex flex-col items-start gap-4">
                <div className="flex size-11 items-center justify-center rounded-xl border border-white/20 bg-white/8 text-fg-2">
                  <FileAudio size={16} />
                </div>
                <p className="text-sm text-fg-3">
                  Nothing recorded yet. Import a file or start a recording above.
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                <div>
                  <p className="truncate text-base font-semibold text-white">{latest.filename}</p>
                  <p className="mt-1 text-xs text-fg-3">{relative(latest.uploadedAt)}</p>
                </div>
                <p className="line-clamp-3 text-sm leading-relaxed text-fg-3">{latest.analysis.summary}</p>
                <Button variant="primary" className="w-fit" onClick={() => openMeeting(latest.id)}>
                  Open analysis <ArrowRight size={14} />
                </Button>
              </div>
            )}
          </div>
        </section>

        <section>
          <SectionHeader
            kicker="Calendar"
            title="Next up"
            action={
              <Link href="/workspace/schedule" className={btn.outline}>
                Schedule <ArrowRight size={14} />
              </Link>
            }
          />
          <div className="rounded-2xl border border-white/12 bg-surface p-2">
            {next.length === 0 ? (
              <p className="px-4 py-8 text-sm text-fg-3">
                No upcoming events. Add one on the schedule if you want reminders here.
              </p>
            ) : (
              <ul className="flex flex-col">
                {next.map((event) => (
                  <li
                    key={event.id}
                    className="flex items-baseline justify-between gap-4 px-4 py-3"
                  >
                    <span className="truncate text-sm font-medium text-white">{event.title}</span>
                    <span className="shrink-0 rounded-lg bg-white/8 px-2 py-1 text-[11px] font-semibold text-fg-2">
                      {formatWhen(event.date, event.startTime)}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      </div>

      {meetings.length > 0 && (
        <p className="text-sm text-fg-3">
          {activeCount} active {activeCount === 1 ? "task" : "tasks"}
        </p>
      )}
    </div>
  )
}
