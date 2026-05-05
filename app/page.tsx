import Navbar from "@/components/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import RevenueSection from "@/components/landing/RevenueSection";
import MobilePreviewSection from "@/components/landing/MobilePreviewSection";
import ComparisonSection from "@/components/landing/ComparisonSection";
import SocialProofSection from "@/components/landing/SocialProofSection";
import PricingSection from "@/components/landing/PricingSection";
import FAQSection from "@/components/landing/FAQSection";
import { CTASection, Footer } from "@/components/landing/CTAFooter";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <RevenueSection />
      <MobilePreviewSection />
      <ComparisonSection />
      <SocialProofSection />
      <PricingSection />
      <FAQSection />
      <CTASection />
      <Footer />
    </div>
  );
}
