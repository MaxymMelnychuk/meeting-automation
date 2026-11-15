"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

const LINES = [
  { t: "04:12", who: "Maya", text: "Ship v2 Friday. The wait is costing us deals." },
  { t: "04:18", who: "Alex", text: "I'll own the launch note and ping sales." },
  { t: "04:31", who: "Maya", text: "Pricing stays. We review after the first 20." },
  { t: "04:44", who: "Jules", text: "I'll brief the board deck before Thursday." },
]

const INSIGHTS = [
  { kind: "Decision", title: "Ship v2 this Friday", meta: "Maya · confirmed" },
  { kind: "Action", title: "Draft the launch note", meta: "Alex owns this" },
  { kind: "Action", title: "Brief sales on pricing", meta: "This week" },
  { kind: "Action", title: "Board deck by Thursday", meta: "Jules" },
]

const STEPS = [
  { n: "01", label: "Record" },
  { n: "02", label: "Transcribe" },
  { n: "03", label: "Extract owners" },
]

export function HeroProductStage() {
  const [visibleLines, setVisibleLines] = useState(1)
  const [active, setActive] = useState(0)
  const [step, setStep] = useState(0)

  useEffect(() => {
    const lineId = window.setInterval(() => {
      setVisibleLines((n) => (n >= LINES.length ? 1 : n + 1))
    }, 1600)
    const insightId = window.setInterval(() => {
      setActive((i) => (i + 1) % INSIGHTS.length)
    }, 2200)
    const stepId = window.setInterval(() => {
      setStep((s) => (s + 1) % STEPS.length)
    }, 2400)
    return () => {
      window.clearInterval(lineId)
      window.clearInterval(insightId)
      window.clearInterval(stepId)
    }
  }, [])

  return (
    <div className="w-full">
      <div className="relative overflow-hidden rounded-2xl border border-white/12 bg-[linear-gradient(180deg,rgba(255,255,255,0.055)_0%,rgba(255,255,255,0.018)_100%),#0b0b0b] shadow-[0_40px_100px_rgba(0,0,0,0.55)]">
        <div className="pointer-events-none absolute inset-x-[12%] top-0 z-10 h-px bg-gradient-to-r from-transparent via-white/35 to-transparent" />

        <div className="flex items-center gap-3 border-b border-white/[0.07] bg-white/[0.02] px-3.5 py-2.5 sm:px-4">
          <span className="flex gap-1.5" aria-hidden>
            <i className="block size-1.5 rounded-full bg-white/12" />
            <i className="block size-1.5 rounded-full bg-white/12" />
            <i className="block size-1.5 rounded-full bg-white/12" />
          </span>
          <span className="min-w-0 flex-1 truncate text-xs text-white/45">Q3 planning · 42:18</span>
          <span className="hidden items-center gap-1.5 text-[10px] tracking-wider text-white/40 uppercase sm:inline-flex">
            <span className="size-1.5 animate-live rounded-full bg-white" />
            Live extract
          </span>
        </div>

        <div className="grid min-h-[320px] lg:grid-cols-[1.15fr_0.85fr]">
          <div className="border-white/[0.06] p-4 sm:p-5 lg:border-r">
            <p className="mb-3 text-[10px] tracking-[0.14em] text-white/28 uppercase">Transcript</p>
            <div className="mb-4 flex h-9 items-end gap-[3px]" aria-hidden>
              {Array.from({ length: 36 }).map((_, i) => (
                <span
                  key={i}
                  className="h-full flex-1 origin-bottom animate-wave rounded-px bg-white/22"
                  style={{ animationDelay: `${(i % 9) * 90}ms` }}
                />
              ))}
            </div>
            <ul className="flex flex-col gap-3.5">
              {LINES.slice(0, visibleLines).map((line, i) => (
                <motion.li
                  key={`${line.t}-${visibleLines === 1 ? i : line.t}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-2.5"
                >
                  <span className="mt-0.5 flex size-5.5 shrink-0 items-center justify-center rounded-full border border-white/12 bg-white/6 text-[9px] font-medium text-white/55">
                    {line.who[0]}
                  </span>
                  <div className="flex min-w-0 flex-col gap-0.5">
                    <span className="text-[10px] tracking-wide text-white/28">
                      <b className="font-medium text-white/55">{line.who}</b> {line.t}
                    </span>
                    <span className="text-[13px] leading-snug tracking-tight text-white/72">{line.text}</span>
                  </div>
                </motion.li>
              ))}
            </ul>
          </div>

          <div className="border-t border-white/[0.06] p-4 sm:p-5 lg:border-t-0">
            <p className="mb-3 text-[10px] tracking-[0.14em] text-white/28 uppercase">Extracted</p>
            <div className="flex flex-col gap-2">
              {INSIGHTS.map((item, i) => (
                <article
                  key={item.title}
                  className={`rounded-md border px-3 py-2.5 transition-colors ${
                    i === active
                      ? "animate-insight border-white/20 bg-white/5"
                      : "border-white/8 bg-white/[0.02]"
                  }`}
                >
                  <span className="mb-1 block text-[9px] tracking-[0.12em] text-white/32 uppercase">{item.kind}</span>
                  <strong className="block text-[13px] leading-snug font-medium tracking-tight text-white">{item.title}</strong>
                  <em className="mt-1 block text-[11px] not-italic text-white/32">{item.meta}</em>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>

      <ol className="mt-5 grid grid-cols-3 gap-2 sm:mt-6 sm:gap-4">
        {STEPS.map((s, i) => (
          <li
            key={s.n}
            className={`flex items-baseline gap-2 rounded-lg px-2 py-2 text-left text-[13px] tracking-tight transition-colors sm:px-3 ${
              i === step ? "text-white/80" : "text-white/35"
            }`}
          >
            <span className={`font-serif text-base italic ${i === step ? "text-white/70" : "text-white/30"}`}>{s.n}</span>
            {s.label}
          </li>
        ))}
      </ol>
      <AnimatePresence mode="wait">
        <motion.p
          key={step}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="mt-1 px-2 text-xs text-white/30 sm:px-3"
        >
          {step === 0 && "Drop a recording. Audio stays on the board while it runs."}
          {step === 1 && "Speech becomes a searchable transcript in under two minutes."}
          {step === 2 && "Decisions and owners are pulled out so the meeting does not die in a doc."}
        </motion.p>
      </AnimatePresence>
    </div>
  )
}
