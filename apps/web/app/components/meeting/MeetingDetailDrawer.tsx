"use client"

import { motion, AnimatePresence } from "framer-motion"
import { X, FileAudio, Clock } from "lucide-react"
import { useApp } from "../../providers/AppProvider"
import type { UploadMeetingResponse } from "@/types/meeting"
import { MeetingResults } from "../MeetingResults"
import { Button } from "../ui/Button"

export function MeetingDetailDrawer() {
  const { selectedMeetingId, closeMeeting, getMeeting } = useApp()

  const meeting = selectedMeetingId ? getMeeting(selectedMeetingId) : null

  const result: UploadMeetingResponse | null = meeting
    ? {
        filename: meeting.filename,
        transcript: meeting.transcript,
        analysis: meeting.analysis,
        actions: meeting.analysis.actions.map((a) => ({
          description: a.description,
          assignee: a.assignee,
          deadline: a.deadline,
          status: a.assignee ? "ready" : "needs_information",
        })),
      }
    : null

  return (
    <AnimatePresence>
      {selectedMeetingId && meeting && result && (
        <>
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/70"
            onClick={closeMeeting}
          />

          <motion.div
            key="drawer"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed inset-y-0 right-0 z-50 flex w-[min(720px,96vw)] flex-col border-l border-line bg-surface shadow-[-20px_0_60px_rgba(0,0,0,0.5)]"
          >
            <div className="flex shrink-0 items-center gap-4 border-b border-line px-6 py-5">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-white/20 bg-white/8 text-fg-2">
                <FileAudio size={14} />
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="truncate text-base font-semibold text-white">{meeting.filename}</h2>
                <p className="mt-0.5 flex items-center gap-1.5 text-xs text-fg-3">
                  <Clock size={10} />
                  {new Date(meeting.uploadedAt).toLocaleString("en", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
              <Button variant="icon" onClick={closeMeeting} aria-label="Close">
                <X size={15} />
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-8">
              <MeetingResults result={result} />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
