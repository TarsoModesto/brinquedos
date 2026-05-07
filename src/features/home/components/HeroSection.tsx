import { Link } from 'react-router-dom';
import { CalendarDays, ShieldCheck, Sparkles } from 'lucide-react';
import { HERO_IMAGE } from '@/constants/media';
import { WHATSAPP_DISPLAY, WHATSAPP_URL } from '@/constants/site';

const attractions = [
  { label: 'Piscina de bolinhas', emoji: '🏐' },
  { label: 'Pula-pula', emoji: '🦘' },
  { label: 'Tobogã', emoji: '🎢' },
  { label: 'Obstáculos', emoji: '🧗' },
  { label: 'Monitor incluso', emoji: '✨' },
] as const;

export function HeroSection() {
  return (
    <section className="relative">
      <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:gap-14">
        <div className="animate-fade-up space-y-7">
          <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-brand-100 to-accent-100 px-4 py-2 text-sm font-medium text-slate-800 shadow-sm dark:from-brand-900/40 dark:to-accent-700/40 dark:text-slate-100">
            <Sparkles className="h-4 w-4 text-brand-500" aria-hidden />
            O mini parque chega na sua festa
          </div>

          <h1 className="font-display text-5xl font-black leading-[1.05] tracking-tight text-slate-900 dark:text-white sm:text-6xl lg:text-7xl">
            Carretinha{' '}
            <span className="gradient-text">Mini Parke</span>
            <span className="block text-pretty pt-3 font-sans text-base font-medium leading-relaxed text-slate-600 dark:text-slate-400 sm:text-lg">
              Piscina de bolinhas, pula-pula, tobogã e obstáculos num só lugar — com monitor
              profissional incluso. A diversão chega até você.
            </span>
          </h1>

          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-joy-100 px-3 py-1.5 text-xs font-bold text-joy-700 dark:bg-joy-700/30 dark:text-joy-200">
              <ShieldCheck className="h-3.5 w-3.5" aria-hidden /> Brinquedo seguro e revisado
            </span>
            <span className="rounded-full bg-magic-100 px-3 py-1.5 text-xs font-bold text-magic-700 dark:bg-magic-700/30 dark:text-magic-200">
              Equipe atenciosa
            </span>
            <span className="rounded-full bg-support-100 px-3 py-1.5 text-xs font-bold text-support-700 dark:bg-support-700/30 dark:text-support-200">
              Reserva online em minutos
            </span>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Link
              to="/reservas"
              className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-gradient-fun px-8 text-base font-bold text-white shadow-glow transition hover:scale-[1.02] hover:shadow-soft active:scale-[0.98]"
            >
              <CalendarDays className="h-5 w-5 transition group-hover:rotate-6" aria-hidden />
              Reservar agora
            </Link>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border-2 border-[#25D366] bg-white px-8 text-base font-semibold text-[#128C7E] transition hover:bg-emerald-50 active:scale-[0.98] dark:bg-slate-900 dark:hover:bg-emerald-950/30"
            >
              <span className="text-lg" aria-hidden>📞</span>
              {WHATSAPP_DISPLAY}
            </a>
          </div>

          <ul className="flex flex-wrap gap-2 pt-2">
            {attractions.map((c) => (
              <li
                key={c.label}
                className="inline-flex items-center gap-1.5 rounded-full bg-white/80 px-3 py-1 text-xs font-medium text-slate-600 ring-1 ring-slate-200/80 backdrop-blur dark:bg-slate-900/70 dark:text-slate-300 dark:ring-slate-700"
              >
                <span aria-hidden>{c.emoji}</span>
                {c.label}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative">
          <div className="absolute -left-6 -top-8 h-24 w-24 animate-float-slow rounded-full bg-gradient-to-br from-brand-300 to-brand-500 opacity-70 blur-2xl" aria-hidden />
          <div className="absolute -bottom-8 -right-6 h-32 w-32 animate-float rounded-full bg-gradient-to-br from-accent-300 to-orange-400 opacity-70 blur-2xl" aria-hidden />
          <div className="absolute -bottom-4 left-1/2 h-20 w-20 -translate-x-1/2 animate-float-fast rounded-full bg-gradient-to-br from-support-300 to-support-500 opacity-60 blur-2xl" aria-hidden />

          <div className="relative animate-float overflow-hidden rounded-[2.5rem] shadow-glow ring-1 ring-white/40">
            <img
              src={HERO_IMAGE}
              alt="Carretinha Mini Parke colorida em dia ensolarado com tobogã verde e estrutura completa"
              className="aspect-[3/4] h-full w-full object-cover"
              loading="eager"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent" aria-hidden />
            <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between gap-3 rounded-2xl bg-white/95 p-3 shadow-soft backdrop-blur dark:bg-slate-900/90">
              <div>
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Próxima data livre</p>
                <p className="text-base font-bold text-slate-900 dark:text-white">
                  Veja no calendário
                </p>
              </div>
              <Link
                to="/reservas"
                className="rounded-full bg-slate-900 px-4 py-2 text-xs font-bold text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900"
              >
                Ver datas
              </Link>
            </div>
          </div>

          <span className="absolute -left-3 top-10 select-none text-3xl animate-float-slow" aria-hidden>🎈</span>
          <span className="absolute right-2 top-2 select-none text-2xl animate-float" aria-hidden>🎉</span>
          <span className="absolute -bottom-2 left-10 select-none text-2xl animate-float-slow" aria-hidden>✨</span>
        </div>
      </div>
    </section>
  );
}
