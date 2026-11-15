"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

const PHASES = [
  { label: "Transcribing audio", sub: "Converting speech to text" },
  { label: "Analysing content", sub: "Understanding context and themes" },
  { label: "Extracting insights", sub: "Identifying decisions and actions" },
]

export function ProcessingState() {
  const [phaseIndex, setPhaseIndex] = useState(0)

  useEffect(() => {
    const id = setInterval(() => {
      setPhaseIndex((i) => (i + 1) % PHASES.length)
    }, 3500)
    return () => clearInterval(id)
  }, [])

  const phase = PHASES[phaseIndex]

  return (
    <div className="flex flex-col items-center justify-center gap-12 px-6 py-20 text-center">
      {/* Orbital rings */}
      <div className="relative w-16 h-16 flex items-center justify-center">
        {/* Outer ring */}
        <div
          className="absolute inset-0 rounded-full"
          style={{ border: "1px solid var(--border-2)" }}
        />
        {/* Spinning arc */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            border: "1.5px solid transparent",
            borderTopColor: "var(--text-4)",
            animation: "spin 1.4s linear infinite",
          }}
        />
        {/* Inner ring */}
        <div
          className="absolute rounded-full"
          style={{
            inset: "10px",
            border: "1px solid var(--border)",
          }}
        />
        {/* Spinning arc inner */}
        <div
          className="absolute rounded-full"
          style={{
            inset: "10px",
            border: "1.5px solid transparent",
            borderTopColor: "var(--text-3)",
            animation: "spin 2s linear infinite reverse",
          }}
        />
        {/* Core dot */}
        <div
          className="w-2 h-2 rounded-full"
          style={{ background: "var(--text-3)" }}
        />
      </div>

      {/* Phase label */}
      <AnimatePresence mode="wait">
        <motion.div
          key={phaseIndex}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center gap-2"
        >
          <p className="text-base font-medium tracking-tight" style={{ color: "var(--text-1)" }}>
            {phase.label}
          </p>
          <p className="text-sm" style={{ color: "var(--text-4)" }}>
            {phase.sub}
          </p>
        </motion.div>
      </AnimatePresence>

      {/* Phase progress dots */}
      <div className="flex items-center gap-2">
        {PHASES.map((_, i) => (
          <motion.div
            key={i}
            className="rounded-full"
            animate={{
              width: i === phaseIndex ? 20 : 5,
              background: i === phaseIndex ? "var(--text-2)" : "var(--surface-3)",
            }}
            style={{ height: 5 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          />
        ))}
      </div>

      <p className="text-xs" style={{ color: "var(--text-5)" }}>
        This may take a minute or two
      </p>
    </div>
  )
}
