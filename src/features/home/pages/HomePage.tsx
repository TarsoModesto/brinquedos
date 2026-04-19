import { BenefitsSection } from '../components/BenefitsSection';
import { HeroSection } from '../components/HeroSection';

export function HomePage() {
  return (
    <div className="space-y-4">
      <HeroSection />
      <BenefitsSection />
    </div>
  );
}
