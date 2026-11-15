"use client"

import { motion } from "framer-motion"
import { ArrowRight, Clock, FileAudio, Users, CheckSquare, AlertTriangle } from "lucide-react"
import { useApp } from "../../providers/AppProvider"
import { ConfidenceBadge } from "../meeting/ConfidenceBadge"

function formatRelative(isoStr: string): string {
  const diffMs = Date.now() - new Date(isoStr).getTime()
  const mins = Math.floor(diffMs / 60_000)
  if (mins < 1) return "just now"
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

export function RecentMeetingCard() {
  const { meetings, openMeeting, tasks, setView } = useApp()
  const latest = meetings[0] ?? null

  if (!latest) {
    return (
      <div className="bento-card flex flex-col items-center justify-center min-h-[280px]">
        <div className="text-center px-8 py-10">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4"
            style={{ background: "var(--surface-2)", border: "1px solid var(--border-2)" }}
          >
            <FileAudio size={20} color="var(--text-4)" />
          </div>
          <p className="text-sm font-medium mb-1.5" style={{ color: "var(--text-2)" }}>
            No meetings yet
          </p>
          <p className="text-xs leading-relaxed" style={{ color: "var(--text-4)" }}>
            Record a meeting or upload an audio file<br />to see your AI-generated summary here.
          </p>
        </div>
      </div>
    )
  }

  const { analysis } = latest
  const pendingCount = tasks.filter(
    (t) => t.meetingId === latest.id && t.status === "pending"
  ).length

  return (
    <div className="bento-card flex flex-col h-full" style={{ minHeight: 0 }}>
      {/* Header */}
      <div className="bento-card-header">
        <div className="flex items-center gap-2">
          <span className="label">Recent meeting</span>
          {pendingCount > 0 && (
            <span
              className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
              style={{
                background: "rgba(251,191,36,0.1)",
                color: "#fbbf24",
                border: "1px solid rgba(251,191,36,0.2)",
              }}
            >
              {pendingCount} pending
            </span>
          )}
        </div>
        <div className="flex items-center gap-2.5">
          <span className="flex items-center gap-1" style={{ fontSize: 11, color: "var(--text-4)" }}>
            <Clock size={11} />
            {formatRelative(latest.uploadedAt)}
          </span>
          <button
            onClick={() => openMeeting(latest.id)}
            className="btn-secondary text-[11px] px-2.5 py-1 flex items-center gap-1"
          >
            View
            <ArrowRight size={10} />
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto bento-card-body flex flex-col gap-5">
        {/* File + language */}
        <div className="flex items-center gap-2">
          <FileAudio size={14} color="var(--text-4)" className="flex-shrink-0" />
          <p className="text-sm font-medium truncate" style={{ color: "var(--text-1)" }}>
            {latest.filename}
          </p>
          {analysis.language && (
            <span
              className="flex-shrink-0 font-semibold uppercase tracking-wider"
              style={{ fontSize: 9, color: "var(--text-4)", background: "var(--surface-3)", padding: "2px 6px", borderRadius: 4 }}
            >
              {analysis.language}
            </span>
          )}
        </div>

        {/* Summary */}
        <div>
          <p className="label mb-2">Summary</p>
          <p className="text-sm leading-relaxed" style={{ color: "var(--text-2)" }}>
            {analysis.summary}
          </p>
        </div>

        {/* Stats row */}
        <div className="flex items-center gap-4 flex-wrap">
          {analysis.decisions.length > 0 && (
            <div className="flex items-center gap-1.5">
              <CheckSquare size={12} color="var(--text-4)" />
              <span style={{ fontSize: 11, color: "var(--text-4)" }}>
                {analysis.decisions.length} decision{analysis.decisions.length > 1 ? "s" : ""}
              </span>
            </div>
          )}
          {analysis.actions.length > 0 && (
            <div className="flex items-center gap-1.5">
              <CheckSquare size={12} color="var(--text-4)" />
              <span style={{ fontSize: 11, color: "var(--text-4)" }}>
                {analysis.actions.length} action{analysis.actions.length > 1 ? "s" : ""}
              </span>
            </div>
          )}
          {analysis.participants.length > 0 && (
            <div className="flex items-center gap-1.5">
              <Users size={12} color="var(--text-4)" />
              <span style={{ fontSize: 11, color: "var(--text-4)" }}>
                {analysis.participants.length} participant{analysis.participants.length > 1 ? "s" : ""}
              </span>
            </div>
          )}
        </div>

        {/* Decisions */}
        {analysis.decisions.length > 0 && (
          <div>
            <p className="label mb-2">Key decisions</p>
            <div className="flex flex-col gap-1.5">
              {analysis.decisions.slice(0, 3).map((d, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="mt-1.5 flex-shrink-0 w-1 h-1 rounded-full" style={{ background: "var(--border-strong)" }} />
                  <p className="text-sm leading-snug" style={{ color: "var(--text-2)" }}>{d.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions preview */}
        {analysis.actions.length > 0 && (
          <div>
            <p className="label mb-2">Action items</p>
            <div className="flex flex-col gap-2">
              {analysis.actions.slice(0, 3).map((action, i) => {
                const confidence =
                  action.certainty === "explicit" && action.assignee && action.deadline
                    ? "confirmed" : "needs_review"
                return (
                  <div
                    key={i}
                    className="flex items-start gap-3 px-3 py-2.5 rounded-xl"
                    style={{ background: "var(--surface-2)", border: "1px solid var(--border)" }}
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm leading-snug" style={{ color: "var(--text-2)" }}>
                        {action.description}
                      </p>
                      <div className="flex items-center gap-3 mt-1" style={{ fontSize: 11, color: "var(--text-4)" }}>
                        {action.assignee && <span>→ {action.assignee}</span>}
                        {action.deadline && <span>· {action.deadline}</span>}
                      </div>
                    </div>
                    <ConfidenceBadge confidence={confidence} size="sm" />
                  </div>
                )
              })}
              {analysis.actions.length > 3 && (
                <button
                  onClick={() => setView("tasks")}
                  className="text-left text-[11px] flex items-center gap-1 transition-colors"
                  style={{ color: "var(--text-4)" }}
                >
                  +{analysis.actions.length - 3} more
                  <ArrowRight size={10} />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Problems / open questions */}
        {(analysis.problems.length > 0 || analysis.open_questions.length > 0) && (
          <div>
            <p className="label mb-2">Needs attention</p>
            <div className="flex flex-col gap-2">
              {[...analysis.problems, ...analysis.open_questions].slice(0, 2).map((item, i) => (
                <div
                  key={i}
                  className="flex items-start gap-2.5 px-3 py-2 rounded-xl"
                  style={{ background: "rgba(248,113,113,0.04)", border: "1px solid rgba(248,113,113,0.15)" }}
                >
                  <AlertTriangle size={12} color="#f87171" className="flex-shrink-0 mt-0.5" />
                  <p className="text-sm leading-snug" style={{ color: "#f87171" }}>
                    {"description" in item ? item.description : (item as { question: string }).question}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
