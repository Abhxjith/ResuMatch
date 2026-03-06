import Navbar from "../components/layout/Navbar";
import Hero from "../components/home/Hero";
import HeroIllustrations from "../components/home/HeroIllustrations";
import ProductPreview from "../components/home/ProductPreview";
import HowItWorks from "../components/home/HowItWorks";
import Pricing from "../components/home/Pricing";
import CTA from "../components/home/CTA";
import Footer from "../components/home/Footer";
import { inter } from "../lib/fonts";

export default function Home() {
  return (
    <div className={`min-h-screen flex flex-col items-center w-full overflow-x-clip ${inter.className}`}>
      <Navbar />
      <main className="flex-1 flex flex-col items-center w-full pt-24 sm:pt-32 md:pt-44 relative max-w-7xl mx-auto px-4 sm:px-6">
        <HeroIllustrations />
        <Hero />
        <ProductPreview />
        <HowItWorks />
        <Pricing />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
