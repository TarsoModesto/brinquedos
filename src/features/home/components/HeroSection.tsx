import { Link } from 'react-router-dom';
import { CalendarDays, Sparkles } from 'lucide-react';
import { HERO_IMAGE } from '@/constants/media';
import { WHATSAPP_DISPLAY, WHATSAPP_URL } from '@/constants/site';
import { cn } from '@/utils/cn';

const btnPrimary =
  'inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-sky-400 px-8 text-base font-semibold text-white shadow-soft transition hover:bg-sky-500 active:scale-[0.98] dark:bg-sky-500 dark:hover:bg-sky-400';
const btnWa =
  'inline-flex min-h-12 items-center justify-center gap-2 rounded-full border-2 border-[#25D366] bg-white px-8 text-base font-semibold text-[#128C7E] transition hover:bg-emerald-50 active:scale-[0.98] dark:bg-slate-900 dark:hover:bg-emerald-950/30';

export function HeroSection() {
  return (
    <section className="relative grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-12">
      <div className="animate-fade-in space-y-6">
        <div className="inline-flex items-center gap-2 rounded-full bg-sky-100 px-4 py-2 text-sm font-medium text-sky-900 dark:bg-sky-900/40 dark:text-sky-100">
          <Sparkles className="h-4 w-4" aria-hidden />
          Diversão garantida para a sua festa
        </div>
        <h1 className="text-balance text-4xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-5xl lg:text-6xl">
          Carretar da <span className="text-sky-500 dark:text-sky-400">Alegria</span> 🥳
        </h1>
        <p className="max-w-xl text-lg text-slate-600 dark:text-slate-400">
          Aluguel do nosso carretar de brinquedo para festas, eventos e aniversários. Confira as datas
          disponíveis e reserve o seu dia!
        </p>
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <Link to="/reservas" className={cn(btnPrimary)}>
            <CalendarDays className="h-5 w-5" />
            Ver datas disponíveis
          </Link>
          <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className={cn(btnWa)}>
            <span className="text-lg" aria-hidden>
              📞
            </span>
            {WHATSAPP_DISPLAY}
          </a>
        </div>
      </div>

      <div className="relative float">
        <div className="overflow-hidden rounded-[2rem] shadow-soft ring-1 ring-slate-200/80 dark:ring-slate-700">
          <img
            src={HERO_IMAGE}
            alt="Carreta de brinquedo colorida para festas"
            className="aspect-[4/3] h-full w-full object-cover"
            loading="eager"
          />
        </div>
      </div>
    </section>
  );
}
