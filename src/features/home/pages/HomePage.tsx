import { BenefitsSection } from '../components/BenefitsSection';
import { FaqSection } from '../components/FaqSection';
import { FinalCtaSection } from '../components/FinalCtaSection';
import { GalleryPreviewSection } from '../components/GalleryPreviewSection';
import { HeroSection } from '../components/HeroSection';
import { HowItWorksSection } from '../components/HowItWorksSection';
import { PricingSection } from '../components/PricingSection';
import { TestimonialsSection } from '../components/TestimonialsSection';

export function HomePage() {
  return (
    <div className="space-y-24 pb-8 sm:space-y-32">
      <HeroSection />
      <BenefitsSection />
      <HowItWorksSection />
      <GalleryPreviewSection />
      <PricingSection />
      <TestimonialsSection />
      <FaqSection />
      <FinalCtaSection />
    </div>
  );
}
