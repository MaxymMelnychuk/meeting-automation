"use client"

import { useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { uploadMeeting } from "@/api/meetings"
import type { UploadMeetingResponse } from "@/types/meeting"
import { MeetingResults } from "./components/MeetingResults"
import { ProcessingState } from "./components/ProcessingState"
import { UploadZone } from "./components/UploadZone"
import { HeroProductStage } from "./components/HeroProductStage"
import { Logo } from "./components/ui/Logo"
import { useApp } from "./providers/AppProvider"
import { generateTasksFromMeeting } from "@/hooks/useTasks"

type UploadAppState = "upload" | "processing" | "results"

const STARS = [
  { w: 1.5, t: "9%", l: "68%", d: "4.2s", dl: "0.3s", op: 0.5 },
  { w: 1, t: "6%", l: "48%", d: "3.6s", dl: "0.9s", op: 0.38 },
  { w: 2, t: "21%", l: "84%", d: "5.1s", dl: "0.1s", op: 0.44 },
  { w: 1, t: "34%", l: "92%", d: "3.3s", dl: "1.3s", op: 0.28 },
  { w: 1.5, t: "5%", l: "59%", d: "4.7s", dl: "0.6s", op: 0.46 },
  { w: 1, t: "18%", l: "28%", d: "3.1s", dl: "1.6s", op: 0.3 },
  { w: 2, t: "41%", l: "77%", d: "6.0s", dl: "0.2s", op: 0.2 },
  { w: 1, t: "27%", l: "55%", d: "4.9s", dl: "1.0s", op: 0.4 },
  { w: 1.5, t: "14%", l: "94%", d: "3.8s", dl: "0.7s", op: 0.34 },
  { w: 1, t: "47%", l: "63%", d: "5.4s", dl: "1.2s", op: 0.24 },
] as const

export default function Home() {
  const { addMeeting, addTasks } = useApp()
  const [file, setFile] = useState<File | null>(null)
  const [result, setResult] = useState<UploadMeetingResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const appState: UploadAppState = loading ? "processing" : result ? "results" : "upload"

  async function handleUpload() {
    if (!file) return
    setLoading(true)
    setError(null)
    try {
      const data = await uploadMeeting(file)
      const meetingId = `meeting_${Date.now()}`
      const tasks = generateTasksFromMeeting(data.analysis, meetingId, data.filename)
      addTasks(tasks)
      addMeeting(data.filename, data.analysis, data.transcript, tasks.map((t) => t.id), meetingId)
      setResult(data)
    } catch {
      setError("Something went wrong processing the meeting.")
    } finally {
      setLoading(false)
    }
  }

  function handleFileChange(f: File | null) {
    setFile(f)
    setResult(null)
    setError(null)
  }

  function handleReset() {
    setFile(null)
    setResult(null)
    setError(null)
  }

  return (
    <div className={`flex min-h-svh flex-col bg-black ${appState === "upload" ? "h-svh overflow-hidden" : ""}`}>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-60 focus:rounded focus:bg-white focus:px-3 focus:py-2 focus:text-black"
      >
        Skip to content
      </a>

      <header className="fixed inset-x-0 top-0 z-50 flex h-16 items-center justify-between px-5 animate-fade-in sm:px-8 lg:px-12">
        <Link
          href="/"
          className="flex items-center gap-2.5 text-[17px] font-bold tracking-tight text-white no-underline transition-colors hover:text-white/70"
        >
          <Logo />
          AutoMeet.
        </Link>
        <nav className="flex items-center gap-2 sm:gap-3" aria-label="Primary">
          <Link
            href="/workspace"
            className="inline-flex h-9 cursor-pointer items-center rounded-full border border-white/70 px-4 text-[13px] font-medium text-white no-underline transition-colors hover:border-white hover:bg-white/10"
          >
            Open workspace
          </Link>
        </nav>
      </header>

      <main id="main" className="flex min-h-0 flex-1 flex-col">
        <AnimatePresence mode="wait">
          {appState === "upload" && (
            <motion.div
              key="upload"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="relative flex min-h-0 flex-1 flex-col overflow-hidden"
            >
              <div className="hero-spotlight" aria-hidden />
              <div className="hero-grain" aria-hidden />
              <div className="pointer-events-none absolute inset-0 z-0" aria-hidden>
                {STARS.map((s, i) => (
                  <div
                    key={i}
                    className="hero-star"
                    style={{
                      width: s.w,
                      height: s.w,
                      top: s.t,
                      left: s.l,
                      ["--d" as string]: s.d,
                      ["--delay" as string]: s.dl,
                      ["--op" as string]: s.op,
                    }}
                  />
                ))}
              </div>

              <div className="relative z-10 mx-auto grid min-h-0 w-full max-w-[1280px] flex-1 items-center gap-10 overflow-y-auto px-5 pt-24 pb-10 sm:px-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-16 lg:px-12 lg:pt-28 lg:pb-12">
                <div className="text-center lg:text-left">
                  <h1 className="m-0 text-white">
                    <span className="mb-1 block overflow-hidden font-sans text-[clamp(20px,2.2vw,30px)] leading-[1.2] font-medium tracking-tight text-white/50">
                      <span className="block animate-fade-up [animation-delay:50ms]">Turn a recording into</span>
                    </span>
                    <span className="font-serif block overflow-hidden text-[clamp(44px,8vw,92px)] leading-[0.88] font-normal tracking-tight italic">
                      <span className="block animate-fade-up [animation-delay:160ms]">decisions &amp; owners.</span>
                    </span>
                  </h1>
                  <p className="mx-auto mt-6 mb-8 max-w-[28rem] animate-fade-up text-[15px] leading-relaxed font-light text-white/40 [animation-delay:280ms] lg:mx-0">
                    Transcript, summary, and action items — in under two minutes. Nothing extra on the page.
                  </p>
                  <div id="upload" className="animate-fade-up [animation-delay:400ms]">
                    <UploadZone file={file} error={error} onFileChange={handleFileChange} onUpload={handleUpload} />
                  </div>
                </div>
                <div className="animate-fade-up min-w-0 [animation-delay:500ms]">
                  <HeroProductStage />
                </div>
              </div>
            </motion.div>
          )}

          {appState === "processing" && (
            <motion.div
              key="processing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex min-h-svh flex-1 items-center justify-center px-6"
            >
              <ProcessingState />
            </motion.div>
          )}

          {appState === "results" && result && (
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1"
            >
              <div className="sticky top-0 z-40 flex flex-wrap items-center gap-2.5 border-b border-white/[0.06] bg-black/92 px-5 py-2.5 backdrop-blur-md sm:px-8">
                <button
                  type="button"
                  onClick={handleReset}
                  className="inline-flex cursor-pointer items-center gap-1.5 text-[11px] text-fg-4 transition-colors hover:text-fg-2"
                >
                  <svg width="11" height="11" viewBox="0 0 11 11" fill="none" aria-hidden>
                    <path d="M7 1L3 5.5L7 10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  New analysis
                </button>
                <span className="text-[11px] text-white/10">·</span>
                <span className="truncate text-[11px] text-white/25">{result.filename}</span>
                <Link
                  href="/workspace"
                  className="ml-auto inline-flex cursor-pointer items-center rounded-sm bg-white px-3 py-1.5 text-[12px] font-medium text-black no-underline hover:bg-white/88"
                >
                  Open in workspace
                </Link>
              </div>
              <div className="mx-auto max-w-[700px] px-5 py-11 pb-20 sm:px-8">
                <MeetingResults result={result} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  )
}
