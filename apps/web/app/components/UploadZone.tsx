"use client"

import { useRef, useState } from "react"

interface UploadZoneProps {
  file: File | null
  error: string | null
  onFileChange: (file: File | null) => void
  onUpload: () => void
}

export function UploadZone({
  file,
  error,
  onFileChange,
  onUpload,
}: UploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault()
    setIsDragging(true)
  }

  function handleDragLeave(e: React.DragEvent) {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsDragging(false)
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setIsDragging(false)
    const dropped = e.dataTransfer.files[0]
    if (dropped) onFileChange(dropped)
  }

  return (
    <div className="anim-rise-in">
      {/* Drop zone */}
      <div
        className={`upload-zone${isDragging ? " dragging" : ""}`}
        onClick={() => inputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        role="button"
        tabIndex={0}
        aria-label="Upload meeting recording"
        onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
      >
        {/* Upload icon */}
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: 11,
            background: "var(--surface)",
            border: "1px solid var(--border)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 24px",
          }}
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
            <path
              d="M9 13V2M9 2L5.5 5.5M9 2L12.5 5.5"
              stroke="var(--text-5)"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M2 15.5h14"
              stroke="var(--text-5)"
              strokeWidth="1.4"
              strokeLinecap="round"
            />
          </svg>
        </div>

        {file ? (
          <p
            style={{
              color: "var(--text-2)",
              fontSize: 14,
              fontWeight: 500,
              letterSpacing: "-0.01em",
              margin: 0,
            }}
          >
            {file.name}
          </p>
        ) : (
          <>
            <p style={{ color: "var(--text-4)", fontSize: 14, margin: 0 }}>
              {isDragging ? "Release to upload" : "Drop your meeting recording here"}
            </p>
            <p
              style={{
                color: "var(--text-5)",
                fontSize: 12,
                marginTop: 6,
                marginBottom: 0,
              }}
            >
              or click to browse
            </p>
          </>
        )}

        <input
          ref={inputRef}
          type="file"
          accept="audio/*"
          style={{ display: "none" }}
          onChange={(e) => {
            const f = e.target.files?.[0]
            if (f) onFileChange(f)
          }}
        />
      </div>

      {error && (
        <p
          className="anim-fade-in"
          style={{ color: "var(--error)", fontSize: 13, marginTop: 16 }}
        >
          {error}
        </p>
      )}

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 20,
          marginTop: 24,
        }}
      >
        <button className="btn-primary" onClick={onUpload} disabled={!file}>
          Analyze
        </button>

        {file && (
          <button
            className="btn-ghost anim-fade-in"
            onClick={(e) => {
              e.stopPropagation()
              onFileChange(null)
            }}
          >
            Clear
          </button>
        )}
      </div>
    </div>
  )
}
