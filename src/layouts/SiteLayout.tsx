import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { WalletModal } from '../components/Wallet';
import { useReveal } from '../hooks/useReveal';

const titles: Record<string, string> = {
  '/': 'VENT | Something in the vents is working on your coin',
  '/demo': 'The job | VENT',
  '/teams': 'Entities | VENT',
  '/coins': 'Coin index | VENT',
  '/protocol': 'Protocol | VENT',
  '/studio': 'Studio | VENT',
  '/launch': 'Launch | VENT',
  '/milestones': 'Milestones | VENT',
  '/leaderboard': 'Leaderboard | VENT',
  '/docs': 'Maintenance manual | VENT',
  '/terms': 'Terms | VENT',
  '/privacy': 'Privacy | VENT',
};

export function SiteLayout() {
  const { pathname, hash } = useLocation();
  useReveal();

  useEffect(() => {
    if (!hash) window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
    document.title = titles[pathname] ?? (pathname.startsWith('/coins/') ? 'Coin | VENT' : 'VENT');
  }, [pathname, hash]);

  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <Header />
      <main id="main">
        <Outlet />
      </main>
      <Footer />
      <WalletModal />
    </>
  );
}
