"use client"

import { useState, useEffect, useCallback } from "react"
import { Rss, Menu, X, Search } from "lucide-react"
import { ThemeToggle } from "./theme-toggle"
import { SearchDialog } from "./search-dialog"

const NAV_LINKS = [
  { label: "Weekly Review", href: "#featured" },
  { label: "Explore", href: "#explore" },
  { label: "Datasets", href: "#datasets" },
]

export function Nav() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)

  const handleSearchClose = useCallback(() => setSearchOpen(false), [])

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        setSearchOpen((prev) => !prev)
      }
    }
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [])

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-border bg-background/90 backdrop-blur-md">
        <nav className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 lg:px-6">
          <a href="#" className="flex items-center gap-2">
            <span className="text-lg font-bold tracking-tight text-foreground">
              Open
            </span>
            <span className="text-lg font-bold tracking-tight text-primary">
              Pinas
            </span>
          </a>

          <div className="hidden items-center gap-1 md:flex">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSearchOpen(true)}
              className="flex h-9 items-center gap-2 rounded-md border border-border bg-secondary px-3 text-sm text-muted-foreground transition-colors hover:border-primary hover:text-foreground"
              aria-label="Open search"
            >
              <Search className="h-4 w-4" />
              <span className="hidden sm:inline">Search</span>
              <kbd className="ml-1 hidden rounded border border-border bg-background px-1.5 py-0.5 font-mono text-[10px] sm:inline">
                {"Ctrl+K"}
              </kbd>
            </button>

            <a
              href="/feed.xml"
              className="flex h-9 w-9 items-center justify-center rounded-md border border-border bg-secondary text-muted-foreground transition-colors hover:text-accent"
              aria-label="RSS Feed"
            >
              <Rss className="h-4 w-4" />
            </a>

            <ThemeToggle />

            <button
              className="flex h-9 w-9 items-center justify-center rounded-md border border-border bg-secondary text-muted-foreground md:hidden"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? (
                <X className="h-4 w-4" />
              ) : (
                <Menu className="h-4 w-4" />
              )}
            </button>
          </div>
        </nav>

        {mobileOpen && (
          <div className="border-t border-border bg-background px-4 py-3 md:hidden">
            <div className="flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="rounded-md px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        )}
      </header>

      <SearchDialog open={searchOpen} onClose={handleSearchClose} />
    </>
  )
}
