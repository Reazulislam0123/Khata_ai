import { Hero } from "@/components/landing/Hero";
import { LiveDemoSandbox } from "@/components/landing/LiveDemoSandbox";
import { CurriculumShowcase } from "@/components/landing/CurriculumShowcase";
import { PricingSection } from "@/components/landing/PricingSection";
import { Footer } from "@/components/landing/Footer";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Hero />
      <LiveDemoSandbox />
      <CurriculumShowcase />
      <PricingSection />
      <Footer />
    </div>
  );
}
