"use client"

import { useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Search, ArrowRight, Network, Scale, MapPin, Newspaper, Loader2 } from "lucide-react"
import type { SearchResult } from "@/lib/search-index"

const CATEGORY_ICONS: Record<string, typeof Network> = {
  dynasty: Network,
  corruption: Scale,
  province: MapPin,
  "weekly-review": Newspaper,
}

const CATEGORY_LABELS: Record<string, string> = {
  dynasty: "Dynasty",
  corruption: "Corruption",
  province: "Province",
  "weekly-review": "Weekly Review",
}

const INITIAL_SUGGESTIONS = [
  "Marcos-Romualdez Dynasty",
  "Alice Guo POGO Case",
  "Flood Control Corruption",
  "Duterte ICC Detention",
  "Cebu Garcia Dynasty",
  "2026 Budget",
]

interface SearchDialogProps {
  open: boolean
  onClose: () => void
}

export function SearchDialog({ open, onClose }: SearchDialogProps) {
  const router = useRouter()
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(0)

  const performSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery || searchQuery.trim().length < 2) {
      setResults([])
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}&limit=8`)
      const data = await response.json()
      setResults(data.results || [])
      setSelectedIndex(0)
    } catch (error) {
      console.error("[v0] Search error:", error)
      setResults([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      performSearch(query)
    }, 200)
    return () => clearTimeout(timer)
  }, [query, performSearch])

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onClose()
      }
      if (e.key === "ArrowDown") {
        e.preventDefault()
        setSelectedIndex((prev) => Math.min(prev + 1, results.length - 1))
      }
      if (e.key === "ArrowUp") {
        e.preventDefault()
        setSelectedIndex((prev) => Math.max(prev - 1, 0))
      }
      if (e.key === "Enter" && results[selectedIndex]) {
        e.preventDefault()
        navigateToResult(results[selectedIndex])
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
  }, [open, onClose, results, selectedIndex])

  useEffect(() => {
    if (!open) {
      setQuery("")
      setResults([])
      setSelectedIndex(0)
    }
  }, [open])

  function navigateToResult(result: SearchResult) {
    onClose()
    router.push(result.url)
  }

  function handleSuggestionClick(suggestion: string) {
    setQuery(suggestion)
  }

  if (!open) return null

  const showSuggestions = !query && results.length === 0

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]">
      <div
        className="fixed inset-0 bg-background/80 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="relative z-50 w-full max-w-lg rounded-xl border border-border bg-card shadow-2xl">
        <div className="flex items-center gap-3 border-b border-border px-4 py-3">
          {isLoading ? (
            <Loader2 className="h-5 w-5 shrink-0 animate-spin text-primary" />
          ) : (
            <Search className="h-5 w-5 shrink-0 text-muted-foreground" />
          )}
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
          {showSuggestions && (
            <div className="px-2 pt-1">
              <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Suggestions
              </p>
              <ul className="space-y-1">
                {INITIAL_SUGGESTIONS.map((suggestion) => (
                  <li key={suggestion}>
                    <button
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm text-foreground transition-colors hover:bg-secondary"
                    >
                      <span>{suggestion}</span>
                      <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {query && results.length > 0 && (
            <div className="px-2 pt-1">
              <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Results ({results.length})
              </p>
              <ul className="space-y-1">
                {results.map((result, index) => {
                  const Icon = CATEGORY_ICONS[result.category] || Network
                  return (
                    <li key={result.id}>
                      <button
                        onClick={() => navigateToResult(result)}
                        className={`flex w-full items-start gap-3 rounded-lg px-3 py-2.5 text-left transition-colors ${
                          index === selectedIndex
                            ? "bg-primary/10 text-primary"
                            : "text-foreground hover:bg-secondary"
                        }`}
                      >
                        <Icon className="h-4 w-4 mt-0.5 shrink-0 text-muted-foreground" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-medium truncate">{result.title}</span>
                            <span className="shrink-0 rounded-full bg-secondary px-2 py-0.5 text-[10px] uppercase tracking-wider text-muted-foreground">
                              {CATEGORY_LABELS[result.category] || result.category}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                            {result.description}
                          </p>
                        </div>
                        <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                      </button>
                    </li>
                  )
                })}
              </ul>
            </div>
          )}

          {query && results.length === 0 && !isLoading && (
            <p className="py-6 text-center text-sm text-muted-foreground">
              No results found for &ldquo;{query}&rdquo;
            </p>
          )}
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
