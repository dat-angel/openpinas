import {
  ArrowRight,
  TrendingDown,
  CloudRain,
  Landmark,
  Calendar,
} from "lucide-react"

const REVIEW = {
  title: "Week 8: Budget Battle Heats Up as Marcos Signs Contested 2026 Budget",
  dateRange: "February 16 -- 22, 2026",
  summary:
    "Marcos signs the P6.326 trillion 2026 budget amid protests over pork barrel insertions. Typhoon Pepito recovery continues. OFW remittances hit $3.1B in December 2025.",
  stats: [
    {
      label: "PHP/USD Rate",
      value: "57.18",
      icon: TrendingDown,
    },
    {
      label: "Typhoon Pepito",
      value: "Recovery",
      icon: CloudRain,
    },
    {
      label: "2026 Budget",
      value: "P6.326T",
      icon: Landmark,
    },
  ],
  weekNumber: 8,
  year: 2026,
}

export function FeaturedReview() {
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

            <a
              href="#"
              className="group inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:brightness-110"
            >
              Read Week {REVIEW.weekNumber} Review
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
