"use client"

import { useState } from "react"

import { uploadMeeting } from "@/api/meetings"
import type { UploadMeetingResponse } from "@/types/meeting"

export default function Home() {
  const [file, setFile] = useState<File | null>(null)
  const [result, setResult] = useState<UploadMeetingResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleUpload() {
    if (!file) return

    setLoading(true)
    setError(null)

    try {
      const response = await uploadMeeting(file)
      setResult(response)
    } catch {
      setError("Something went wrong while processing the meeting.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-12 text-white">
      <div className="mx-auto max-w-4xl">
        <header className="mb-10">
          <p className="mb-3 text-sm font-medium text-slate-400">
            AI Meeting Automation
          </p>

          <h1 className="text-4xl font-semibold tracking-tight">
            Turn meetings into actionable work.
          </h1>

          <p className="mt-4 max-w-2xl text-slate-400">
            Upload a meeting recording and let AI extract the context,
            decisions, problems, and action items.
          </p>
        </header>

        <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <div className="rounded-xl border border-dashed border-slate-700 bg-slate-950 p-8 text-center">
            <p className="text-sm text-slate-400">
              Upload your meeting recording
            </p>

            <input
              type="file"
              accept="audio/*"
              onChange={(event) => {
                setFile(event.target.files?.[0] ?? null)
                setResult(null)
                setError(null)
              }}
              className="mt-4 block w-full text-sm text-slate-400 file:mr-4 file:rounded-lg file:border-0 file:bg-slate-800 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-slate-700"
            />

            <button
              onClick={handleUpload}
              disabled={!file || loading}
              className="mt-6 rounded-lg bg-white px-5 py-2.5 text-sm font-medium text-slate-950 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {loading ? "Processing..." : "Analyze meeting"}
            </button>

            {file && (
              <p className="mt-4 text-xs text-slate-500">
                Selected: {file.name}
              </p>
            )}

            {error && (
              <p className="mt-4 text-sm text-red-400">
                {error}
              </p>
            )}
          </div>
        </section>

        {result && (
          <div className="mt-10 space-y-6">
            <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
              <div className="mb-5">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Meeting brief
                </p>

                <h2 className="mt-2 text-xl font-semibold">
                  {result.filename}
                </h2>
              </div>

              <p className="leading-7 text-slate-300">
                {result.analysis.summary}
              </p>
            </section>

            <section>
              <div className="mb-4">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Key topics
                </p>

                <h2 className="mt-1 text-xl font-semibold">
                  What was discussed
                </h2>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {result.analysis.topics.map((topic, index) => (
                  <article
                    key={index}
                    className="rounded-2xl border border-slate-800 bg-slate-900 p-5"
                  >
                    <h3 className="font-medium">{topic.title}</h3>

                    <p className="mt-2 text-sm leading-6 text-slate-400">
                      {topic.summary}
                    </p>
                  </article>
                ))}
              </div>
            </section>

            <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
              <div className="mb-5">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Decisions
                </p>

                <h2 className="mt-1 text-xl font-semibold">
                  What was decided
                </h2>
              </div>

              {result.analysis.decisions.length > 0 ? (
                <div className="space-y-4">
                  {result.analysis.decisions.map((decision, index) => (
                    <article
                      key={index}
                      className="rounded-xl border border-slate-800 bg-slate-950 p-4"
                    >
                      <p className="text-sm leading-6 text-slate-300">
                        {decision.description}
                      </p>
                    </article>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-500">
                  No decisions were identified.
                </p>
              )}
            </section>

            <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
              <div className="mb-5">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Important information
                </p>

                <h2 className="mt-1 text-xl font-semibold">
                  What matters
                </h2>
              </div>

              {result.analysis.important_information.length > 0 ? (
                <div className="space-y-4">
                  {result.analysis.important_information.map(
                    (information, index) => (
                      <article
                        key={index}
                        className="rounded-xl border border-slate-800 bg-slate-950 p-4"
                      >
                        <p className="text-sm leading-6 text-slate-300">
                          {information.content}
                        </p>
                      </article>
                    ),
                  )}
                </div>
              ) : (
                <p className="text-sm text-slate-500">
                  No additional important information was identified.
                </p>
              )}
            </section>

            <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                    Action items
                  </p>

                  <h2 className="mt-1 text-xl font-semibold">
                    Work identified by AI
                  </h2>
                </div>

                <span className="rounded-full bg-slate-800 px-3 py-1 text-xs font-medium text-slate-300">
                  {result.analysis.actions.length} actions
                </span>
              </div>

              {result.analysis.actions.length > 0 ? (
                <div className="space-y-4">
                  {result.analysis.actions.map((action, index) => (
                    <article
                      key={index}
                      className="rounded-xl border border-slate-800 bg-slate-950 p-5"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-sm leading-6 text-slate-200">
                            {action.description}
                          </p>

                          <div className="mt-4 flex flex-wrap gap-2">
                            <span className="rounded-full bg-slate-800 px-2.5 py-1 text-xs text-slate-400">
                              {action.certainty === "explicit"
                                ? "Explicit"
                                : "Inferred"}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-5 grid gap-3 border-t border-slate-800 pt-4 sm:grid-cols-2">
                        <div>
                          <p className="text-xs uppercase tracking-wide text-slate-600">
                            Assignee
                          </p>

                          <p className="mt-1 text-sm text-slate-300">
                            {action.assignee ?? "Needs to be defined"}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs uppercase tracking-wide text-slate-600">
                            Deadline
                          </p>

                          <p className="mt-1 text-sm text-slate-300">
                            {action.deadline ?? "Needs to be defined"}
                          </p>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-500">
                  No action items were identified.
                </p>
              )}
            </section>
          </div>
        )}
      </div>
    </main>
  )
}