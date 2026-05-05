import Navbar from "@/components/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import RevenueSection from "@/components/landing/RevenueSection";
import MobilePreviewSection from "@/components/landing/MobilePreviewSection";
import PricingSection from "@/components/landing/PricingSection";
import ComparisonSection from "@/components/landing/ComparisonSection";
import { CTASection, Footer } from "@/components/landing/CTAFooter";

const Index = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <HeroSection />
    <FeaturesSection />
    <RevenueSection />
    <MobilePreviewSection />
    <ComparisonSection />
    <PricingSection />
    <CTASection />
    <Footer />
  </div>
);

export default Index;
