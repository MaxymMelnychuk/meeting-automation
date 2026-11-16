"use client"

import type { ReactNode } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, FileAudio, CheckSquare, CalendarDays } from "lucide-react"
import { Logo } from "../ui/Logo"
import { MeetingDetailDrawer } from "../meeting/MeetingDetailDrawer"
import { useApp } from "../../providers/AppProvider"

const NAV = [
  { href: "/workspace", label: "Overview", icon: Home, end: true },
  { href: "/workspace/meetings", label: "Meetings", icon: FileAudio },
  { href: "/workspace/tasks", label: "Tasks", icon: CheckSquare },
  { href: "/workspace/schedule", label: "Schedule", icon: CalendarDays },
] as const

function isActive(pathname: string, href: string, end?: boolean) {
  if (end) return pathname === href
  return pathname === href || pathname.startsWith(href + "/")
}

export function WorkspaceShell({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const { tasks } = useApp()
  const pending = tasks.filter((t) => t.status === "pending" && t.isAISuggested).length

  return (
    <div className="flex h-svh overflow-hidden bg-bg">
      <aside className="hidden w-[232px] shrink-0 flex-col border-r border-line px-4 py-5 md:flex">
        <Link
          href="/"
          className="mb-7 inline-flex h-11 cursor-pointer items-center gap-2.5 rounded-xl px-3 text-[15px] font-bold tracking-tight text-white no-underline transition-all hover:bg-white/10"
        >
          <Logo className="size-7" />
          AutoMeet.
        </Link>

        <nav className="flex flex-col gap-1.5" aria-label="Workspace">
          {NAV.map((item) => {
            const active = isActive(pathname, item.href, "end" in item && item.end)
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`relative flex h-11 cursor-pointer items-center gap-3 rounded-xl px-3 text-[13px] font-semibold no-underline transition-all ${
                  active
                    ? "bg-white text-black shadow-[0_1px_0_rgba(255,255,255,0.2)_inset]"
                    : "border border-transparent text-fg-3 hover:border-white/10 hover:bg-white/[0.08] hover:text-white"
                }`}
              >
                <Icon size={16} />
                {item.label}
                {item.href === "/workspace/tasks" && pending > 0 && (
                  <span className={`ml-auto min-w-5 rounded-lg px-1.5 py-0.5 text-center text-[10px] font-semibold ${
                    active ? "bg-black/15 text-black" : "bg-white/15 text-fg-2"
                  }`}>
                    {pending}
                  </span>
                )}
              </Link>
            )
          })}
        </nav>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex h-14 shrink-0 items-center border-b border-line px-5 md:hidden">
          <Link
            href="/"
            className="inline-flex h-11 cursor-pointer items-center gap-2 rounded-xl px-2.5 text-sm font-bold text-fg no-underline transition-all hover:bg-white/10"
          >
            <Logo className="size-6" />
            AutoMeet.
          </Link>
        </div>

        <div className="relative min-h-0 flex-1 overflow-y-auto px-5 py-8 pb-28 md:px-10 md:py-10 md:pb-10">
          {children}
        </div>
      </div>

      <MeetingDetailDrawer />

      <nav
        className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-bg/95 px-3 py-2.5 backdrop-blur-md md:hidden"
        aria-label="Workspace"
      >
        <div className="flex gap-1">
          {NAV.map((item) => {
            const active = isActive(pathname, item.href, "end" in item && item.end)
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`flex flex-1 cursor-pointer flex-col items-center gap-1 rounded-xl border py-2 text-[10px] font-semibold no-underline transition-all ${
                  active
                    ? "border-white/15 bg-white/12 text-white"
                    : "border-transparent text-fg-4 hover:border-white/10 hover:bg-white/8 hover:text-fg"
                }`}
              >
                <Icon size={18} />
                {item.label}
              </Link>
            )
          })}
        </div>
      </nav>
    </div>
  )
}
