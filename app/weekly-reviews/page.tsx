import { Metadata } from "next"
import Link from "next/link"
import { weeklyReviews } from "@/lib/data/weekly-reviews"
import { Nav } from "@/components/nav"
import { Footer } from "@/components/footer"
import { Calendar, TrendingUp, TrendingDown, Minus, ArrowRight, Rss } from "lucide-react"

export const metadata: Metadata = {
  title: "Weekly Reviews - OpenPinas",
  description: "Weekly digests of Philippine news and political events for the diaspora.",
}

function TrendIcon({ trend }: { trend: "up" | "down" | "stable" }) {
  if (trend === "up") return <TrendingUp className="h-3 w-3 text-green-500" />
  if (trend === "down") return <TrendingDown className="h-3 w-3 text-red-500" />
  return <Minus className="h-3 w-3 text-muted-foreground" />
}

export default function WeeklyReviewsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Nav />
      <main className="flex-1 pt-20">
        <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
          {/* Header */}
          <header className="mb-12">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <h1 className="font-serif text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                  Weekly Reviews
                </h1>
                <p className="mt-3 text-lg text-muted-foreground leading-relaxed max-w-2xl">
                  Curated weekly digests of Philippine news for the diaspora. Politics, economics, culture, and more—summarized with context that matters.
                </p>
              </div>
              <Link
                href="/rss.xml"
                className="flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
              >
                <Rss className="h-4 w-4 text-primary" />
                RSS Feed
              </Link>
            </div>
          </header>

          {/* Reviews List */}
          <div className="space-y-6">
            {weeklyReviews.map((review, index) => (
              <article
                key={review.slug}
                className="group relative overflow-hidden rounded-xl border border-border bg-card transition-all hover:border-primary/40 hover:shadow-lg hover:shadow-black/10"
              >
                {index === 0 && (
                  <div className="flex h-1.5 w-full">
                    <div className="w-1/2 bg-primary" />
                    <div className="w-1/2 bg-primary/60" />
                  </div>
                )}
                <Link href={`/weekly-reviews/${review.slug}`} className="block p-6">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                        <Calendar className="h-4 w-4" />
                        <time dateTime={review.publishedDate}>{review.dateRange}</time>
                        {index === 0 && (
                          <span className="ml-2 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                            Latest
                          </span>
                        )}
                      </div>
                      <h2 className="font-serif text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                        {review.topStory}
                      </h2>
                      <p className="mt-2 text-muted-foreground leading-relaxed">
                        {review.excerpt}
                      </p>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {review.categories.map((category) => (
                          <span
                            key={category}
                            className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-secondary-foreground"
                          >
                            {category}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex flex-row sm:flex-col gap-4 sm:gap-3 sm:items-end sm:text-right shrink-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-medium text-foreground">
                          PHP {review.exchangeRate.value.toFixed(2)}
                        </span>
                        <TrendIcon trend={review.exchangeRate.trend} />
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {review.stats.totalEvents} events
                      </div>
                      <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors hidden sm:block" />
                    </div>
                  </div>
                </Link>
              </article>
            ))}
          </div>

          {/* Archive Note */}
          <div className="mt-12 rounded-lg border border-border bg-card/50 p-6 text-center">
            <p className="text-sm text-muted-foreground">
              Weekly reviews started in late 2025. Earlier events are documented in our{" "}
              <Link href="/#explore" className="text-primary hover:underline">
                interactive timeline
              </Link>
              .
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
