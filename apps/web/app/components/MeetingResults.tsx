"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, CheckSquare, Lightbulb, Scale, ListChecks, Users, AlertTriangle, HelpCircle, Clock, FileText } from "lucide-react"
import type { Action, UploadMeetingResponse } from "@/types/meeting"

/* ─── Internal primitives ─────────────────────────────── */

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="label" style={{ color: "var(--text-4)", marginBottom: 16 }}>
      {children}
    </p>
  )
}

function InferredBadge({ certainty }: { certainty: "explicit" | "inferred" }) {
  if (certainty === "explicit") return null
  return (
    <span className="badge badge-inferred" style={{ fontSize: 9 }}>Inferred</span>
  )
}

/* ─── Action Card ─────────────────────────────────────── */

function ActionCard({ action, index }: { action: Action; index: number }) {
  return (
    <motion.div
      className="action-card"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="flex gap-4 items-start">
        {/* Index */}
        <span
          className="flex-shrink-0 w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold tabular-nums"
          style={{
            background: "var(--surface-2)",
            border: "1px solid var(--border)",
            color: "var(--text-4)",
            fontSize: 10,
          }}
        >
          {String(index + 1).padStart(2, "0")}
        </span>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <p className="text-sm leading-relaxed" style={{ color: "var(--text-2)", fontWeight: 400 }}>
            {action.description}
          </p>
          {action.certainty === "inferred" && (
            <div className="mt-2">
              <InferredBadge certainty={action.certainty} />
            </div>
          )}
        </div>
      </div>

      {/* Metadata */}
      <div className="action-meta">
        <div>
          <p className="label" style={{ marginBottom: 6 }}>Assignee</p>
          <p className="text-sm" style={{
            color: action.assignee ? "var(--text-2)" : "var(--text-4)",
            fontStyle: action.assignee ? "normal" : "italic",
          }}>
            {action.assignee ?? "Unassigned"}
          </p>
        </div>
        <div>
          <p className="label" style={{ marginBottom: 6 }}>Deadline</p>
          <p className="text-sm" style={{
            color: action.deadline ? "var(--text-2)" : "var(--text-4)",
            fontStyle: action.deadline ? "normal" : "italic",
          }}>
            {action.deadline ?? "No deadline"}
          </p>
        </div>
      </div>
    </motion.div>
  )
}

/* ─── Section ─────────────────────────────────────────── */

interface SectionProps {
  icon: React.ReactNode
  label: string
  count?: number
  delay?: number
  children: React.ReactNode
}

function Section({ icon, label, count, delay = 0, children }: SectionProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="flex items-center gap-2 mb-4">
        <span style={{ color: "var(--text-4)" }}>{icon}</span>
        <SectionLabel>{label}</SectionLabel>
        {count !== undefined && count > 0 && (
          <span className="ml-auto text-xs tabular-nums" style={{ color: "var(--text-5)" }}>{count}</span>
        )}
      </div>
      {children}
    </motion.section>
  )
}

/* ─── Transcript section ──────────────────────────────── */

function TranscriptSection({ transcript }: { transcript: string }) {
  const [open, setOpen] = useState(false)

  return (
    <div>
      <button
        className="flex items-center gap-2 group"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        <span style={{ color: "var(--text-4)" }}>
          <FileText size={14} />
        </span>
        <span className="label" style={{ color: "var(--text-4)" }}>Transcript</span>
        <ChevronDown
          size={14}
          style={{
            color: "var(--text-4)",
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.3s ease",
          }}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            style={{ overflow: "hidden" }}
          >
            <div
              className="mt-4 rounded-xl p-5"
              style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
              }}
            >
              <p className="transcript-body">{transcript}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ─── Main component ──────────────────────────────────── */

