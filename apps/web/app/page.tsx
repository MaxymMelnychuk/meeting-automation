"use client"

import { useState } from "react"

import { uploadMeeting } from "@/api/meetings"
import type { UploadMeetingResponse } from "@/types/meeting"
import { MeetingResults } from "./components/MeetingResults"
import { ProcessingState } from "./components/ProcessingState"
import { UploadZone } from "./components/UploadZone"

type AppState = "upload" | "processing" | "results"

export default function Home() {
  const [file, setFile] = useState<File | null>(null)
  const [result, setResult] = useState<UploadMeetingResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const appState: AppState = loading
    ? "processing"
    : result
    ? "results"
    : "upload"

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

  function handleFileChange(newFile: File | null) {
    setFile(newFile)
    setResult(null)
    setError(null)
  }

  function handleReset() {
    setFile(null)
    setResult(null)
    setError(null)
  }

  return (
    <>
      <main style={{ minHeight: "100svh" }}>
        <div className="content-column">

          {/* ── Header ────────────────────────────────────────────
              Persistent. The headline is the only text needed.
              Position + scale make it self-explanatory.
          ──────────────────────────────────────────────────── */}
          <header className="anim-fade-in" style={{ marginBottom: 64 }}>
            <h1
              style={{
                color: "var(--text-1)",
                fontSize: "clamp(32px, 4.5vw, 44px)",
                fontWeight: 350,
                letterSpacing: "-0.035em",
                lineHeight: 1.1,
                margin: 0,
              }}
            >
              Turn meetings into<br />actionable work.
            </h1>
          </header>

          {/* ── Content area ──────────────────────────────────── */}
          {appState === "processing" ? (
            <ProcessingState key="processing" />
          ) : appState === "results" && result ? (
            <div key="results">
              {/* Back affordance — quiet, non-competing */}
              <div style={{ marginBottom: 48 }} className="anim-fade-in">
                <button className="btn-ghost" onClick={handleReset}>
                  <svg
                    width="10"
                    height="10"
                    viewBox="0 0 10 10"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M7 1L3 5L7 9"
                      stroke="currentColor"
                      strokeWidth="1.3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  New analysis
                </button>
              </div>
              <MeetingResults result={result} />
            </div>
          ) : (
            <UploadZone
              key="upload"
              file={file}
              error={error}
              onFileChange={handleFileChange}
              onUpload={handleUpload}
            />
          )}
        </div>
      </main>
    </>
  )
}