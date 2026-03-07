"use client"

import { useState } from "react"
import { Mail, Rss, CheckCircle2, Loader2 } from "lucide-react"

export function NewsletterSignup() {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return

    setStatus("loading")
    setErrorMessage("")

    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (response.ok || data.success) {
        setStatus("success")
        setEmail("")
      } else {
        setStatus("error")
        setErrorMessage(data.error || "Something went wrong. Please try again.")
      }
    } catch {
      setStatus("error")
      setErrorMessage("Something went wrong. Please try again.")
    }
  }

  return (
    <section className="px-4 py-12 lg:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="relative overflow-hidden rounded-xl border border-border bg-card">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--color-primary)_0%,_transparent_50%)] opacity-5" />
          <div className="relative flex flex-col items-center px-6 py-10 text-center lg:py-14">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Mail className="h-6 w-6 text-primary" />
            </div>

            <h2 className="mb-2 text-xl font-bold tracking-tight text-foreground lg:text-2xl">
              Stay informed. Every week.
            </h2>
            <p className="mb-6 max-w-md text-sm leading-relaxed text-muted-foreground lg:text-base">
              Get the weekly OpenPinas digest delivered to your inbox. No spam,
              just data-driven reporting on Philippine politics.
            </p>

            {status === "success" ? (
              <div className="flex items-center gap-2 rounded-lg border border-primary/30 bg-primary/10 px-5 py-3 text-sm font-medium text-primary">
                <CheckCircle2 className="h-4 w-4" />
                Check your inbox to confirm your subscription.
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="flex w-full max-w-md flex-col gap-3 sm:flex-row"
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    if (status === "error") setStatus("idle")
                  }}
                  placeholder="your@email.com"
                  required
                  className="flex-1 rounded-lg border border-border bg-secondary px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  aria-label="Email address"
                />
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:brightness-110 disabled:opacity-60"
                >
                  {status === "loading" ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Subscribe"
                  )}
                </button>
              </form>
            )}

            {status === "error" && (
              <p className="mt-2 text-sm text-destructive">{errorMessage}</p>
            )}

            <div className="mt-4 flex items-center gap-4">
              <a
                href="/rss.xml"
                className="flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-accent"
              >
                <Rss className="h-3.5 w-3.5" />
                RSS Feed
              </a>
              <span className="text-xs text-muted-foreground">
                Powered by Buttondown
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
