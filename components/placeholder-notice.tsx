import type { ReactNode } from "react"

// Wraps any placeholder value (business details, legal copy) so it is
// visually unmistakable and cannot be confused with real, launch-ready content.
export function PlaceholderNotice({ children }: { children: ReactNode }) {
  return (
    <span className="rounded bg-yellow-100 px-1.5 py-0.5 font-mono text-[0.85em] text-yellow-900 dark:bg-yellow-900/40 dark:text-yellow-200">
      {children}
    </span>
  )
}
