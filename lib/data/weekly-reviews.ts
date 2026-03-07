export interface WeeklyReview {
  slug: string
  title: string
  dateRange: string
  publishedDate: string
  excerpt: string
  stats: {
    totalEvents: number
    politicalEvents: number
    disasters: number
    dynasties: number
  }
  exchangeRate: {
    value: number
    trend: "up" | "down" | "stable"
    percentChange: number
  }
  topStory: string
  categories: string[]
}

export const weeklyReviews: WeeklyReview[] = [
  {
    slug: "2026-02-22",
    title: "Week of February 15-22, 2026",
    dateRange: "February 15-22, 2026",
    publishedDate: "2026-02-22",
    excerpt: "Duterte ICC detention confirmed, VP impeachment proceedings blocked by Supreme Court, flood control corruption scandal widens.",
    stats: {
      totalEvents: 12,
      politicalEvents: 9,
      disasters: 3,
      dynasties: 2,
    },
    exchangeRate: {
      value: 57.96,
      trend: "up",
      percentChange: 0.84,
    },
    topStory: "Duterte ICC Detention",
    categories: ["Political", "Legal", "International Relations"],
  },
  {
    slug: "2026-02-15",
    title: "Week of February 8-15, 2026",
    dateRange: "February 8-15, 2026",
    publishedDate: "2026-02-15",
    excerpt: "Mass protests continue nationwide, Senate investigation intensifies, new corruption allegations emerge.",
    stats: {
      totalEvents: 10,
      politicalEvents: 7,
      disasters: 2,
      dynasties: 3,
    },
    exchangeRate: {
      value: 57.48,
      trend: "down",
      percentChange: -0.32,
    },
    topStory: "Senate Corruption Probe",
    categories: ["Political", "Economic"],
  },
  {
    slug: "2026-02-08",
    title: "Week of February 1-8, 2026",
    dateRange: "February 1-8, 2026",
    publishedDate: "2026-02-08",
    excerpt: "Trillion Peso March draws millions, Garcia dynasty loses Cebu stronghold, Dy rises to national prominence.",
    stats: {
      totalEvents: 14,
      politicalEvents: 10,
      disasters: 1,
      dynasties: 4,
    },
    exchangeRate: {
      value: 57.66,
      trend: "up",
      percentChange: 0.52,
    },
    topStory: "Trillion Peso March",
    categories: ["Political", "Cultural", "Economic"],
  },
  {
    slug: "2026-01-31",
    title: "Week of January 24-31, 2026",
    dateRange: "January 24-31, 2026",
    publishedDate: "2026-01-31",
    excerpt: "Chiz Escudero ousted as Senate President, new Speaker sworn in, flood control hearings continue.",
    stats: {
      totalEvents: 11,
      politicalEvents: 8,
      disasters: 2,
      dynasties: 3,
    },
    exchangeRate: {
      value: 57.36,
      trend: "down",
      percentChange: -0.45,
    },
    topStory: "Senate Leadership Change",
    categories: ["Political", "Legal"],
  },
  {
    slug: "2026-01-24",
    title: "Week of January 17-24, 2026",
    dateRange: "January 17-24, 2026",
    publishedDate: "2026-01-24",
    excerpt: "Martin Romualdez resignation aftermath, opposition coalition forms, economic indicators show recovery.",
    stats: {
      totalEvents: 9,
      politicalEvents: 6,
      disasters: 1,
      dynasties: 2,
    },
    exchangeRate: {
      value: 57.62,
      trend: "up",
      percentChange: 0.28,
    },
    topStory: "Opposition Coalition",
    categories: ["Political", "Economic"],
  },
  {
    slug: "2026-01-16",
    title: "Week of January 10-16, 2026",
    dateRange: "January 10-16, 2026",
    publishedDate: "2026-01-16",
    excerpt: "New year brings fresh political alignments, Marcos addresses flood control in first speech of 2026.",
    stats: {
      totalEvents: 8,
      politicalEvents: 5,
      disasters: 2,
      dynasties: 2,
    },
    exchangeRate: {
      value: 57.46,
      trend: "stable",
      percentChange: 0.02,
    },
    topStory: "Political Realignment",
    categories: ["Political"],
  },
  {
    slug: "2026-01-09",
    title: "Week of January 3-9, 2026",
    dateRange: "January 3-9, 2026",
    publishedDate: "2026-01-09",
    excerpt: "Holiday season ends with political maneuvering, preparations for anniversary commemorations begin.",
    stats: {
      totalEvents: 7,
      politicalEvents: 4,
      disasters: 1,
      dynasties: 1,
    },
    exchangeRate: {
      value: 57.44,
      trend: "down",
      percentChange: -0.18,
    },
    topStory: "Post-Holiday Politics",
    categories: ["Political", "Cultural"],
  },
  {
    slug: "2026-01-02",
    title: "Week of December 27, 2025 - January 2, 2026",
    dateRange: "December 27, 2025 - January 2, 2026",
    publishedDate: "2026-01-02",
    excerpt: "Year-end review: 2025 marked by Duterte ICC trial, flood control scandal, dynasty shifts. New Year brings hope for reform.",
    stats: {
      totalEvents: 15,
      politicalEvents: 8,
      disasters: 3,
      dynasties: 5,
    },
    exchangeRate: {
      value: 57.54,
      trend: "up",
      percentChange: 1.2,
    },
    topStory: "2025 Year in Review",
    categories: ["Political", "Legal", "Economic", "Cultural"],
  },
]

export function getWeeklyReviewBySlug(slug: string): WeeklyReview | undefined {
  return weeklyReviews.find((review) => review.slug === slug)
}

export function getLatestWeeklyReview(): WeeklyReview {
  return weeklyReviews[0]
}

export function getAllWeeklyReviewSlugs(): string[] {
  return weeklyReviews.map((review) => review.slug)
}
