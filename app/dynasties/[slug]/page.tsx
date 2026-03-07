import { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { dynasties, getDynastyBySlug, getAllDynastySlugs } from "@/lib/data/dynasties"
import { Nav } from "@/components/nav"
import { Footer } from "@/components/footer"
import { ArrowLeft, MapPin, Users, Crown, Building2, Handshake, Swords, ExternalLink } from "lucide-react"

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return getAllDynastySlugs().map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const dynasty = getDynastyBySlug(slug)
  if (!dynasty) return { title: "Not Found - OpenPinas" }
  
  return {
    title: `${dynasty.name} - Political Dynasties - OpenPinas`,
    description: dynasty.description,
  }
}

export default async function DynastyPage({ params }: PageProps) {
  const { slug } = await params
  const dynasty = getDynastyBySlug(slug)
  
  if (!dynasty) {
    notFound()
  }

  // Get related dynasties
  const alliedDynastyData = dynasty.alliedDynasties
    .map((name) => dynasties.find((d) => d.name.toLowerCase().includes(name.toLowerCase().split(" ")[0])))
    .filter(Boolean)
  
  const rivalDynastyData = dynasty.rivalDynasties
    .map((name) => dynasties.find((d) => d.name.toLowerCase().includes(name.toLowerCase().split(" ")[0])))
    .filter(Boolean)

  // Link to original HTML file
  const originalHtmlPath = `/dynasties/${slug}.html`

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Nav />
      <main className="flex-1 pt-20">
        <article className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
          {/* Back link */}
          <Link
            href="/dynasties"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            All Dynasties
          </Link>

          {/* Header */}
          <header className="mb-10">
            <div className="flex h-1 w-full rounded-t-lg overflow-hidden mb-6">
              <div className="w-1/2 bg-primary" />
              <div className="w-1/2 bg-destructive" />
            </div>

            <div className="flex items-center gap-2 mb-3">
              <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium uppercase tracking-wider text-primary">
                {dynasty.powerLevel}
              </span>
              <span className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
                {dynasty.classification}
              </span>
            </div>
            
            <h1 className="font-serif text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
              {dynasty.name}
            </h1>
            
            <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
              {dynasty.description}
            </p>

            <div className="mt-6 flex flex-wrap gap-4">
              {dynasty.primaryRegions.map((region) => (
                <span
                  key={region}
                  className="flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 text-sm text-secondary-foreground"
                >
                  <MapPin className="h-4 w-4" />
                  {region}
                </span>
              ))}
            </div>
          </header>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 mb-10">
            <div className="rounded-lg border border-border bg-card p-4 text-center">
              <Crown className="h-5 w-5 mx-auto mb-2 text-primary" />
              <div className="text-xs text-muted-foreground uppercase tracking-wide">Patriarch</div>
              <div className="text-sm font-medium text-foreground mt-1">{dynasty.patriarch}</div>
            </div>
            <div className="rounded-lg border border-border bg-card p-4 text-center">
              <div className="text-2xl font-bold text-foreground">{dynasty.established}</div>
              <div className="text-xs text-muted-foreground uppercase tracking-wide mt-1">Established</div>
            </div>
            <div className="rounded-lg border border-border bg-card p-4 text-center">
              <div className="text-2xl font-bold text-foreground">{dynasty.keyMembers.length}</div>
              <div className="text-xs text-muted-foreground uppercase tracking-wide mt-1">Key Members</div>
            </div>
            <div className="rounded-lg border border-border bg-card p-4 text-center">
              <div className="text-sm font-medium text-foreground">{dynasty.status2025}</div>
              <div className="text-xs text-muted-foreground uppercase tracking-wide mt-1">2025 Status</div>
            </div>
          </div>

          {/* Key Members */}
          <section className="mb-10">
            <h2 className="font-serif text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Key Members
            </h2>
            <div className="space-y-3">
              {dynasty.keyMembers.map((member) => (
                <div
                  key={member.name}
                  className={`rounded-lg border border-border bg-card p-4 ${member.historical ? "opacity-70" : ""}`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-medium text-foreground">
                        {member.name}
                        {member.historical && (
                          <span className="ml-2 text-xs text-muted-foreground">(Historical)</span>
                        )}
                      </h3>
                      <p className="text-sm text-muted-foreground">{member.position}</p>
                      {member.region && (
                        <p className="text-xs text-muted-foreground mt-1">{member.region}</p>
                      )}
                    </div>
                    {member.termStart && (
                      <span className="text-xs text-muted-foreground">
                        {member.termStart}{member.termEnd ? `–${member.termEnd}` : "–present"}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Alliances & Rivalries */}
          <div className="grid gap-6 sm:grid-cols-2 mb-10">
            {alliedDynastyData.length > 0 && (
              <section>
                <h2 className="font-serif text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Handshake className="h-5 w-5 text-green-600 dark:text-green-400" />
                  Allied Dynasties
                </h2>
                <div className="space-y-2">
                  {alliedDynastyData.map((allied) => allied && (
                    <Link
                      key={allied.slug}
                      href={`/dynasties/${allied.slug}`}
                      className="block rounded-lg border border-border bg-card p-3 transition-colors hover:border-green-500/50"
                    >
                      <span className="font-medium text-foreground">{allied.name}</span>
                      <span className="block text-xs text-muted-foreground">{allied.primaryRegions.join(", ")}</span>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {rivalDynastyData.length > 0 && (
              <section>
                <h2 className="font-serif text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Swords className="h-5 w-5 text-destructive" />
                  Rival Dynasties
                </h2>
                <div className="space-y-2">
                  {rivalDynastyData.map((rival) => rival && (
                    <Link
                      key={rival.slug}
                      href={`/dynasties/${rival.slug}`}
                      className="block rounded-lg border border-border bg-card p-3 transition-colors hover:border-destructive/50"
                    >
                      <span className="font-medium text-foreground">{rival.name}</span>
                      <span className="block text-xs text-muted-foreground">{rival.primaryRegions.join(", ")}</span>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Business Interests */}
          {dynasty.businessInterests.length > 0 && (
            <section className="mb-10">
              <h2 className="font-serif text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <Building2 className="h-5 w-5 text-primary" />
                Business Interests
              </h2>
              <div className="flex flex-wrap gap-2">
                {dynasty.businessInterests.map((interest) => (
                  <span
                    key={interest}
                    className="rounded-full bg-secondary px-3 py-1 text-sm text-secondary-foreground"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* Historical Notes */}
          <section className="mb-10">
            <h2 className="font-serif text-lg font-semibold text-foreground mb-4">
              Historical Notes
            </h2>
            <div className="rounded-lg border border-border bg-card/50 p-6">
              <p className="text-muted-foreground leading-relaxed">
                {dynasty.historicalNotes}
              </p>
            </div>
          </section>

          {/* Full Profile Link */}
          <div className="rounded-xl border border-primary/30 bg-primary/5 p-6 mb-10">
            <h2 className="font-serif text-xl font-semibold text-foreground mb-2">
              View Full Profile
            </h2>
            <p className="text-muted-foreground mb-4">
              Access the complete dynasty profile with timeline events, detailed member biographies, and source citations.
            </p>
            <a
              href={originalHtmlPath}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              View Full Profile
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>

          {/* Navigation */}
          <nav className="flex items-center justify-between border-t border-border pt-8">
            <Link
              href="/dynasties"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Back to All Dynasties
            </Link>
            <a
              href="/dynasties-network-visualization.html"
              className="text-sm text-primary hover:underline"
            >
              View Network Map
            </a>
          </nav>
        </article>
      </main>
      <Footer />
    </div>
  )
}
