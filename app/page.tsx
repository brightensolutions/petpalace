import { Header } from "../components/Header";
import { HeroBanner } from "../components/hero-banner";
import { PromotionalBanners } from "../components/promotional-banners";
import { Footer } from "../components/Footer";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <HeroBanner />
        <PromotionalBanners />
      </main>
      <Footer />
    </div>
  );
}
