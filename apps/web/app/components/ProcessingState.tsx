"use client"

import { useEffect, useState } from "react"

const PHASES = [
  "Transcribing audio",
  "Analysing content",
  "Extracting insights",
]

export function ProcessingState() {
  const [phaseIndex, setPhaseIndex] = useState(0)
  const [fading, setFading] = useState(false)

  useEffect(() => {
    const id = setInterval(() => {
      setFading(true)
      setTimeout(() => {
        setPhaseIndex((i) => (i + 1) % PHASES.length)
        setFading(false)
      }, 400)
    }, 4000)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="anim-rise-in" style={{ paddingTop: 4 }}>
      {/*
        Sonar ring — two concentric waves expanding from a fixed center.
        The rings communicate concentration/processing without mechanical spinning.
        Works in compound with the atmospheric light breathing above.
      */}
      <div style={{ marginBottom: 44 }}>
        <div className="pulse-ring">
          <div className="pulse-ring__core" />
          <div className="pulse-ring__wave" />
          <div className="pulse-ring__wave pulse-ring__wave--2" />
        </div>
      </div>

      <div
        style={{
          opacity: fading ? 0 : 1,
          transform: fading ? "translateY(7px)" : "translateY(0)",
          transition: "opacity 0.38s ease, transform 0.38s ease",
        }}
      >
        <p
          style={{
            color: "var(--text-2)",
            fontSize: 16,
            fontWeight: 400,
            letterSpacing: "-0.01em",
            lineHeight: 1.4,
            margin: 0,
          }}
        >
          {PHASES[phaseIndex]}
        </p>
      </div>

      <p
        style={{
          color: "var(--text-5)",
          fontSize: 12,
          marginTop: 44,
        }}
      >
        This may take a minute
      </p>
    </div>
  )
}
