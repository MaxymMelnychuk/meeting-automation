"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Search, FileAudio, Trash2, ArrowRight, Clock } from "lucide-react"
import Link from "next/link"
import { useApp } from "../../providers/AppProvider"
import { Button, btn } from "../ui/Button"
import { PageHeader } from "../ui/PageHeader"

function formatDate(isoStr: string): string {
  return new Date(isoStr).toLocaleString("en", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export function MeetingHistory() {
  const { meetings, openMeeting, removeMeeting } = useApp()
  const [search, setSearch] = useState("")

  const filtered =
    search.trim() === ""
      ? meetings
      : meetings.filter(
          (m) =>
            m.filename.toLowerCase().includes(search.toLowerCase()) ||
            m.analysis.summary.toLowerCase().includes(search.toLowerCase())
        )

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader
        title="Meetings"
        subtitle={`${meetings.length} ${meetings.length === 1 ? "recording" : "recordings"}`}
      />

      {meetings.length > 2 && (
        <div className="relative mb-6">
          <Search size={14} className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-fg-4" />
          <input
            type="search"
            placeholder="Search meetings"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-11 w-full rounded-xl border border-white/20 bg-surface px-4 py-2.5 pl-10 text-sm text-fg-2 outline-none placeholder:text-fg-4 transition-colors hover:border-white/35 focus:border-white/50"
          />
        </div>
      )}

      {meetings.length === 0 && (
        <div className="rounded-2xl border border-white/12 bg-surface px-6 py-16 text-center">
          <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-xl border border-white/20 bg-white/8 text-fg-2">
            <FileAudio size={20} />
          </div>
          <p className="text-sm font-medium text-fg">No meetings yet</p>
          <p className="mt-1 text-sm text-fg-3">Import a file or start a recording from Overview.</p>
          <Link href="/workspace" className={`${btn.primary} mt-5`}>
            Go to Overview
          </Link>
        </div>
      )}

      {meetings.length > 0 && filtered.length === 0 && (
        <p className="py-12 text-center text-sm text-fg-3">No meetings match “{search}”</p>
      )}

      <div className="flex flex-col gap-3">
        {filtered.map((m, i) => (
          <motion.article
            key={m.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04, duration: 0.35 }}
            className="rounded-2xl border border-white/12 bg-surface p-5 transition-colors hover:border-white/25"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <p className="truncate text-base font-semibold text-white">{m.filename}</p>
                <p className="mt-1 flex items-center gap-1.5 text-xs text-fg-3">
                  <Clock size={11} />
                  {formatDate(m.uploadedAt)}
                </p>
                <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-fg-3">{m.analysis.summary}</p>
                <Button variant="primary" className="mt-4" onClick={() => openMeeting(m.id)}>
                  Open analysis <ArrowRight size={14} />
                </Button>
              </div>
              <Button
                variant="icon"
                className="shrink-0"
                onClick={() => removeMeeting(m.id)}
                aria-label={`Delete ${m.filename}`}
              >
                <Trash2 size={14} />
              </Button>
            </div>
          </motion.article>
        ))}
      </div>
    </div>
  )
}
