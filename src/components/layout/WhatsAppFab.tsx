import { MessageCircle } from 'lucide-react';
import { WHATSAPP_DISPLAY, WHATSAPP_URL } from '@/constants/site';

/**
 * Botão flutuante de WhatsApp — apenas desktop.
 * Em mobile usamos `MobileBottomCta` em vez disso.
 */
export function WhatsAppFab() {
  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="group fixed bottom-8 right-8 z-50 hidden items-center gap-2 rounded-full bg-[#25D366] px-5 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-900/30 transition hover:scale-[1.04] hover:bg-[#20bd5a] active:scale-[0.98] sm:flex"
      aria-label={`Conversar no WhatsApp ${WHATSAPP_DISPLAY}`}
    >
      <span className="relative flex h-5 w-5 items-center justify-center">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white/40" aria-hidden />
        <MessageCircle className="relative h-5 w-5" aria-hidden />
      </span>
      <span className="hidden sm:inline">WhatsApp</span>
      <span className="sr-only">{WHATSAPP_DISPLAY}</span>
    </a>
  );
}
