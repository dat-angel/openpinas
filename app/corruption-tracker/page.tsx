import { Metadata } from "next"
import Link from "next/link"
import { corruptionCases } from "@/lib/data/corruption-cases"
import { Nav } from "@/components/nav"
import { Footer } from "@/components/footer"
import { Scale, MapPin, AlertTriangle, CheckCircle2, Clock, Users } from "lucide-react"

export const metadata: Metadata = {
  title: "Corruption Tracker - OpenPinas",
  description: "Track corruption cases in the Philippines. POGO scandals, infrastructure kickbacks, and political graft documented with sources.",
}

function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { icon: typeof CheckCircle2; className: string; label: string }> = {
    convicted: {
      icon: CheckCircle2,
      className: "bg-green-500/10 text-green-600 dark:text-green-400",
      label: "Convicted",
    },
    ongoing: {
      icon: Clock,
      className: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400",
      label: "Ongoing",
    },
    investigation: {
      icon: Clock,
      className: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
      label: "Under Investigation",
    },
    acquitted: {
      icon: CheckCircle2,
      className: "bg-muted text-muted-foreground",
      label: "Acquitted",
    },
  }

  const { icon: Icon, className, label } = config[status] || config.investigation

  return (
    <span className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${className}`}>
      <Icon className="h-3 w-3" />
      {label}
    </span>
  )
}

function PriorityBadge({ priority }: { priority: string }) {
  if (priority === "high") {
    return (
      <span className="flex items-center gap-1 text-xs text-destructive">
        <AlertTriangle className="h-3 w-3" />
        High Priority
      </span>
    )
  }
  return null
}

function formatAmount(amount: number): string {
  if (amount >= 1000000000) {
    return `P${(amount / 1000000000).toFixed(1)}B`
  }
  if (amount >= 1000000) {
    return `P${(amount / 1000000).toFixed(0)}M`
  }
  return `P${amount.toLocaleString()}`
}

export default function CorruptionTrackerPage() {
  const highPriority = corruptionCases.filter((c) => c.priority === "high")
  const otherCases = corruptionCases.filter((c) => c.priority !== "high")

  const totalAmount = corruptionCases.reduce((sum, c) => sum + c.amountInvolvedPhp, 0)
  const totalVictims = corruptionCases.reduce((sum, c) => sum + (c.victims || 0), 0)

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Nav />
      <main className="flex-1 pt-20">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
          {/* Header */}
          <header className="mb-12">
            <div className="flex h-1 w-24 rounded-full overflow-hidden mb-6">
              <div className="w-1/2 bg-destructive" />
              <div className="w-1/2 bg-primary" />
            </div>
            <h1 className="font-serif text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Corruption Tracker
            </h1>
            <p className="mt-3 text-lg text-muted-foreground leading-relaxed max-w-3xl">
              Documenting corruption cases in the Philippines. POGO scandals, infrastructure kickbacks, and political graft—tracked with sources and outcomes.
            </p>
            <div className="mt-6 flex flex-wrap gap-6 text-sm">
              <div className="flex items-center gap-2">
                <Scale className="h-4 w-4 text-destructive" />
                <span className="text-foreground font-medium">{formatAmount(totalAmount)}</span>
                <span className="text-muted-foreground">total amount involved</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-destructive" />
                <span className="text-foreground font-medium">{totalVictims.toLocaleString()}</span>
                <span className="text-muted-foreground">victims documented</span>
              </div>
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-destructive" />
                <span className="text-foreground font-medium">{corruptionCases.length}</span>
                <span className="text-muted-foreground">cases tracked</span>
              </div>
            </div>
          </header>

          {/* High Priority Cases */}
          <section className="mb-12">
            <h2 className="font-serif text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              High Priority Cases
            </h2>
            <div className="space-y-4">
              {highPriority.map((case_) => (
                <Link
                  key={case_.slug}
                  href={`/corruption-tracker/${case_.slug}`}
                  className="group block overflow-hidden rounded-xl border border-destructive/30 bg-card transition-all hover:border-destructive/60 hover:shadow-lg hover:shadow-destructive/5"
                >
                  <div className="border-l-4 border-destructive p-6">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div>
                        <h3 className="font-serif text-lg font-semibold text-foreground group-hover:text-destructive transition-colors">
                          {case_.title}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-muted-foreground">{case_.category}</span>
                          <span className="text-muted-foreground">·</span>
                          <span className="flex items-center gap-1 text-xs text-muted-foreground">
                            <MapPin className="h-3 w-3" />
                            {case_.location.province}
                          </span>
                        </div>
                      </div>
                      <StatusBadge status={case_.status} />
                    </div>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {case_.description}
                    </p>
                    <div className="flex flex-wrap gap-4 text-sm">
                      {case_.amountInvolvedPhp > 0 && (
                        <div>
                          <span className="text-muted-foreground">Amount: </span>
                          <span className="font-medium text-foreground">{formatAmount(case_.amountInvolvedPhp)}</span>
                        </div>
                      )}
                      {case_.victims && (
                        <div>
                          <span className="text-muted-foreground">Victims: </span>
                          <span className="font-medium text-foreground">{case_.victims.toLocaleString()}</span>
                        </div>
                      )}
                      <div>
                        <span className="text-muted-foreground">Accused: </span>
                        <span className="font-medium text-foreground">{case_.accused.length}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* Other Cases */}
          {otherCases.length > 0 && (
            <section className="mb-12">
              <h2 className="font-serif text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
                <Scale className="h-5 w-5 text-primary" />
                Other Cases
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {otherCases.map((case_) => (
                  <Link
                    key={case_.slug}
                    href={`/corruption-tracker/${case_.slug}`}
                    className="group block overflow-hidden rounded-xl border border-border bg-card p-5 transition-all hover:border-primary/40 hover:shadow-lg hover:shadow-black/10"
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="font-serif text-base font-semibold text-foreground group-hover:text-primary transition-colors">
                        {case_.shortTitle}
                      </h3>
                      <StatusBadge status={case_.status} />
                    </div>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {case_.description}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      <span>{case_.location.region}</span>
                      {case_.amountInvolvedPhp > 0 && (
                        <>
                          <span>·</span>
                          <span>{formatAmount(case_.amountInvolvedPhp)}</span>
                        </>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Data Note */}
          <div className="rounded-lg border border-border bg-card/50 p-6 text-center">
            <p className="text-sm text-muted-foreground">
              Network visualization and relationship mapping available in the{" "}
              <a href="/corruption-tracker/network.html" className="text-primary hover:underline">
                corruption network map
              </a>
              . All data sourced from official court records and investigative journalism.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
