import { Nav } from "@/components/nav"
import { FeaturedReview } from "@/components/featured-review"
import { StatsBar } from "@/components/stats-bar"
import { ExploreGrid } from "@/components/explore-grid"
import { NewsletterSignup } from "@/components/newsletter-signup"
import { OpenDatasets } from "@/components/open-datasets"
import { Footer } from "@/components/footer"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Nav />
      <main>
        <FeaturedReview />
        <StatsBar />
        <ExploreGrid />
        <NewsletterSignup />
        <OpenDatasets />
      </main>
      <Footer />
    </div>
  )
}
