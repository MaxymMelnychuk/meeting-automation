import type { TaskConfidence } from "@/lib/types"

const CONFIG: Record<
  TaskConfidence,
  { label: string; dotColor: string; textColor: string; bg: string; border: string }
> = {
  confirmed: {
    label: "Confirmed",
    dotColor: "#4ade80",
    textColor: "#4ade80",
    bg: "rgba(74,222,128,0.07)",
    border: "rgba(74,222,128,0.2)",
  },
  needs_review: {
    label: "Needs review",
    dotColor: "#fbbf24",
    textColor: "#fbbf24",
    bg: "rgba(251,191,36,0.07)",
    border: "rgba(251,191,36,0.2)",
  },
  unresolved: {
    label: "Unresolved",
    dotColor: "#f87171",
    textColor: "#f87171",
    bg: "rgba(248,113,113,0.07)",
    border: "rgba(248,113,113,0.2)",
  },
}

type Props = {
  confidence: TaskConfidence
  reason?: string
  size?: "sm" | "md"
}

export function ConfidenceBadge({ confidence, reason, size = "sm" }: Props) {
  const c = CONFIG[confidence]
  const fontSize = size === "sm" ? 10 : 11

  return (
    <div className="flex flex-col gap-1">
      <span
        className="inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 font-semibold tracking-wide uppercase"
        style={{
          fontSize,
          background: c.bg,
          border: `1px solid ${c.border}`,
        }}
      >
        <span
          style={{
            width: 5,
            height: 5,
            borderRadius: "50%",
            background: c.dotColor,
            flexShrink: 0,
          }}
        />
        <span style={{ color: c.textColor }}>{c.label}</span>
      </span>
      {reason && (
        <p
          className="leading-snug"
          style={{ fontSize: 11, color: "var(--text-4)", maxWidth: 260 }}
        >
          {reason}
        </p>
      )}
    </div>
  )
}
