import { Outlet } from 'react-router-dom';
import { Footer } from './Footer';
import { Header } from './Header';
import { PageDecor } from './PageDecor';
import { SecondaryNav } from './SecondaryNav';
import { WhatsAppFab } from './WhatsAppFab';

export function MainLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <PageDecor />
      <Header />
      <SecondaryNav />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6">
        <Outlet />
      </main>
      <Footer />
      <WhatsAppFab />
    </div>
  );
}
