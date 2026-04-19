import { MessageCircle } from 'lucide-react';
import { WHATSAPP_DISPLAY, WHATSAPP_URL } from '@/constants/site';

export function WhatsAppFab() {
  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-4 z-50 flex items-center gap-2 rounded-full bg-[#25D366] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-900/20 transition hover:scale-[1.02] hover:bg-[#20bd5a] active:scale-[0.98] sm:bottom-8 sm:right-8"
    >
      <MessageCircle className="h-5 w-5" aria-hidden />
      WhatsApp
      <span className="sr-only"> — {WHATSAPP_DISPLAY}</span>
    </a>
  );
}
