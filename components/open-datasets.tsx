"use client"

import { useState } from "react"

const datasets = [
  {
    name: "Political Dynasties Network",
    description: "50+ dynasty families, 200+ politicians, relationship mappings across 71 provinces",
    format: "JSON",
    size: "2.4 MB",
    records: "200+",
    href: "#",
  },
  {
    name: "POGO Corruption Cases",
    description: "Documented offshore gaming corruption cases with amounts, officials, and outcomes",
    format: "JSON",
    size: "156 KB",
    records: "45+",
    href: "#",
  },
  {
    name: "Elite Schools Influence Map",
    description: "Educational backgrounds of politicians and their institutional connections",
    format: "JSON",
    size: "890 KB",
    records: "300+",
    href: "#",
  },
  {
    name: "Business-Politics Connections",
    description: "Corporate board overlaps between political families and major conglomerates",
    format: "JSON",
    size: "1.1 MB",
    records: "150+",
    href: "#",
  },
  {
    name: "Regional Power Distribution",
    description: "Province-level political control, dynasty concentration, and voting patterns",
    format: "JSON",
    size: "340 KB",
    records: "81",
    href: "#",
  },
  {
    name: "2026 Election Timeline",
    description: "Key dates, filing deadlines, campaign events, and election milestones",
    format: "JSON",
    size: "98 KB",
    records: "60+",
    href: "#",
  },
]

export function OpenDatasets() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  return (
    <section id="datasets" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 text-sm font-medium uppercase tracking-widest text-primary">
              Open Data
            </p>
            <h2 className="font-serif text-3xl font-bold tracking-tight text-foreground sm:text-4xl text-balance">
              Free datasets for researchers
            </h2>
            <p className="mt-3 max-w-xl text-muted-foreground leading-relaxed">
              All data is open-source and machine-readable. Download, analyze, and build upon our datasets.
            </p>
          </div>
          <a
            href="https://github.com/dat-angel/openpinas"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-medium text-primary transition-colors hover:text-primary/80"
          >
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
            View on GitHub
          </a>
        </div>

        <div className="grid gap-3">
          {datasets.map((dataset, i) => (
            <a
              key={dataset.name}
              href={dataset.href}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
              className="group flex flex-col gap-3 rounded-lg border border-border bg-card p-4 transition-all hover:border-primary/30 hover:bg-card/80 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 text-xs font-bold text-primary">
                    {dataset.format}
                  </span>
                  <h3 className="font-medium text-foreground">{dataset.name}</h3>
                </div>
                <p className="mt-1.5 pl-11 text-sm text-muted-foreground leading-relaxed">
                  {dataset.description}
                </p>
              </div>
              <div className="flex items-center gap-4 pl-11 sm:pl-0">
                <span className="text-xs text-muted-foreground">{dataset.records} records</span>
                <span className="text-xs text-muted-foreground">{dataset.size}</span>
                <span
                  className={`inline-flex items-center gap-1 text-xs font-medium transition-colors ${hoveredIndex === i ? "text-primary" : "text-muted-foreground"}`}
                >
                  Download
                  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14m0 0l-4-4m4 4l4-4" />
                  </svg>
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
