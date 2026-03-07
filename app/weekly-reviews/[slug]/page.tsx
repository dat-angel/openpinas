import { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { weeklyReviews, getWeeklyReviewBySlug, getAllWeeklyReviewSlugs } from "@/lib/data/weekly-reviews"
import { Nav } from "@/components/nav"
import { Footer } from "@/components/footer"
import { Calendar, TrendingUp, TrendingDown, Minus, ArrowLeft, ArrowRight, Rss, ExternalLink } from "lucide-react"

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return getAllWeeklyReviewSlugs().map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const review = getWeeklyReviewBySlug(slug)
  if (!review) return { title: "Not Found - OpenPinas" }
  
  return {
    title: `${review.topStory} - Weekly Review - OpenPinas`,
    description: review.excerpt,
  }
}

function TrendIcon({ trend }: { trend: "up" | "down" | "stable" }) {
  if (trend === "up") return <TrendingUp className="h-4 w-4 text-green-500" />
  if (trend === "down") return <TrendingDown className="h-4 w-4 text-red-500" />
  return <Minus className="h-4 w-4 text-muted-foreground" />
}

function TrendBadge({ trend, percentChange }: { trend: "up" | "down" | "stable"; percentChange: number }) {
  const bgClass = trend === "up" 
    ? "bg-green-500/10 text-green-600 dark:text-green-400" 
    : trend === "down" 
      ? "bg-red-500/10 text-red-600 dark:text-red-400"
      : "bg-muted text-muted-foreground"
  
  const arrow = trend === "up" ? "+" : trend === "down" ? "" : ""
  
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${bgClass}`}>
      <TrendIcon trend={trend} />
      {arrow}{Math.abs(percentChange).toFixed(2)}%
    </span>
  )
}

export default async function WeeklyReviewPage({ params }: PageProps) {
  const { slug } = await params
  const review = getWeeklyReviewBySlug(slug)
  
  if (!review) {
    notFound()
  }

  // Get previous and next reviews for navigation
  const currentIndex = weeklyReviews.findIndex((r) => r.slug === slug)
  const prevReview = currentIndex < weeklyReviews.length - 1 ? weeklyReviews[currentIndex + 1] : null
  const nextReview = currentIndex > 0 ? weeklyReviews[currentIndex - 1] : null

  // Link to original HTML file (for now, until full content migration)
  const originalHtmlPath = `/weekly-reviews/weekly-review-${slug}.html`

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Nav />
      <main className="flex-1 pt-20">
        <article className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
          {/* Back link */}
          <Link
            href="/weekly-reviews"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            All Weekly Reviews
          </Link>

          {/* Header */}
          <header className="mb-10">
            {/* Flag stripe */}
            <div className="flex h-1.5 w-full rounded-t-lg overflow-hidden mb-6">
              <div className="w-1/2 bg-primary" />
              <div className="w-1/2 bg-primary/60" />
            </div>

            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
              <Calendar className="h-4 w-4" />
              <time dateTime={review.publishedDate}>{review.dateRange}</time>
            </div>
            
            <h1 className="font-serif text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
              {review.topStory}
            </h1>
            
            <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
              {review.excerpt}
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              {review.categories.map((category) => (
                <span
                  key={category}
                  className="rounded-full bg-secondary px-3 py-1 text-sm font-medium text-secondary-foreground"
                >
                  {category}
                </span>
              ))}
            </div>
          </header>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 mb-10">
            <div className="rounded-lg border border-border bg-card p-4 text-center">
              <div className="text-2xl font-bold text-foreground">{review.stats.totalEvents}</div>
              <div className="text-xs text-muted-foreground uppercase tracking-wide mt-1">Total Events</div>
            </div>
            <div className="rounded-lg border border-border bg-card p-4 text-center">
              <div className="text-2xl font-bold text-foreground">{review.stats.politicalEvents}</div>
              <div className="text-xs text-muted-foreground uppercase tracking-wide mt-1">Political/Legal</div>
            </div>
            <div className="rounded-lg border border-border bg-card p-4 text-center">
              <div className="text-2xl font-bold text-foreground">{review.stats.disasters}</div>
              <div className="text-xs text-muted-foreground uppercase tracking-wide mt-1">Disasters</div>
            </div>
            <div className="rounded-lg border border-border bg-card p-4 text-center">
              <div className="text-2xl font-bold text-foreground">{review.stats.dynasties}</div>
              <div className="text-xs text-muted-foreground uppercase tracking-wide mt-1">Dynasties</div>
            </div>
          </div>

          {/* Exchange Rate Box */}
          <div className="rounded-xl border border-border bg-gradient-to-br from-secondary to-card p-6 mb-10">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-3">
              PHP:USD Exchange Rate
            </h2>
            <div className="flex items-center justify-between">
              <div>
                <span className="text-3xl font-bold text-foreground">PHP {review.exchangeRate.value.toFixed(2)}</span>
                <div className="mt-1">
                  <TrendBadge trend={review.exchangeRate.trend} percentChange={review.exchangeRate.percentChange} />
                  <span className="ml-2 text-sm text-muted-foreground">this week</span>
                </div>
              </div>
            </div>
          </div>

          {/* Full Content Link */}
          <div className="rounded-xl border border-primary/30 bg-primary/5 p-6 mb-10">
            <h2 className="font-serif text-xl font-semibold text-foreground mb-2">
              Read Full Review
            </h2>
            <p className="text-muted-foreground mb-4">
              The complete weekly review with detailed event coverage, OFW section, dynasty highlights, and sources.
            </p>
            <a
              href={originalHtmlPath}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              View Full Review
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>

          {/* Navigation */}
          <nav className="flex items-center justify-between border-t border-border pt-8">
            {prevReview ? (
              <Link
                href={`/weekly-reviews/${prevReview.slug}`}
                className="group flex flex-col items-start"
              >
                <span className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                  <ArrowLeft className="h-3 w-3" />
                  Previous
                </span>
                <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                  {prevReview.dateRange}
                </span>
              </Link>
            ) : (
              <div />
            )}
            
            {nextReview ? (
              <Link
                href={`/weekly-reviews/${nextReview.slug}`}
                className="group flex flex-col items-end text-right"
              >
                <span className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                  Next
                  <ArrowRight className="h-3 w-3" />
                </span>
                <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                  {nextReview.dateRange}
                </span>
              </Link>
            ) : (
              <div />
            )}
          </nav>

          {/* RSS CTA */}
          <div className="mt-12 rounded-lg border border-border bg-card p-6 text-center">
            <h3 className="font-serif text-lg font-semibold text-foreground mb-2">
              Stay Updated
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Get weekly reviews delivered to your feed reader.
            </p>
            <Link
              href="/rss.xml"
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-secondary px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary/80"
            >
              <Rss className="h-4 w-4 text-primary" />
              Subscribe via RSS
            </Link>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  )
}