export function MeetingResults({ result }: { result: UploadMeetingResponse }) {
  const { analysis, transcript, filename } = result

  const has = {
    importantInfo:  analysis.important_information.length > 0,
    decisions:      analysis.decisions.length > 0,
    actions:        analysis.actions.length > 0,
    participants:   analysis.participants.length > 0,
    problems:       analysis.problems.length > 0,
    openQuestions:  analysis.open_questions.length > 0,
    timeline:       analysis.timeline.length > 0,
    topics:         analysis.topics.length > 0,
    transcript:     !!transcript?.trim(),
  }

  const hasSupportingData =
    has.topics || has.participants || has.problems ||
    has.openQuestions || has.timeline

  return (
    <div className="flex flex-col gap-14">

      {/* ── File header ──── */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex items-center gap-3"
      >
        <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ background: "var(--surface-2)", border: "1px solid var(--border-2)" }}>
          <FileText size={14} color="var(--text-3)" />
        </div>
        <div>
          <p className="text-sm font-semibold tracking-tight" style={{ color: "var(--text-1)" }}>
            {filename}
          </p>
          {analysis.language && (
            <p className="text-xs mt-0.5" style={{ color: "var(--text-4)" }}>
              Language: {analysis.language}
            </p>
          )}
        </div>
      </motion.div>

      {/* ── Summary ──── */}
      <Section icon={<Lightbulb size={14} />} label="Summary" delay={0.05}>
        <p className="text-base leading-[1.85]" style={{ color: "var(--text-2)", fontWeight: 400 }}>
          {analysis.summary}
        </p>
      </Section>

      {/* ── Insights ──── */}
      {has.importantInfo && (
        <Section icon={<Lightbulb size={14} />} label="Insights" count={analysis.important_information.length} delay={0.1}>
          <div>
            {analysis.important_information.map((info, i) => (
              <div key={i} className="divider-row">
                <p className="text-sm leading-relaxed" style={{ color: "var(--text-2)", fontWeight: 400 }}>
                  {info.content}
                </p>
                {info.certainty === "inferred" && (
                  <div className="mt-2"><InferredBadge certainty={info.certainty} /></div>
                )}
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* ── Decisions ──── */}
      {has.decisions && (
        <Section icon={<Scale size={14} />} label="Decisions" count={analysis.decisions.length} delay={0.15}>
          <div>
            {analysis.decisions.map((decision, i) => (
              <div key={i} className="divider-row flex gap-5 items-start">
                <span
                  className="flex-shrink-0 tabular-nums text-xs"
                  style={{ color: "var(--text-5)", paddingTop: 3, minWidth: 18 }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm leading-relaxed" style={{ color: "var(--text-2)", fontWeight: 400 }}>
                    {decision.description}
                  </p>
                  {decision.certainty === "inferred" && (
                    <div className="mt-2"><InferredBadge certainty={decision.certainty} /></div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* ── Actions ──── */}
      {has.actions && (
        <Section icon={<ListChecks size={14} />} label="Action items" count={analysis.actions.length} delay={0.2}>
          <div className="flex flex-col gap-3">
            {analysis.actions.map((action, i) => (
              <ActionCard key={i} action={action} index={i} />
            ))}
          </div>
        </Section>
      )}

      {/* ── Supporting data ──── */}
      {hasSupportingData && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col gap-10 pt-8"
          style={{ borderTop: "1px solid var(--border)" }}
        >
          {/* Topics */}
          {has.topics && (
            <section>
              <SectionLabel>Topics covered</SectionLabel>
              <div className="topics-grid">
                {analysis.topics.map((topic, i) => (
                  <div key={i} className="topic-card">
                    <p className="text-sm font-medium" style={{ color: "var(--text-2)", marginBottom: 5 }}>
                      {topic.title}
                    </p>
                    <p className="text-xs leading-relaxed" style={{ color: "var(--text-4)" }}>
                      {topic.summary}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Participants */}
          {has.participants && (
            <section>
              <SectionLabel>Participants</SectionLabel>
              <div>
                {analysis.participants.map((p, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 py-3"
                    style={{
                      borderTop: i === 0 ? "1px solid var(--border)" : "none",
                      borderBottom: "1px solid var(--border)",
                    }}
                  >
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0"
                      style={{ background: "var(--surface-2)", border: "1px solid var(--border-2)", color: "var(--text-4)" }}
                    >
                      {p.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium" style={{ color: "var(--text-2)" }}>{p.name}</p>
                      {p.role && <p className="text-xs" style={{ color: "var(--text-4)", marginTop: 1 }}>{p.role}</p>}
                    </div>
                    {p.certainty === "inferred" && <InferredBadge certainty={p.certainty} />}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Problems */}
          {has.problems && (
            <section>
              <SectionLabel>Problems &amp; blockers</SectionLabel>
              {analysis.problems.map((problem, i) => (
                <div key={i}
                  className="py-3"
                  style={{ borderTop: i === 0 ? "1px solid var(--border)" : "none", borderBottom: "1px solid var(--border)" }}
                >
                  <p className="text-sm leading-relaxed" style={{ color: "var(--text-3)" }}>{problem.description}</p>
                  {problem.certainty === "inferred" && <div className="mt-2"><InferredBadge certainty={problem.certainty} /></div>}
                </div>
              ))}
            </section>
          )}

          {/* Open questions */}
          {has.openQuestions && (
            <section>
              <SectionLabel>Open questions</SectionLabel>
              {analysis.open_questions.map((q, i) => (
                <div key={i}
                  className="flex gap-3 items-start py-3"
                  style={{ borderTop: i === 0 ? "1px solid var(--border)" : "none", borderBottom: "1px solid var(--border)" }}
                >
                  <span className="text-sm flex-shrink-0" style={{ color: "var(--text-5)", paddingTop: 1 }}>?</span>
                  <p className="text-sm leading-relaxed" style={{ color: "var(--text-3)" }}>{q.question}</p>
                </div>
              ))}
            </section>
          )}

          {/* Timeline */}
          {has.timeline && (
            <section>
              <SectionLabel>Timeline</SectionLabel>
              <div style={{ borderTop: "1px solid var(--border)" }}>
                {analysis.timeline.map((event, i) => (
                  <div key={i} className="timeline-row">
                    <p className="text-xs font-medium" style={{ color: "var(--text-4)", lineHeight: 1.6 }}>
                      {event.date_or_reference}
                    </p>
                    <p className="text-sm" style={{ color: "var(--text-2)", lineHeight: 1.7 }}>
                      {event.event}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </motion.div>
      )}

      {/* ── Transcript ──── */}
      {has.transcript && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <TranscriptSection transcript={transcript} />
        </motion.div>
      )}
    </div>
  )
}
