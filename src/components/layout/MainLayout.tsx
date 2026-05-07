import { Outlet } from 'react-router-dom';
import { FloatingBalls } from '@/components/decor/FloatingBalls';
import { Footer } from './Footer';
import { MobileBottomCta } from './MobileBottomCta';
import { PageDecor } from './PageDecor';
import { PageTransition } from './PageTransition';
import { Topbar } from './Topbar';
import { WhatsAppFab } from './WhatsAppFab';

export function MainLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <PageDecor />
      <FloatingBalls />

      <Topbar />

      <main className="relative mx-auto w-full max-w-6xl flex-1 px-4 pb-24 pt-6 sm:px-6 sm:pb-12 sm:pt-10">
        <PageTransition>
          <Outlet />
        </PageTransition>
      </main>
      <Footer />
      <MobileBottomCta />
      <WhatsAppFab />
    </div>
  );
}
