import { Metadata } from "next"
import Link from "next/link"
import { dynasties } from "@/lib/data/dynasties"
import { Nav } from "@/components/nav"
import { Footer } from "@/components/footer"
import { MapPin, Users, Crown, TrendingUp, TrendingDown, Minus } from "lucide-react"

export const metadata: Metadata = {
  title: "Political Dynasties - OpenPinas",
  description: "Explore 71 political dynasties shaping Philippine governance. Data-driven profiles of family networks, regional control, and political influence.",
}

function StatusBadge({ status }: { status: string }) {
  const statusLower = status.toLowerCase()
  if (statusLower.includes("rising") || statusLower.includes("consolidating")) {
    return (
      <span className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
        <TrendingUp className="h-3 w-3" />
        {status}
      </span>
    )
  }
  if (statusLower.includes("declining") || statusLower.includes("pressure") || statusLower.includes("diminished")) {
    return (
      <span className="flex items-center gap-1 text-xs text-red-600 dark:text-red-400">
        <TrendingDown className="h-3 w-3" />
        {status}
      </span>
    )
  }
  return (
    <span className="flex items-center gap-1 text-xs text-muted-foreground">
      <Minus className="h-3 w-3" />
      {status}
    </span>
  )
}

function PowerLevelBadge({ level }: { level: string }) {
  const colors: Record<string, string> = {
    national: "bg-primary/10 text-primary",
    regional: "bg-accent/10 text-accent-foreground",
    local: "bg-secondary text-secondary-foreground",
  }
  return (
    <span className={`rounded-full px-2 py-0.5 text-xs font-medium uppercase tracking-wider ${colors[level] || colors.local}`}>
      {level}
    </span>
  )
}

export default function DynastiesPage() {
  const nationalDynasties = dynasties.filter((d) => d.powerLevel === "national")
  const regionalDynasties = dynasties.filter((d) => d.powerLevel === "regional")

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Nav />
      <main className="flex-1 pt-20">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
          {/* Header */}
          <header className="mb-12">
            <div className="flex h-1.5 w-24 rounded-full overflow-hidden mb-6">
              <div className="w-1/2 bg-primary" />
              <div className="w-1/2 bg-primary/60" />
            </div>
            <h1 className="font-serif text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Political Dynasties
            </h1>
            <p className="mt-3 text-lg text-muted-foreground leading-relaxed max-w-3xl">
              Explore the family networks that shape Philippine governance. Data on 71 political dynasties, their regional control, alliances, and influence across generations.
            </p>
            <div className="mt-6 flex flex-wrap gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" />
                <span>148+ members tracked</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                <span>71 provinces covered</span>
              </div>
              <div className="flex items-center gap-2">
                <Crown className="h-4 w-4 text-primary" />
                <span>Historical data since 1868</span>
              </div>
            </div>
          </header>

          {/* National-Level Dynasties */}
          <section className="mb-12">
            <h2 className="font-serif text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
              <Crown className="h-5 w-5 text-primary" />
              National-Level Dynasties
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {nationalDynasties.map((dynasty) => (
                <Link
                  key={dynasty.slug}
                  href={`/dynasties/${dynasty.slug}`}
                  className="group relative overflow-hidden rounded-xl border border-border bg-card p-5 transition-all hover:border-primary/40 hover:shadow-lg hover:shadow-black/10"
                >
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <h3 className="font-serif text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                      {dynasty.name}
                    </h3>
                    <PowerLevelBadge level={dynasty.powerLevel} />
                  </div>
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                    {dynasty.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {dynasty.primaryRegions.map((region) => (
                      <span
                        key={region}
                        className="flex items-center gap-1 rounded-full bg-secondary px-2 py-0.5 text-xs text-secondary-foreground"
                      >
                        <MapPin className="h-3 w-3" />
                        {region}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between">
                    <StatusBadge status={dynasty.status2025} />
                    <span className="text-xs text-muted-foreground">
                      Est. {dynasty.established}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* Regional Dynasties */}
          <section className="mb-12">
            <h2 className="font-serif text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              Regional Dynasties
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {regionalDynasties.map((dynasty) => (
                <Link
                  key={dynasty.slug}
                  href={`/dynasties/${dynasty.slug}`}
                  className="group relative overflow-hidden rounded-xl border border-border bg-card p-5 transition-all hover:border-primary/40 hover:shadow-lg hover:shadow-black/10"
                >
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <h3 className="font-serif text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                      {dynasty.name}
                    </h3>
                    <PowerLevelBadge level={dynasty.powerLevel} />
                  </div>
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                    {dynasty.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {dynasty.primaryRegions.map((region) => (
                      <span
                        key={region}
                        className="flex items-center gap-1 rounded-full bg-secondary px-2 py-0.5 text-xs text-secondary-foreground"
                      >
                        <MapPin className="h-3 w-3" />
                        {region}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between">
                    <StatusBadge status={dynasty.status2025} />
                    <span className="text-xs text-muted-foreground">
                      Est. {dynasty.established}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* Data Note */}
          <div className="rounded-lg border border-border bg-card/50 p-6 text-center">
            <p className="text-sm text-muted-foreground">
              Full network visualization and detailed relationship mapping available in the{" "}
              <a href="/dynasties-network-visualization.html" className="text-primary hover:underline">
                interactive dynasty network map
              </a>
              .
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
