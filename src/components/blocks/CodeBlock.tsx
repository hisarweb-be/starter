import { Copy } from "lucide-react"

import type { CodeBlockData } from "./types"

export function CodeBlockComponent({ title, code, language }: CodeBlockData) {
  return (
    <section className="mx-auto w-full max-w-4xl px-4 py-16">
      {title && <h2 className="mb-8 text-center font-display text-3xl font-bold">{title}</h2>}

      <div className="overflow-hidden rounded-[1.25rem] border border-border/40 bg-[#0d1117]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-2.5">
          <span className="font-mono text-xs text-white/50">
            {language ?? "code"}
          </span>
          <button
            onClick={() => {
              if (typeof navigator !== "undefined") {
                navigator.clipboard.writeText(code)
              }
            }}
            className="flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-white/50 hover:bg-white/10 hover:text-white/80"
          >
            <Copy className="h-3 w-3" />
            Kopieer
          </button>
        </div>

        {/* Code content */}
        <pre className="overflow-x-auto p-5">
          <code className="font-mono text-sm leading-relaxed text-[#e6edf3]">
            {code}
          </code>
        </pre>
      </div>
    </section>
  )
}
