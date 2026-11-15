import type { ReactNode } from "react"

export function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string
  subtitle?: string
  action?: ReactNode
}) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div className="min-w-0">
        <h1 className="text-[28px] font-semibold tracking-tight text-white">{title}</h1>
        {subtitle && <p className="mt-1.5 text-sm text-fg-3">{subtitle}</p>}
      </div>
      {action}
    </div>
  )
}

export function SectionHeader({
  kicker,
  title,
  action,
}: {
  kicker?: string
  title: string
  action?: ReactNode
}) {
  return (
    <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
      <div className="min-w-0">
        {kicker && (
          <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-fg-3">
            {kicker}
          </p>
        )}
        <h2 className="text-xl font-semibold tracking-tight text-white">{title}</h2>
      </div>
      {action}
    </div>
  )
}
