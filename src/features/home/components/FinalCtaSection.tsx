import { Link } from 'react-router-dom';
import { CalendarDays, MessageCircle } from 'lucide-react';
import { Confetti } from '@/components/decor/Confetti';
import { WHATSAPP_URL } from '@/constants/site';

export function FinalCtaSection() {
  return (
    <section className="relative overflow-hidden rounded-[2.5rem] p-[2px]">
      <div className="absolute inset-0 animate-gradient bg-gradient-festa bg-[length:200%_200%]" aria-hidden />
      <div className="relative overflow-hidden rounded-[calc(2.5rem-2px)] bg-white/95 p-10 text-center backdrop-blur dark:bg-slate-950/90 sm:p-14">
        <Confetti />
        <div className="relative mx-auto max-w-2xl space-y-5">
          <span className="inline-block rounded-full bg-gradient-fun px-4 py-1.5 text-xs font-black uppercase tracking-wider text-white shadow-soft">
            Pronto para a festa?
          </span>
          <h2 className="font-display text-3xl font-black text-slate-900 dark:text-white sm:text-5xl">
            A diversão chega <span className="gradient-text">até você</span>
          </h2>
          <p className="text-pretty text-slate-600 dark:text-slate-400">
            Reserve já a sua data ou tire qualquer dúvida pelo WhatsApp. Estamos prontos para
            transformar a sua festa em uma experiência inesquecível.
          </p>
          <div className="flex flex-col items-center justify-center gap-3 pt-2 sm:flex-row">
            <Link
              to="/reservas"
              className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-slate-900 px-8 text-base font-semibold text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
            >
              <CalendarDays className="h-5 w-5 transition group-hover:rotate-6" aria-hidden />
              Ver datas disponíveis
            </Link>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border-2 border-[#25D366] bg-white px-8 text-base font-semibold text-[#128C7E] transition hover:bg-emerald-50 dark:bg-slate-900 dark:hover:bg-emerald-950/30"
            >
              <MessageCircle className="h-5 w-5" aria-hidden />
              Falar no WhatsApp
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
