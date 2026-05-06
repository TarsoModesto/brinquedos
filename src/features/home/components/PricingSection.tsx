import { Check, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { WHATSAPP_URL } from '@/constants/site';

const plans = [
  {
    name: 'Básico',
    description: 'Ideal para festas pequenas em casa.',
    priceFrom: 'R$ 350',
    duration: '2 horas de animação',
    items: ['Carretinha colorida', 'Operador da equipe', 'Som ambiente', 'Atende em SP'],
    accent: 'from-sky-400 to-sky-600',
    highlighted: false,
  },
  {
    name: 'Festa Completa',
    description: 'Nosso plano mais escolhido pelas famílias.',
    priceFrom: 'R$ 590',
    duration: '4 horas de pura diversão',
    items: [
      'Tudo do plano Básico',
      'Bolhas de sabão e brindes',
      'Pintura facial leve',
      'Trilha musical personalizada',
    ],
    accent: 'from-pink-500 via-orange-400 to-amber-400',
    highlighted: true,
  },
  {
    name: 'Premium',
    description: 'Para eventos grandes e marcantes.',
    priceFrom: 'R$ 890',
    duration: '6 horas + extras',
    items: [
      'Tudo do plano Completo',
      'Animador profissional',
      'Decoração temática',
      'Cobertura fotográfica',
    ],
    accent: 'from-violet-500 to-fuchsia-500',
    highlighted: false,
  },
] as const;

export function PricingSection() {
  return (
    <section className="space-y-10" id="pacotes">
      <header className="text-center">
        <span className="inline-block rounded-full bg-amber-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-amber-800 dark:bg-amber-900/40 dark:text-amber-200">
          Pacotes
        </span>
        <h2 className="mt-3 font-display text-3xl font-black text-slate-900 dark:text-white sm:text-4xl">
          Um pacote para cada festa
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-pretty text-slate-600 dark:text-slate-400">
          Valores a partir de — confirme detalhes e datas pelo WhatsApp ou solicite no calendário.
        </p>
      </header>

      <div className="grid gap-6 md:grid-cols-3">
        {plans.map((p) => (
          <article
            key={p.name}
            className={`relative flex flex-col rounded-[2rem] p-[2px] transition hover:-translate-y-1 hover:shadow-lg ${
              p.highlighted
                ? 'bg-gradient-to-br ' + p.accent + ' shadow-glow'
                : 'bg-slate-200 dark:bg-slate-800'
            }`}
          >
            <div className="flex h-full flex-col rounded-[calc(2rem-2px)] bg-white p-7 dark:bg-slate-900">
              {p.highlighted ? (
                <span className="mb-4 inline-flex w-fit items-center gap-1 rounded-full bg-gradient-to-r from-pink-500 to-orange-400 px-3 py-1 text-xs font-black uppercase tracking-wide text-white shadow-soft">
                  <Sparkles className="h-3 w-3" /> Mais escolhido
                </span>
              ) : null}
              <h3 className="font-display text-2xl font-black text-slate-900 dark:text-white">
                {p.name}
              </h3>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{p.description}</p>
              <div className="mt-5">
                <span className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  a partir de
                </span>
                <p className="font-display text-4xl font-black text-slate-900 dark:text-white">
                  {p.priceFrom}
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400">{p.duration}</p>
              </div>
              <ul className="mt-6 space-y-3 text-sm">
                {p.items.map((it) => (
                  <li key={it} className="flex items-start gap-2 text-slate-700 dark:text-slate-200">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
                      <Check className="h-3 w-3" />
                    </span>
                    {it}
                  </li>
                ))}
              </ul>
              <div className="mt-7 flex flex-col gap-2">
                <Link
                  to="/reservas"
                  className={`inline-flex min-h-11 items-center justify-center rounded-full font-semibold transition ${
                    p.highlighted
                      ? 'bg-gradient-to-r from-pink-500 to-orange-400 text-white hover:opacity-90'
                      : 'bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900'
                  }`}
                >
                  Reservar este pacote
                </Link>
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-center text-sm font-semibold text-slate-600 hover:text-sky-600 dark:text-slate-400"
                >
                  Tirar dúvida no WhatsApp
                </a>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
