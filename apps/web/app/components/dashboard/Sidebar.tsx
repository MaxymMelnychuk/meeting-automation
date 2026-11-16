"use client"

import type { ReactNode } from "react"
import { motion } from "framer-motion"
import { FileAudio, CheckSquare, ArrowLeft } from "lucide-react"
import { useRouter, usePathname } from "next/navigation"
import { useApp } from "../../providers/AppProvider"

type NavId = "meetings" | "tasks"
type NavItem = { id: NavId; label: string; icon: ReactNode; href: string }

const NAV: NavItem[] = [
  { id: "meetings", label: "Meetings", icon: <FileAudio size={14} />, href: "/workspace/meetings" },
  { id: "tasks",    label: "Tasks",    icon: <CheckSquare size={14} />, href: "/workspace/tasks" },
]

export function Sidebar({ onGoHome }: { onGoHome: () => void }) {
  const router = useRouter()
  const pathname = usePathname()
  const { tasks } = useApp()
  const pendingCount = tasks.filter(t => t.status === "pending" && t.isAISuggested).length

  return (
    <aside className="hidden md:flex flex-col flex-shrink-0 h-full w-[180px] border-r" style={{ background: "var(--bg)", borderColor: "var(--border)" }}>
      {/* Back to home */}
      <button
        onClick={onGoHome}
        title="Back to home"
        className="flex items-center gap-2 px-4 py-3 text-xs font-medium cursor-pointer transition-colors hover:text-white/70 border-b w-full text-left"
        style={{ color: "rgba(255,255,255,0.35)", borderColor: "var(--border)" }}
      >
        <ArrowLeft size={12} />
        Home
      </button>

      {/* Logo */}
      <div className="flex items-center gap-2 px-4 py-3 border-b" style={{ borderColor: "var(--border)" }}>
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
          <circle cx="8" cy="8" r="3" stroke="rgba(255,255,255,0.6)" strokeWidth="1"/>
          <circle cx="8" cy="8" r="7" stroke="rgba(255,255,255,0.12)" strokeWidth="0.5"/>
        </svg>
        <span className="text-xs font-medium tracking-wide" style={{ color: "rgba(255,255,255,0.6)" }}>AutoMeet</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 flex flex-col gap-px p-2 overflow-y-auto">
        {NAV.map(({ id, label, icon, href }) => {
          const active = pathname === href || pathname.startsWith(href + "/")
          return (
            <button
              key={id}
              onClick={() => router.push(href)}
              title={label}
              className="relative w-full flex items-center gap-2 px-3 py-2 rounded text-xs text-left cursor-pointer transition-colors"
              style={{
                fontWeight: active ? 500 : 400,
                color: active ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.3)",
                background: "transparent",
                border: "none",
              }}
            >
              {active && (
                <motion.div
                  layoutId="nav-pill"
                  className="absolute inset-0 rounded"
                  style={{ background: "rgba(255,255,255,0.06)" }}
                  transition={{ type: "spring", bounce: 0.1, duration: 0.3 }}
                />
              )}
              <span className="relative z-10" style={{ color: active ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.2)" }}>{icon}</span>
              <span className="relative z-10 flex-1">{label}</span>
              {id === "tasks" && pendingCount > 0 && (
                <span className="relative z-10 text-[9px] font-medium px-1.5 py-0.5 rounded" style={{ background: "rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.4)", border: "1px solid rgba(255,255,255,0.08)" }}>
                  {pendingCount}
                </span>
              )}
            </button>
          )
        })}
      </nav>
    </aside>
  )
}
