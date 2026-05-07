import { BadgeCheck, Baby, Clock, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { WHATSAPP_URL } from '@/constants/site';
import { cn } from '@/utils/cn';

interface Plan {
  hours: number;
  weekday: number;
  weekend: number;
  highlighted?: boolean;
}

const plans: readonly Plan[] = [
  { hours: 3, weekday: 300, weekend: 400 },
  { hours: 4, weekday: 400, weekend: 500, highlighted: true },
  { hours: 5, weekday: 500, weekend: 600 },
];

const formatBRL = (n: number) =>
  n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 0 });

export function PricingSection() {
  return (
    <section className="space-y-10" id="pacotes">
      <header className="text-center">
        <span className="inline-block rounded-full bg-accent-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-accent-700 dark:bg-accent-700/40 dark:text-accent-200">
          Tabela de preços
        </span>
        <h2 className="mt-3 font-display text-3xl font-black text-slate-900 dark:text-white sm:text-4xl">
          Escolha quantas horas de <span className="gradient-text">diversão</span>
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-pretty text-slate-600 dark:text-slate-400">
          Sem letras miúdas: monitor profissional já incluso e tudo pronto para a alegria das
          crianças de 0 a 7 anos.
        </p>

        <ul className="mx-auto mt-5 flex max-w-2xl flex-wrap items-center justify-center gap-3 text-sm">
          <li className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-2 font-semibold text-emerald-800 shadow-sm dark:bg-emerald-900/40 dark:text-emerald-200">
            <BadgeCheck className="h-4 w-4" aria-hidden /> Monitor incluso
          </li>
          <li className="inline-flex items-center gap-2 rounded-full bg-brand-100 px-4 py-2 font-semibold text-brand-800 shadow-sm dark:bg-brand-900/40 dark:text-brand-200">
            <Baby className="h-4 w-4" aria-hidden /> Crianças de 0 a 7 anos
          </li>
          <li className="inline-flex items-center gap-2 rounded-full bg-support-400/20 px-4 py-2 font-semibold text-support-700 dark:text-support-300">
            <Sparkles className="h-4 w-4" aria-hidden /> Atendemos toda a Grande SP
          </li>
        </ul>
      </header>

      <div className="grid gap-6 md:grid-cols-3">
        {plans.map((p) => {
          const economyPct = Math.round(((p.weekend - p.weekday) / p.weekend) * 100);
          return (
            <article
              key={p.hours}
              className={cn(
                'relative flex flex-col rounded-[2rem] p-[2px] transition hover:-translate-y-1 hover:shadow-lg',
                p.highlighted
                  ? 'bg-gradient-fun shadow-glow'
                  : 'bg-slate-200 dark:bg-slate-800'
              )}
            >
              <div className="flex h-full flex-col rounded-[calc(2rem-2px)] bg-white p-6 dark:bg-slate-900 sm:p-7">
                {p.highlighted ? (
                  <span className="mb-4 inline-flex w-fit items-center gap-1 rounded-full bg-gradient-fun px-3 py-1 text-xs font-black uppercase tracking-wide text-white shadow-soft">
                    <Sparkles className="h-3 w-3" /> Mais escolhido
                  </span>
                ) : null}

                <div className="flex items-baseline gap-2">
                  <Clock
                    className={cn(
                      'h-7 w-7',
                      p.highlighted ? 'text-brand-500' : 'text-slate-400 dark:text-slate-500'
                    )}
                    aria-hidden
                  />
                  <span className="font-display text-5xl font-black text-slate-900 dark:text-white">
                    {p.hours}h
                  </span>
                  <span className="ml-1 text-sm font-semibold text-slate-500 dark:text-slate-400">
                    de festa
                  </span>
                </div>

                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                  {p.hours === 3 && 'Festas mais íntimas e curtinhas.'}
                  {p.hours === 4 && 'O equilíbrio perfeito entre tempo e investimento.'}
                  {p.hours === 5 && 'Para quem quer aproveitar cada minuto da celebração.'}
                </p>

                <div className="mt-6 grid grid-cols-2 gap-3">
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/60">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Seg a Sex
                    </p>
                    <p className="mt-1 font-display text-2xl font-black text-emerald-600 dark:text-emerald-400">
                      {formatBRL(p.weekday)}
                    </p>
                    <p className="mt-1 inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 dark:text-emerald-300">
                      Economize {economyPct}%
                    </p>
                  </div>
                  <div
                    className={cn(
                      'rounded-2xl border p-4',
                      p.highlighted
                        ? 'border-brand-200 bg-gradient-to-br from-brand-50 to-accent-50 dark:border-brand-700 dark:from-brand-900/30 dark:to-accent-700/20'
                        : 'border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800/60'
                    )}
                  >
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Sáb e Dom
                    </p>
                    <p className="mt-1 font-display text-2xl font-black text-slate-900 dark:text-white">
                      {formatBRL(p.weekend)}
                    </p>
                    <p className="mt-1 text-[10px] font-semibold text-slate-500 dark:text-slate-400">
                      Maior procura
                    </p>
                  </div>
                </div>

                <div className="mt-6 flex flex-col gap-2">
                  <Link
                    to="/reservas"
                    className={cn(
                      'inline-flex min-h-11 items-center justify-center rounded-full font-semibold transition',
                      p.highlighted
                        ? 'bg-gradient-fun text-white hover:opacity-90'
                        : 'bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900'
                    )}
                  >
                    Reservar {p.hours}h
                  </Link>
                  <a
                    href={WHATSAPP_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-center text-sm font-semibold text-slate-600 hover:text-brand-600 dark:text-slate-400"
                  >
                    Tirar dúvida no WhatsApp
                  </a>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      <p className="text-center text-xs text-slate-500 dark:text-slate-400">
        Valores válidos para a Grande São Paulo. Para outras regiões, consulte taxa de
        deslocamento pelo WhatsApp.
      </p>
    </section>
  );
}
