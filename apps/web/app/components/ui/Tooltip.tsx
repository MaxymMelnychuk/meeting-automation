"use client"

import type { ReactNode } from "react"

export function Tooltip({
  label,
  side = "right",
  children,
}: {
  label: string
  side?: "right" | "bottom" | "left"
  children: ReactNode
}) {
  const pos =
    side === "bottom"
      ? "top-full left-1/2 mt-2 -translate-x-1/2"
      : side === "left"
        ? "right-full top-1/2 mr-2 -translate-y-1/2"
        : "left-full top-1/2 ml-2 -translate-y-1/2"

  return (
    <span className="group/tip relative inline-flex">
      {children}
      <span
        role="tooltip"
        className={`pointer-events-none absolute z-50 whitespace-nowrap rounded-md border border-line-2 bg-surface-3 px-2 py-1 text-[11px] text-fg-2 opacity-0 shadow-lg transition-opacity duration-150 group-hover/tip:opacity-100 group-focus-within/tip:opacity-100 ${pos}`}
      >
        {label}
      </span>
    </span>
  )
}
