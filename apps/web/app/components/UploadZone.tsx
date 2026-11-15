"use client"

import { useRef, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import Link from "next/link"

interface UploadZoneProps {
  file: File | null
  error: string | null
  onFileChange: (file: File | null) => void
  onUpload: () => void
}

export function UploadZone({ file, error, onFileChange, onUpload }: UploadZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)

  function fmt(b: number) {
    return b < 1024 * 1024 ? `${(b / 1024).toFixed(0)} KB` : `${(b / 1024 / 1024).toFixed(1)} MB`
  }

  return (
    <div
      className={dragging ? "[&_button]:-translate-y-px" : ""}
      onDragOver={(e) => {
        e.preventDefault()
        setDragging(true)
      }}
      onDragLeave={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) setDragging(false)
      }}
      onDrop={(e) => {
        e.preventDefault()
        setDragging(false)
        const f = e.dataTransfer.files[0]
        if (f) onFileChange(f)
      }}
    >
      <input
        ref={inputRef}
        type="file"
        accept="audio/*,video/mp4,video/webm"
        hidden
        onChange={(e) => {
          const f = e.target.files?.[0]
          if (f) onFileChange(f)
        }}
      />

      <AnimatePresence mode="wait">
        {file ? (
          <motion.div
            key="ready"
            className="flex flex-wrap items-center justify-center gap-2.5"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex h-11 min-w-0 items-center gap-2.5 rounded border border-line-2 bg-white/[0.03] py-0 pr-2 pl-3.5">
              <span className="max-w-[180px] truncate text-[13px] text-fg">{file.name}</span>
              <span className="text-[11px] text-fg-4">{fmt(file.size)}</span>
              <button
                type="button"
                aria-label="Remove file"
                onClick={() => onFileChange(null)}
                className="size-6 cursor-pointer text-base leading-none text-fg-4 transition-colors hover:text-fg"
              >
                ×
              </button>
            </div>
            <button
              type="button"
              className="inline-flex h-11 cursor-pointer items-center gap-2 rounded-sm bg-white px-[18px] text-[13px] font-medium text-black transition-colors hover:bg-white/88 active:scale-[0.97]"
              onClick={onUpload}
            >
              Analyze meeting
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="empty"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-start"
          >
            <div className="flex flex-wrap items-center justify-center gap-2.5">
              <button
                type="button"
                className="inline-flex h-11 cursor-pointer items-center gap-2 rounded-sm bg-white px-[18px] text-[13px] font-medium text-black transition-colors hover:bg-white/88 active:scale-[0.97]"
                onClick={() => inputRef.current?.click()}
              >
                Upload recording
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
                  <path d="M6 8.5V1.5M6 1.5L3.5 4M6 1.5L8.5 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M1.5 10.5h9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                </svg>
              </button>
              <Link
                href="/workspace"
                className="inline-flex h-11 cursor-pointer items-center rounded-sm border border-line-2 px-4 text-xs text-fg-3 no-underline transition-colors hover:border-line-strong hover:text-fg"
              >
                Open workspace
              </Link>
            </div>
            <p className="mt-2.5 text-center text-[11px] tracking-wide text-fg-4">
              Or drop a file anywhere on this page · MP3 MP4 WAV
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {error && (
          <motion.p
            className="mt-2.5 text-center text-xs text-fg-3"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}
