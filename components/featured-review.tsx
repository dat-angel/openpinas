import Link from "next/link"
import {
  ArrowRight,
  TrendingUp,
  Scale,
  Landmark,
  Calendar,
} from "lucide-react"
import { getLatestWeeklyReview } from "@/lib/data/weekly-reviews"

function getReviewData() {
  const latest = getLatestWeeklyReview()
  return {
    slug: latest.slug,
    title: `Week 8: ${latest.topStory}`,
    dateRange: latest.dateRange,
    summary: latest.excerpt,
    stats: [
      {
        label: "PHP/USD Rate",
        value: latest.exchangeRate.value.toFixed(2),
        icon: TrendingUp,
      },
      {
        label: "Political Events",
        value: String(latest.stats.politicalEvents),
        icon: Scale,
      },
      {
        label: "Total Events",
        value: String(latest.stats.totalEvents),
        icon: Landmark,
      },
    ],
    weekNumber: 8,
    year: 2026,
  }
}

export function FeaturedReview() {
  const REVIEW = getReviewData()
  
  return (
    <section id="featured" className="px-4 pt-8 pb-4 lg:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-4 flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
            <Calendar className="h-3 w-3" />
            Latest
          </span>
          <span className="text-sm text-muted-foreground">
            {REVIEW.dateRange}
          </span>
        </div>

        <div className="overflow-hidden rounded-xl border border-border bg-card">
          {/* Philippine flag stripe: blue (dark) / gold (accent) */}
          <div className="flex h-1 w-full">
            <div className="w-1/2 bg-primary" />
            <div className="w-1/2 bg-destructive" />
          </div>
          <div className="p-6 lg:p-8">
            <h2 className="mb-4 max-w-3xl text-balance font-serif text-2xl font-bold leading-snug text-foreground lg:text-3xl">
              {REVIEW.title}
            </h2>

            <p className="mb-6 max-w-2xl text-pretty font-serif leading-relaxed text-muted-foreground lg:text-lg">
              {REVIEW.summary}
            </p>

            <div className="mb-6 flex flex-wrap gap-3">
              {REVIEW.stats.map((stat) => (
                <div
                  key={stat.label}
                  className="flex items-center gap-2 rounded-lg border border-border bg-secondary px-4 py-2.5"
                >
                  <stat.icon className="h-4 w-4 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground">
                      {stat.label}
                    </p>
                    <p className="text-sm font-semibold text-foreground">
                      {stat.value}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <Link
              href={`/weekly-reviews/${REVIEW.slug}`}
              className="group inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:brightness-110"
            >
              Read Week {REVIEW.weekNumber} Review
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
