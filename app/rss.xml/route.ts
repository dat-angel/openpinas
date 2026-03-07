import { weeklyReviews } from "@/lib/data/weekly-reviews"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://openpinas.com"

function escapeXml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;")
}

export async function GET() {
  const items = weeklyReviews
    .map((review) => {
      const link = `${SITE_URL}/weekly-reviews/${review.slug}`
      const pubDate = new Date(review.publishedDate).toUTCString()

      return `    <item>
      <title>${escapeXml(review.topStory)} - ${escapeXml(review.dateRange)}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <pubDate>${pubDate}</pubDate>
      <description>${escapeXml(review.excerpt)}</description>
      <category>${review.categories.join(", ")}</category>
    </item>`
    })
    .join("\n")

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>OpenPinas Weekly Reviews</title>
    <link>${SITE_URL}</link>
    <description>Weekly digests of Philippine news and political events for the diaspora. Politics, economics, culture, and more—summarized with context that matters.</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml"/>
    <image>
      <url>${SITE_URL}/og-image.png</url>
      <title>OpenPinas</title>
      <link>${SITE_URL}</link>
    </image>
${items}
  </channel>
</rss>`

  return new Response(rss, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  })
}
