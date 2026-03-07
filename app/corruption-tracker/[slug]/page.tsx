import { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { getCorruptionCaseBySlug, getAllCorruptionCaseSlugs } from "@/lib/data/corruption-cases"
import { Nav } from "@/components/nav"
import { Footer } from "@/components/footer"
import { ArrowLeft, MapPin, Scale, Users, Calendar, AlertTriangle, CheckCircle2, Clock, ExternalLink } from "lucide-react"

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return getAllCorruptionCaseSlugs().map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const case_ = getCorruptionCaseBySlug(slug)
  if (!case_) return { title: "Not Found - OpenPinas" }
  
  return {
    title: `${case_.shortTitle} - Corruption Tracker - OpenPinas`,
    description: case_.description,
  }
}

function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { icon: typeof CheckCircle2; className: string; label: string }> = {
    convicted: {
      icon: CheckCircle2,
      className: "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/30",
      label: "Convicted",
    },
    ongoing: {
      icon: Clock,
      className: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/30",
      label: "Ongoing",
    },
    investigation: {
      icon: Clock,
      className: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30",
      label: "Under Investigation",
    },
    acquitted: {
      icon: CheckCircle2,
      className: "bg-muted text-muted-foreground border-border",
      label: "Acquitted",
    },
  }

  const { icon: Icon, className, label } = config[status] || config.investigation

  return (
    <span className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm font-medium ${className}`}>
      <Icon className="h-4 w-4" />
      {label}
    </span>
  )
}

function formatAmount(amount: number): string {
  if (amount >= 1000000000) {
    return `P${(amount / 1000000000).toFixed(1)} Billion`
  }
  if (amount >= 1000000) {
    return `P${(amount / 1000000).toFixed(0)} Million`
  }
  return `P${amount.toLocaleString()}`
}

export default async function CorruptionCasePage({ params }: PageProps) {
  const { slug } = await params
  const case_ = getCorruptionCaseBySlug(slug)
  
  if (!case_) {
    notFound()
  }

  // Link to original HTML file
  const originalHtmlPath = `/corruption-tracker/cases/${slug}.html`

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Nav />
      <main className="flex-1 pt-20">
        <article className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
          {/* Back link */}
          <Link
            href="/corruption-tracker"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            Corruption Tracker
          </Link>

          {/* Header */}
          <header className="mb-10">
            <div className="flex h-1.5 w-full rounded-t-lg overflow-hidden mb-6">
              <div className="w-1/2 bg-primary" />
              <div className="w-1/2 bg-primary/60" />
            </div>

            <div className="flex items-center gap-3 mb-4 flex-wrap">
              <StatusBadge status={case_.status} />
              {case_.priority === "high" && (
                <span className="flex items-center gap-1 text-sm text-primary">
                  <AlertTriangle className="h-4 w-4" />
                  High Priority
                </span>
              )}
              <span className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
                {case_.category}
              </span>
            </div>
            
            <h1 className="font-serif text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              {case_.title}
            </h1>
            
            <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
              {case_.description}
            </p>

            <div className="mt-6 flex flex-wrap gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4" />
                {case_.location.municipality}, {case_.location.province}
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                Filed: {new Date(case_.filingDate).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
              </div>
            </div>
          </header>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 mb-10">
            {case_.amountInvolvedPhp > 0 && (
              <div className="rounded-lg border border-primary/30 bg-primary/5 p-4 text-center">
                <Scale className="h-5 w-5 mx-auto mb-2 text-primary" />
                <div className="text-lg font-bold text-foreground">{formatAmount(case_.amountInvolvedPhp)}</div>
                <div className="text-xs text-muted-foreground uppercase tracking-wide mt-1">Amount Involved</div>
              </div>
            )}
            {case_.victims && (
              <div className="rounded-lg border border-primary/30 bg-primary/5 p-4 text-center">
                <Users className="h-5 w-5 mx-auto mb-2 text-primary" />
                <div className="text-lg font-bold text-foreground">{case_.victims.toLocaleString()}</div>
                <div className="text-xs text-muted-foreground uppercase tracking-wide mt-1">Victims</div>
              </div>
            )}
            <div className="rounded-lg border border-border bg-card p-4 text-center">
              <div className="text-lg font-bold text-foreground">{case_.accused.length}</div>
              <div className="text-xs text-muted-foreground uppercase tracking-wide mt-1">Accused</div>
            </div>
            <div className="rounded-lg border border-border bg-card p-4 text-center">
              <div className="text-lg font-bold text-foreground">{case_.charges.length}</div>
              <div className="text-xs text-muted-foreground uppercase tracking-wide mt-1">Charges</div>
            </div>
          </div>

          {/* Accused */}
          <section className="mb-10">
            <h2 className="font-serif text-xl font-semibold text-foreground mb-4">
              Accused
            </h2>
            <div className="space-y-3">
              {case_.accused.map((person, index) => (
                <div
                  key={index}
                  className="rounded-lg border border-border bg-card p-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-medium text-foreground">{person.name}</h3>
                      <p className="text-sm text-muted-foreground">{person.position}</p>
                    </div>
                    <span className={`text-xs font-medium ${
                      person.status === "convicted" 
                        ? "text-green-600 dark:text-green-400" 
                        : "text-muted-foreground"
                    }`}>
                      {person.status}
                    </span>
                  </div>
                  {person.sentence && (
                    <p className="mt-2 text-sm font-medium text-primary">
                      Sentence: {person.sentence}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Charges */}
          <section className="mb-10">
            <h2 className="font-serif text-xl font-semibold text-foreground mb-4">
              Charges Filed
            </h2>
            <div className="flex flex-wrap gap-2">
              {case_.charges.map((charge) => (
                <span
                  key={charge}
                  className="rounded-full border border-primary/30 bg-primary/5 px-3 py-1 text-sm text-foreground"
                >
                  {charge}
                </span>
              ))}
            </div>
          </section>

          {/* Timeline */}
          <section className="mb-10">
            <h2 className="font-serif text-xl font-semibold text-foreground mb-4">
              Key Events
            </h2>
            <div className="relative">
              <div className="absolute left-3 top-0 bottom-0 w-px bg-border" />
              <div className="space-y-6">
                {case_.keyEvents.map((event, index) => (
                  <div key={index} className="relative pl-10">
                    <div className="absolute left-0 top-1 h-6 w-6 rounded-full border-2 border-primary bg-background flex items-center justify-center">
                      <div className="h-2 w-2 rounded-full bg-primary" />
                    </div>
                    <div className="rounded-lg border border-border bg-card p-4">
                      <time className="text-xs text-muted-foreground">
                        {new Date(event.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                      </time>
                      <p className="mt-1 text-sm text-foreground">{event.event}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Categories */}
          <section className="mb-10">
            <h2 className="font-serif text-lg font-semibold text-foreground mb-4">
              Related Categories
            </h2>
            <div className="flex flex-wrap gap-2">
              {case_.subcategories.map((cat) => (
                <span
                  key={cat}
                  className="rounded-full bg-secondary px-3 py-1 text-sm text-secondary-foreground"
                >
                  {cat.replace(/_/g, " ")}
                </span>
              ))}
            </div>
          </section>

          {/* Full Profile Link */}
          <div className="rounded-xl border border-primary/30 bg-primary/5 p-6 mb-10">
            <h2 className="font-serif text-xl font-semibold text-foreground mb-2">
              View Full Case File
            </h2>
            <p className="text-muted-foreground mb-4">
              Access the complete case documentation with detailed timeline, source citations, and evidence links.
            </p>
            <a
              href={originalHtmlPath}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              View Full Case File
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>

          {/* Navigation */}
          <nav className="flex items-center justify-between border-t border-border pt-8">
            <Link
              href="/corruption-tracker"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Back to Corruption Tracker
            </Link>
            <a
              href="/corruption-tracker/network.html"
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
