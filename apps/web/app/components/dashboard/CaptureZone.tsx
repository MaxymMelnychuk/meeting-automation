"use client"

import { useEffect, useRef, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Mic, Pause, Play, Square, Trash2, Upload, ArrowRight } from "lucide-react"
import { useApp } from "../../providers/AppProvider"
import { uploadMeeting } from "@/api/meetings"
import { generateTasksFromMeeting } from "@/hooks/useTasks"
import { Button } from "../ui/Button"

type Phase = "choose" | "file" | "recording" | "paused" | "reviewing" | "processing"

function fmt(secs: number): string {
  const m = Math.floor(secs / 60).toString().padStart(2, "0")
  const s = (secs % 60).toString().padStart(2, "0")
  return `${m}:${s}`
}

function fileSize(b: number) {
  return b < 1024 * 1024 ? `${(b / 1024).toFixed(0)} KB` : `${(b / 1024 / 1024).toFixed(1)} MB`
}

export function CaptureZone() {
  const { addMeeting, addTasks, openMeeting } = useApp()
  const [phase, setPhase] = useState<Phase>("choose")
  const [file, setFile] = useState<File | null>(null)
  const [elapsed, setElapsed] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [dragging, setDragging] = useState(false)

  const inputRef = useRef<HTMLInputElement>(null)
  const recorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const blobRef = useRef<Blob | null>(null)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  function stopTimer() {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
  }

  function stopTracks() {
    recorderRef.current?.stream.getTracks().forEach((t) => t.stop())
    recorderRef.current = null
  }

  useEffect(() => () => {
    stopTimer()
    stopTracks()
  }, [])

  function pickFile(next: File | null) {
    stopTimer()
    stopTracks()
    blobRef.current = null
    chunksRef.current = []
    setElapsed(0)
    setError(null)
    setFile(next)
    setPhase(next ? "file" : "choose")
  }

  async function startRecording() {
    setError(null)
    setFile(null)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
        ? "audio/webm;codecs=opus"
        : "audio/webm"
      const rec = new MediaRecorder(stream, { mimeType })
      chunksRef.current = []
      rec.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data)
      }
      rec.start(1000)
      recorderRef.current = rec
      setPhase("recording")
      setElapsed(0)
      timerRef.current = setInterval(() => setElapsed((s) => s + 1), 1000)
    } catch {
      setError("Microphone access was denied. You can still import a file.")
      setPhase("choose")
    }
  }

  function pauseRecording() {
    if (recorderRef.current?.state === "recording") {
      recorderRef.current.pause()
      stopTimer()
      setPhase("paused")
    }
  }

  function resumeRecording() {
    if (recorderRef.current?.state === "paused") {
      recorderRef.current.resume()
      timerRef.current = setInterval(() => setElapsed((s) => s + 1), 1000)
      setPhase("recording")
    }
  }

  async function stopRecording() {
    stopTimer()
    const rec = recorderRef.current
    if (!rec) return
    await new Promise<void>((resolve) => {
      rec.onstop = () => {
        blobRef.current = new Blob(chunksRef.current, { type: rec.mimeType || "audio/webm" })
        resolve()
      }
      rec.stop()
      rec.stream.getTracks().forEach((t) => t.stop())
    })
    recorderRef.current = null
    setPhase("reviewing")
  }

  function discard() {
    stopTimer()
    stopTracks()
    blobRef.current = null
    chunksRef.current = []
    setElapsed(0)
    setFile(null)
    setError(null)
    setPhase("choose")
  }

  async function processFile(source: File) {
    setPhase("processing")
    setError(null)
    try {
      const result = await uploadMeeting(source)
      const meetingId = `meeting_${Date.now()}`
      const tasks = generateTasksFromMeeting(result.analysis, meetingId, result.filename)
      const taskIds = addTasks(tasks)
      addMeeting(result.filename, result.analysis, result.transcript, taskIds, meetingId)
      blobRef.current = null
      chunksRef.current = []
      setElapsed(0)
      setFile(null)
      setPhase("choose")
      openMeeting(meetingId)
    } catch {
      setError("Processing failed. Is the backend running?")
      setPhase(blobRef.current ? "reviewing" : file ? "file" : "choose")
    }
  }

  function analyze() {
    if (file) return processFile(file)
    if (!blobRef.current) return
    const name = `recording-${new Date().toISOString().replace(/[:.]/g, "-")}.webm`
    return processFile(new File([blobRef.current], name, { type: blobRef.current.type }))
  }

  const busy = phase === "recording" || phase === "paused" || phase === "processing"

  return (
    <section
      className={`rounded-2xl border bg-surface p-5 transition-colors md:p-6 ${
        dragging ? "border-white/40 bg-white/[0.04]" : "border-white/12"
      }`}
      onDragOver={(e) => {
        e.preventDefault()
        if (!busy) setDragging(true)
      }}
      onDragLeave={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) setDragging(false)
      }}
      onDrop={(e) => {
        e.preventDefault()
        setDragging(false)
        if (busy) return
        const next = e.dataTransfer.files[0]
        if (next) pickFile(next)
      }}
    >
      <input
        ref={inputRef}
        type="file"
        accept="audio/*,video/mp4,video/webm"
        hidden
        onChange={(e) => {
          const next = e.target.files?.[0]
          if (next) pickFile(next)
          e.target.value = ""
        }}
      />

      <div className="mb-5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-fg-3">Start</p>
        <h2 className="mt-1 text-xl font-semibold tracking-tight text-white">Import or record</h2>
        <p className="mt-1.5 text-sm text-fg-3">Drop a file, import one, or capture live audio. Both paths run the same analysis.</p>
      </div>

      <AnimatePresence mode="wait">
        {phase === "choose" && (
          <motion.div
            key="choose"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="grid gap-3 sm:grid-cols-2"
          >
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="flex cursor-pointer flex-col items-start gap-3 rounded-xl border border-white/12 bg-white/[0.03] px-5 py-6 text-left transition-all hover:-translate-y-px hover:border-white/30 hover:bg-white/[0.07]"
            >
              <span className="flex size-11 items-center justify-center rounded-xl border border-white/20 bg-white/8 text-white">
                <Upload size={18} />
              </span>
              <span>
                <span className="block text-base font-semibold text-white">Import recording</span>
                <span className="mt-1 block text-sm text-fg-3">MP3, WAV, MP4, or WebM</span>
              </span>
            </button>
            <button
              type="button"
              onClick={startRecording}
              className="flex cursor-pointer flex-col items-start gap-3 rounded-xl border border-white/12 bg-white/[0.03] px-5 py-6 text-left transition-all hover:-translate-y-px hover:border-white/30 hover:bg-white/[0.07]"
            >
              <span className="flex size-11 items-center justify-center rounded-xl border border-white/40 bg-white text-black">
                <Mic size={18} />
              </span>
              <span>
                <span className="block text-base font-semibold text-white">Record now</span>
                <span className="mt-1 block text-sm text-fg-3">Capture from your microphone</span>
              </span>
            </button>
          </motion.div>
        )}

        {phase === "file" && file && (
          <motion.div
            key="file"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="flex flex-col gap-4 rounded-xl border border-white/12 bg-white/[0.03] px-5 py-5 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-white">{file.name}</p>
              <p className="mt-1 text-xs text-fg-3">{fileSize(file.size)}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" onClick={discard}>
                <Trash2 size={14} /> Remove
              </Button>
              <Button variant="primary" onClick={analyze}>
                Analyze <ArrowRight size={14} />
              </Button>
            </div>
          </motion.div>
        )}

        {(phase === "recording" || phase === "paused") && (
          <motion.div
            key="live"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="flex flex-col items-center gap-5 rounded-xl border border-white/12 bg-black/35 px-5 py-8"
          >
            <div className="flex items-center gap-2">
              {phase === "recording" ? (
                <span className="size-2 animate-pulse rounded-full bg-white" />
              ) : null}
              <p className="font-mono text-sm text-white">{fmt(elapsed)}</p>
              {phase === "paused" && <span className="text-xs text-fg-3">Paused</span>}
            </div>
            <div className="flex h-[18px] items-center gap-[2.5px]" aria-hidden>
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className={`h-5 w-[2.5px] origin-bottom animate-wave rounded-sm ${
                    phase === "recording" ? "bg-white/60" : "bg-fg-4"
                  }`}
                  style={{
                    animationPlayState: phase === "paused" ? "paused" : "running",
                    animationDelay: `${i * 80}ms`,
                  }}
                />
              ))}
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {phase === "recording" ? (
                <Button variant="outline" onClick={pauseRecording}>
                  <Pause size={12} /> Pause
                </Button>
              ) : (
                <Button variant="outline" onClick={resumeRecording}>
                  <Play size={12} /> Resume
                </Button>
              )}
              <Button variant="secondary" onClick={stopRecording}>
                <Square size={10} /> Stop
              </Button>
              <Button variant="ghost" onClick={discard}>
                Cancel
              </Button>
            </div>
          </motion.div>
        )}

        {phase === "reviewing" && (
          <motion.div
            key="review"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="flex flex-col items-center gap-4 rounded-xl border border-white/12 bg-white/[0.03] px-5 py-8"
          >
            <p className="text-sm font-semibold text-white">Recording ready</p>
            <p className="text-xs text-fg-3">Duration {fmt(elapsed)}</p>
            <div className="flex flex-wrap justify-center gap-2">
              <Button variant="outline" onClick={discard}>
                <Trash2 size={12} /> Discard
              </Button>
              <Button variant="primary" onClick={analyze}>
                Analyze <ArrowRight size={12} />
              </Button>
            </div>
          </motion.div>
        )}

        {phase === "processing" && (
          <motion.div
            key="processing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center gap-3 rounded-xl border border-white/12 bg-black/35 px-5 py-10"
          >
            <div className="relative size-2.5">
              <div className="absolute inset-0 rounded-full border border-white/15" />
              <div className="absolute inset-0 animate-ring rounded-full border border-white/8" />
            </div>
            <p className="text-sm font-medium text-white">Analyzing meeting…</p>
            <p className="text-xs text-fg-3">Transcript, summary, and owners</p>
          </motion.div>
        )}
      </AnimatePresence>

      {error && <p className="mt-4 text-sm text-fg-3">{error}</p>}
    </section>
  )
}
