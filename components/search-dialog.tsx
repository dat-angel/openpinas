"use client"

import { useEffect, useState } from "react"
import { Search, ArrowRight, Network, Scale, Building2, GraduationCap, MapPin } from "lucide-react"

const CATEGORIES = [
  { label: "Dynasties", icon: Network, count: "71 families" },
  { label: "Corruption Cases", icon: Scale, count: "4 cases" },
  { label: "Business Connections", icon: Building2, count: "12 entities" },
  { label: "Elite Schools", icon: GraduationCap, count: "6 institutions" },
  { label: "Provinces", icon: MapPin, count: "71 provinces" },
]

const SUGGESTIONS = [
  "Marcos-Romualdez Dynasty",
  "Alice Guo POGO Case",
  "Flood Control Corruption",
  "Duterte ICC Detention",
  "San Miguel Corporation",
  "University of the Philippines",
]

interface SearchDialogProps {
  open: boolean
  onClose: () => void
}

export function SearchDialog({ open, onClose }: SearchDialogProps) {
  const [query, setQuery] = useState("")

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onClose()
      }
    }
    if (open) {
      document.addEventListener("keydown", handleKeyDown)
      document.body.style.overflow = "hidden"
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown)
      document.body.style.overflow = ""
    }
  }, [open, onClose])

  useEffect(() => {
    if (!open) setQuery("")
  }, [open])

  if (!open) return null

  const filteredSuggestions = query
    ? SUGGESTIONS.filter((s) => s.toLowerCase().includes(query.toLowerCase()))
    : SUGGESTIONS

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]">
      <div
        className="fixed inset-0 bg-background/80 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="relative z-50 w-full max-w-lg rounded-xl border border-border bg-card shadow-2xl">
        <div className="flex items-center gap-3 border-b border-border px-4 py-3">
          <Search className="h-5 w-5 shrink-0 text-muted-foreground" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search dynasties, cases, provinces..."
            className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none"
            autoFocus
          />
          <button
            onClick={onClose}
            className="flex h-6 items-center rounded border border-border bg-secondary px-1.5 text-xs text-muted-foreground"
          >
            ESC
          </button>
        </div>

        <div className="max-h-80 overflow-y-auto p-2">
          {!query && (
            <div className="mb-3 px-2 pt-2">
              <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Categories
              </p>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.label}
                    className="flex items-center gap-1.5 rounded-lg border border-border bg-secondary px-3 py-1.5 text-sm text-foreground transition-colors hover:border-primary hover:text-primary"
                  >
                    <cat.icon className="h-3.5 w-3.5" />
                    <span>{cat.label}</span>
                    <span className="text-xs text-muted-foreground">
                      {cat.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="px-2 pt-1">
            <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              {query ? "Results" : "Suggestions"}
            </p>
            {filteredSuggestions.length > 0 ? (
              <ul className="space-y-1">
                {filteredSuggestions.map((suggestion) => (
                  <li key={suggestion}>
                    <button className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm text-foreground transition-colors hover:bg-secondary">
                      <span>{suggestion}</span>
                      <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="py-6 text-center text-sm text-muted-foreground">
                No results found for &ldquo;{query}&rdquo;
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-border px-4 py-2 text-xs text-muted-foreground">
          <span>Search across all OpenPinas data</span>
          <div className="flex items-center gap-2">
            <kbd className="rounded border border-border bg-secondary px-1.5 py-0.5 font-mono text-[10px]">
              {"Enter"}
            </kbd>
            <span>to select</span>
          </div>
        </div>
      </div>
    </div>
  )
}


