import {
  Network,
  Clock,
  Scale,
  Building2,
  GraduationCap,
  Rocket,
} from "lucide-react"

const SECTIONS = [
  {
    title: "Dynasty Network Map",
    description:
      "Interactive force-directed graph of 71 political dynasties and their alliances, marriages, and rivalries.",
    icon: Network,
    updated: "Jan 2026",
    href: "#",
    accentClass: "text-primary bg-primary/10",
  },
  {
    title: "2026 Election Timeline",
    description:
      "Week-by-week timeline of events leading up to the May 2025 midterms and into 2026.",
    icon: Clock,
    updated: "Feb 2026",
    href: "#",
    accentClass: "text-accent bg-accent/10",
  },
  {
    title: "Corruption Tracker",
    description:
      "Tracking POGO cases, flood control scams, and political corruption with full case details.",
    icon: Scale,
    updated: "Feb 2026",
    href: "#",
    accentClass: "text-destructive bg-destructive/10",
  },
  {
    title: "Business Connections",
    description:
      "Map the overlap between corporate ownership, sports franchises, and political power.",
    icon: Building2,
    updated: "Jan 2026",
    href: "#",
    accentClass: "text-primary bg-primary/10",
  },
  {
    title: "Elite Schools Influence",
    description:
      "How institutions like UP, Ateneo, and La Salle shape political and business networks.",
    icon: GraduationCap,
    updated: "Jan 2026",
    href: "#",
    accentClass: "text-accent bg-accent/10",
  },
  {
    title: "Startup Ecosystem",
    description:
      "Philippine startup landscape, funding flows, and connections to established power structures.",
    icon: Rocket,
    updated: "Jan 2026",
    href: "#",
    accentClass: "text-primary bg-primary/10",
  },
]

export function ExploreGrid() {
  return (
    <section id="explore" className="px-4 py-8 lg:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6">
          <h2 className="text-xl font-bold tracking-tight text-foreground">
            Explore the Data
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Interactive visualizations and open datasets on Philippine power
            structures.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SECTIONS.map((section) => (
            <a
              key={section.title}
              href={section.href}
              className="group relative flex flex-col rounded-xl border border-border bg-card p-5 transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-black/20"
            >
              <div className="mb-4 flex items-center justify-between">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-lg ${section.accentClass}`}
                >
                  <section.icon className="h-5 w-5" />
                </div>
                <span className="text-xs text-muted-foreground">
                  Updated {section.updated}
                </span>
              </div>

              <h3 className="mb-1.5 text-base font-semibold text-foreground transition-colors group-hover:text-primary">
                {section.title}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {section.description}
              </p>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
