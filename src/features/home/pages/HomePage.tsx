import { Reveal } from '@/components/ui/Reveal';
import { AttractionsSection } from '../components/AttractionsSection';
import { BenefitsSection } from '../components/BenefitsSection';
import { FaqSection } from '../components/FaqSection';
import { FinalCtaSection } from '../components/FinalCtaSection';
import { GalleryPreviewSection } from '../components/GalleryPreviewSection';
import { HeroSection } from '../components/HeroSection';
import { HowItWorksSection } from '../components/HowItWorksSection';
import { PricingSection } from '../components/PricingSection';
import { TestimonialsSection } from '../components/TestimonialsSection';
import { VideoShowcaseSection } from '../components/VideoShowcaseSection';

export function HomePage() {
  return (
    <div className="space-y-24 pb-8 sm:space-y-32">
      <HeroSection />
      <Reveal as="section" variant="up"><BenefitsSection /></Reveal>
      <Reveal as="section" variant="left"><AttractionsSection /></Reveal>
      <Reveal as="section" variant="zoom"><VideoShowcaseSection /></Reveal>
      <Reveal as="section" variant="right"><HowItWorksSection /></Reveal>
      <Reveal as="section" variant="zoom"><GalleryPreviewSection /></Reveal>
      <Reveal as="section" variant="up"><PricingSection /></Reveal>
      <Reveal as="section" variant="left"><TestimonialsSection /></Reveal>
      <Reveal as="section" variant="right"><FaqSection /></Reveal>
      <Reveal as="section" variant="zoom"><FinalCtaSection /></Reveal>
    </div>
  );
}
