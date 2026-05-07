import { Link, useLocation } from 'react-router-dom';
import { CalendarDays, MessageCircle } from 'lucide-react';
import { WHATSAPP_URL } from '@/constants/site';

/**
 * CTA fixo no rodapé mobile com 2 ações: Reservar e WhatsApp.
 * Aparece em todas as páginas públicas exceto na própria /reservas.
 */
export function MobileBottomCta() {
  const { pathname } = useLocation();
  if (pathname === '/reservas') return null;
  if (pathname.startsWith('/admin')) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-200/70 bg-white/95 px-3 py-2.5 backdrop-blur-md sm:hidden dark:border-slate-800 dark:bg-slate-950/95">
      <div className="flex items-center gap-2">
        <Link
          to="/reservas"
          className="flex flex-1 items-center justify-center gap-2 rounded-full bg-gradient-fun py-3 text-sm font-bold text-white shadow-glow active:scale-[0.98]"
        >
          <CalendarDays className="h-4 w-4" aria-hidden />
          Reservar agora
        </Link>
        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Falar no WhatsApp"
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#25D366] text-white shadow-soft active:scale-[0.95]"
        >
          <MessageCircle className="h-5 w-5" aria-hidden />
        </a>
      </div>
    </div>
  );
}
