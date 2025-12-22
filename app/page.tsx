import { HeroSection } from "@/components/HeroSection"
import { LogoMarquee } from "@/components/LogoMarquee"
import { ServicesSection } from "@/components/ServicesSection"
import { FeaturesSection } from "@/components/FeaturesSection"
import { FAQSection } from "@/components/FAQSection"

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <HeroSection />
      <LogoMarquee />
      <ServicesSection />
      <FeaturesSection />
      <FAQSection />
    </main>
  )
}
