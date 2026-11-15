import type { ButtonHTMLAttributes } from "react"
import clsx from "clsx"

export const btn = {
  primary:
    "inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-xl bg-white px-4 text-[13px] font-semibold text-black no-underline shadow-[0_1px_0_rgba(255,255,255,0.25)_inset] transition-all hover:bg-white/90 hover:-translate-y-px hover:shadow-[0_10px_24px_rgba(255,255,255,0.12)] active:translate-y-0 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-40",
  secondary:
    "inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-xl border border-white/30 bg-white/10 px-4 text-[13px] font-semibold text-white no-underline transition-all hover:-translate-y-px hover:border-white/55 hover:bg-white/18 active:translate-y-0 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-40",
  outline:
    "inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-xl border border-white/25 bg-white/[0.06] px-4 text-[13px] font-semibold text-fg no-underline transition-all hover:-translate-y-px hover:border-white/45 hover:bg-white/12 hover:text-white active:translate-y-0 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-40",
  ghost:
    "inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-xl border border-transparent bg-transparent px-3 text-[13px] font-semibold text-fg-2 no-underline transition-all hover:border-white/15 hover:bg-white/8 hover:text-fg active:scale-[0.98] disabled:pointer-events-none disabled:opacity-40",
  icon: "inline-flex size-10 cursor-pointer items-center justify-center rounded-xl border border-white/25 bg-white/8 text-fg-2 transition-all hover:border-white/45 hover:bg-white/14 hover:text-fg active:scale-95 disabled:pointer-events-none disabled:opacity-40",
}

type Variant = keyof typeof btn

export function Button({
  variant = "primary",
  className,
  type = "button",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return <button type={type} className={clsx(btn[variant], className)} {...props} />
}
