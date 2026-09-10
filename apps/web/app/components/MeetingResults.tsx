"use client"

import { useState } from "react"
import type { Action, UploadMeetingResponse } from "@/types/meeting"

/* ─── Internal primitives ────────────────────────────────── */

function Label({ children }: { children: React.ReactNode }) {
  return <p className="label">{children}</p>
}

function InferredBadge({ certainty }: { certainty: "explicit" | "inferred" }) {
  if (certainty === "explicit") return null
  return <span className="badge-inferred">Inferred</span>
}

/* Sub-section label — for supporting data. Same readable treatment as Label */
function SubLabel({ children }: { children: React.ReactNode }) {
  return (
    <p
      style={{
        fontSize: 11,
        fontWeight: 600,
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        color: "var(--text-4)",  /* #888 — readable */
        margin: "0 0 16px",
        lineHeight: 1,
      }}
    >
      {children}
    </p>
  )
}

/* ─── Action Card ──────────────────────────────────────────── */

function ActionCard({ action, index }: { action: Action; index: number }) {
  return (
    <div className="action-card">
      <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
        {/* Index */}
        <span
          style={{
            color: "var(--text-4)",
            fontSize: 12,
            fontWeight: 600,
            letterSpacing: "0.06em",
            paddingTop: 2,
            minWidth: 22,
            flexShrink: 0,
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {String(index + 1).padStart(2, "0")}
        </span>

        {/* Content */}
        <div style={{ flex: 1 }}>
          <p
            style={{
              color: "var(--text-2)",
              fontSize: 15,
              lineHeight: 1.78,
              fontWeight: 400,
              margin: 0,
            }}
          >
            {action.description}
          </p>
          {action.certainty === "inferred" && (
            <div style={{ marginTop: 12 }}>
              <InferredBadge certainty={action.certainty} />
            </div>
          )}
        </div>
      </div>

      {/* Assignee + deadline */}
      <div className="action-meta">
        <div>
          <p className="label" style={{ marginBottom: 8 }}>Assignee</p>
          <p
            style={{
              color: action.assignee ? "var(--text-3)" : "var(--text-4)",
              fontSize: 14,
              margin: 0,
              fontStyle: action.assignee ? "normal" : "italic",
            }}
          >
            {action.assignee ?? "Unassigned"}
          </p>
        </div>
        <div>
          <p className="label" style={{ marginBottom: 8 }}>Deadline</p>
          <p
            style={{
              color: action.deadline ? "var(--text-3)" : "var(--text-4)",
              fontSize: 14,
              margin: 0,
              fontStyle: action.deadline ? "normal" : "italic",
            }}
          >
            {action.deadline ?? "No deadline"}
          </p>
        </div>
      </div>
    </div>
  )
}

/* ─── Transcript section ─────────────────────────────────── */

function TranscriptSection({ transcript }: { transcript: string }) {
  const [open, setOpen] = useState(false)

  return (
    <div>
      <button
        className="btn-ghost"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        <span className="label" style={{ color: "inherit" }}>Transcript</span>
        <svg
          width="10"
          height="10"
          viewBox="0 0 10 10"
          fill="none"
          aria-hidden="true"
          style={{
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.3s var(--ease-snap)",
          }}
        >
          <path
            d="M1.5 3.5L5 7L8.5 3.5"
            stroke="currentColor"
            strokeWidth="1.3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <div
        style={{
          maxHeight: open ? 580 : 0,
          overflow: "hidden",
          transition: "max-height 0.45s var(--ease-snap)",
        }}
      >
        <div
          style={{
            marginTop: 20,
            padding: "22px 26px",
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: 12,
            opacity: open ? 1 : 0,
            transition: "opacity 0.3s ease 0.08s",
          }}
        >
          <p className="transcript-body">{transcript}</p>
        </div>
      </div>
    </div>
  )
}

/* ─── Main component ─────────────────────────────────────── */

/*
  Text hierarchy — readability first, always:

  Summary:    19px / text-2 (#e2e2e2) / lh 1.95  → very comfortable
  Insights:   17px / text-2           / lh 1.82   → clearly readable
  Decisions:  17px / text-2           / lh 1.82   → clearly readable
  Actions:    15px / text-2           / lh 1.78   → comfortable
  Metadata:   14px / text-3 (#b8b8b8) / lh 1.6   → readable
  Sub-labels: 11px / text-4 (#888)    / uppercase+tracked → legible
  Transcript: 14px / text-4 (#888)    / mono       → readable

  Minimum for any meaningful sentence: 14px / text-3 (#b8b8b8)
*/

export function MeetingResults({ result }: { result: UploadMeetingResponse }) {
  const { analysis, transcript, filename } = result

  const has = {
    importantInfo: analysis.important_information.length > 0,
    decisions:     analysis.decisions.length > 0,
    actions:       analysis.actions.length > 0,
    participants:  analysis.participants.length > 0,
    problems:      analysis.problems.length > 0,
    openQuestions: analysis.open_questions.length > 0,
    timeline:      analysis.timeline.length > 0,
    topics:        analysis.topics.length > 0,
    transcript:    !!transcript?.trim(),
  }

  const hasSupportingData =
    has.topics || has.participants || has.problems ||
    has.openQuestions || has.timeline

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 68 }}>

      {/* ── Filename ──────────────────────────────────────── */}
      <div className="anim-rise-in" style={{ animationDelay: "0ms" }}>
        <p
          style={{
            color: "var(--text-1)",
            fontSize: 16,
            fontWeight: 500,
            letterSpacing: "-0.01em",
            margin: 0,
            lineHeight: 1.3,
          }}
        >
          {filename}
          {analysis.language && (
            <span
              style={{
                color: "var(--text-4)",
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                marginLeft: 14,
                verticalAlign: "middle",
              }}
            >
              {analysis.language}
            </span>
          )}
        </p>
      </div>

      {/* ── Summary ───────────────────────────────────────── */}
      <div className="anim-rise-in" style={{ animationDelay: "80ms" }}>
        <Label>Summary</Label>
        <p
          style={{
            color: "var(--text-2)",
            fontSize: 19,
            lineHeight: 1.95,
            fontWeight: 400,
            marginTop: 18,
            marginBottom: 0,
          }}
        >
          {analysis.summary}
        </p>
      </div>

      {/* ── Insights ──────────────────────────────────────── */}
      {has.importantInfo && (
        <div className="anim-rise-in" style={{ animationDelay: "160ms" }}>
          <Label>Insights</Label>
          <div style={{ marginTop: 18 }}>
            {analysis.important_information.map((info, i) => (
              <div key={i} className="divider-row">
                <p
                  style={{
                    color: "var(--text-2)",
                    fontSize: 17,
                    lineHeight: 1.82,
                    margin: 0,
                    fontWeight: 400,
                  }}
                >
                  {info.content}
                </p>
                {info.certainty === "inferred" && (
                  <div style={{ marginTop: 10 }}>
                    <InferredBadge certainty={info.certainty} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Decisions ─────────────────────────────────────── */}
      {has.decisions && (
        <div className="anim-rise-in" style={{ animationDelay: "240ms" }}>
          <Label>Decisions</Label>
          <div style={{ marginTop: 18 }}>
            {analysis.decisions.map((decision, i) => (
              <div
                key={i}
                className="divider-row"
                style={{ display: "flex", gap: 20, alignItems: "flex-start" }}
              >
                <span
                  style={{
                    color: "var(--text-4)",
                    fontSize: 12,
                    fontWeight: 600,
                    letterSpacing: "0.06em",
                    paddingTop: 3,
                    minWidth: 22,
                    flexShrink: 0,
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div style={{ flex: 1 }}>
                  <p
                    style={{
                      color: "var(--text-2)",
                      fontSize: 17,
                      lineHeight: 1.82,
                      fontWeight: 400,
                      margin: 0,
                    }}
                  >
                    {decision.description}
                  </p>
                  {decision.certainty === "inferred" && (
                    <div style={{ marginTop: 10 }}>
                      <InferredBadge certainty={decision.certainty} />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Actions ───────────────────────────────────────── */}
      {has.actions && (
        <div className="anim-rise-in" style={{ animationDelay: "320ms" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 16,
            }}
          >
            <Label>Actions</Label>
            <span
              style={{
                color: "var(--text-4)",
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: "0.1em",
              }}
            >
              {analysis.actions.length}
            </span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {analysis.actions.map((action, i) => (
              <ActionCard key={i} action={action} index={i} />
            ))}
          </div>
        </div>
      )}

      {/* ── Supporting data ───────────────────────────────── */}
      {hasSupportingData && (
        <div className="anim-rise-in" style={{ animationDelay: "400ms" }}>
          <div
            style={{
              borderTop: "1px solid var(--border)",
              paddingTop: 48,
              display: "flex",
              flexDirection: "column",
              gap: 40,
            }}
          >

            {/* Topics */}
            {has.topics && (
              <section>
                <SubLabel>Topics</SubLabel>
                <div className="topics-grid">
                  {analysis.topics.map((topic, i) => (
                    <div key={i} className="topic-card">
                      <p
                        style={{
                          color: "var(--text-3)",
                          fontSize: 14,
                          fontWeight: 500,
                          margin: "0 0 6px",
                          lineHeight: 1.4,
                        }}
                      >
                        {topic.title}
                      </p>
                      <p
                        style={{
                          color: "var(--text-4)",
                          fontSize: 13,
                          lineHeight: 1.65,
                          margin: 0,
                        }}
                      >
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
                <SubLabel>Participants</SubLabel>
                {analysis.participants.map((p, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      borderTop: i === 0 ? "1px solid var(--border-subtle)" : "none",
                      borderBottom: "1px solid var(--border-subtle)",
                      padding: "12px 0",
                    }}
                  >
                    {/* Initial */}
                    <div
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: "50%",
                        background: "var(--surface)",
                        border: "1px solid var(--border)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 11,
                        fontWeight: 600,
                        color: "var(--text-4)",
                        flexShrink: 0,
                        userSelect: "none",
                      }}
                    >
                      {p.name.charAt(0).toUpperCase()}
                    </div>
                    <div style={{ flex: 1 }}>
                      <p
                        style={{
                          color: "var(--text-3)",
                          fontSize: 14,
                          fontWeight: 500,
                          margin: 0,
                        }}
                      >
                        {p.name}
                      </p>
                      {p.role && (
                        <p
                          style={{
                            color: "var(--text-4)",
                            fontSize: 13,
                            margin: "2px 0 0",
                          }}
                        >
                          {p.role}
                        </p>
                      )}
                    </div>
                    {p.certainty === "inferred" && (
                      <InferredBadge certainty={p.certainty} />
                    )}
                  </div>
                ))}
              </section>
            )}

            {/* Problems */}
            {has.problems && (
              <section>
                <SubLabel>Problems</SubLabel>
                {analysis.problems.map((problem, i) => (
                  <div
                    key={i}
                    style={{
                      borderTop: i === 0 ? "1px solid var(--border-subtle)" : "none",
                      borderBottom: "1px solid var(--border-subtle)",
                      padding: "14px 0",
                    }}
                  >
                    <p
                      style={{
                        color: "var(--text-3)",
                        fontSize: 14,
                        lineHeight: 1.75,
                        margin: 0,
                      }}
                    >
                      {problem.description}
                    </p>
                    {problem.certainty === "inferred" && (
                      <div style={{ marginTop: 8 }}>
                        <InferredBadge certainty={problem.certainty} />
                      </div>
                    )}
                  </div>
                ))}
              </section>
            )}

            {/* Open questions */}
            {has.openQuestions && (
              <section>
                <SubLabel>Open questions</SubLabel>
                {analysis.open_questions.map((q, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      gap: 12,
                      alignItems: "flex-start",
                      borderTop: i === 0 ? "1px solid var(--border-subtle)" : "none",
                      borderBottom: "1px solid var(--border-subtle)",
                      padding: "14px 0",
                    }}
                  >
                    <span
                      style={{
                        color: "var(--text-4)",
                        fontSize: 14,
                        flexShrink: 0,
                        lineHeight: 1.75,
                      }}
                    >
                      ?
                    </span>
                    <p
                      style={{
                        color: "var(--text-3)",
                        fontSize: 14,
                        lineHeight: 1.75,
                        margin: 0,
                      }}
                    >
                      {q.question}
                    </p>
                  </div>
                ))}
              </section>
            )}

            {/* Timeline */}
            {has.timeline && (
              <section>
                <SubLabel>Timeline</SubLabel>
                <div style={{ borderTop: "1px solid var(--border-subtle)" }}>
                  {analysis.timeline.map((event, i) => (
                    <div key={i} className="timeline-row">
                      <p
                        style={{
                          color: "var(--text-4)",
                          fontSize: 13,
                          fontWeight: 500,
                          lineHeight: 1.6,
                          margin: 0,
                        }}
                      >
                        {event.date_or_reference}
                      </p>
                      <p
                        style={{
                          color: "var(--text-3)",
                          fontSize: 14,
                          lineHeight: 1.7,
                          margin: 0,
                        }}
                      >
                        {event.event}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}

          </div>
        </div>
      )}

      {/* ── Transcript ────────────────────────────────────── */}
      {has.transcript && (
        <div className="anim-rise-in" style={{ animationDelay: "480ms" }}>
          <TranscriptSection transcript={transcript} />
        </div>
      )}

    </div>
  )
}
