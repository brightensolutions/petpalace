import { Header } from "@/components/header"
import { HeroBanner } from "@/components/hero-banner"
import { OffersSection } from "@/components/offers-section"
import { CategoryShowcase } from "@/components/category-showcase"
import { FeaturedProducts } from "@/components/featured-products"
import { VideoShowcase } from "@/components/video-showcase"
import { ImageBanner } from "@/components/image-banner"
import { PetToysSection } from "@/components/pet-toys-section"
import { BlogSection } from "@/components/blog-section"
import { Footer } from "@/components/footer"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <HeroBanner />
        <OffersSection />
        <CategoryShowcase />
        <FeaturedProducts />
        <VideoShowcase />
        <ImageBanner />
        <PetToysSection />
        <BlogSection />
      </main>
      <Footer />
    </div>
  )
}
