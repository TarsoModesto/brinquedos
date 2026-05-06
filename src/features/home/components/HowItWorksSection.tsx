import { CalendarCheck, PartyPopper, Truck } from 'lucide-react';

const steps = [
  {
    title: 'Escolha a data',
    body: 'Confira no calendário quando o carretar está disponível na sua região.',
    icon: CalendarCheck,
    accent: 'from-sky-400 to-sky-600',
  },
  {
    title: 'Solicite a reserva',
    body: 'Faça login, informe seus dados e envie. Você recebe retorno em poucas horas.',
    icon: PartyPopper,
    accent: 'from-pink-400 to-rose-500',
  },
  {
    title: 'Alegria na sua festa',
    body: 'No dia, levamos o brinquedo até você com toda a segurança e diversão.',
    icon: Truck,
    accent: 'from-amber-400 to-orange-500',
  },
] as const;

export function HowItWorksSection() {
  return (
    <section className="space-y-10" id="como-funciona">
      <header className="text-center">
        <span className="inline-block rounded-full bg-sky-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-sky-700 dark:bg-sky-900/40 dark:text-sky-200">
          Como funciona
        </span>
        <h2 className="mt-3 font-display text-3xl font-black text-slate-900 dark:text-white sm:text-4xl">
          Reserve em <span className="gradient-text">3 passos</span>
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-pretty text-slate-600 dark:text-slate-400">
          Simples, rápido e sem burocracia. Garanta a diversão da sua festa hoje.
        </p>
      </header>

      <ol className="relative grid gap-6 md:grid-cols-3">
        <span
          className="pointer-events-none absolute left-12 right-12 top-9 hidden h-0.5 border-t-2 border-dashed border-slate-300 md:block dark:border-slate-700"
          aria-hidden
        />
        {steps.map((s, i) => (
          <li
            key={s.title}
            className="relative flex flex-col items-center rounded-3xl border border-slate-100 bg-white/95 p-6 text-center shadow-soft backdrop-blur transition hover:-translate-y-1 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900/90"
          >
            <span
              className={`relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${s.accent} text-white shadow-soft`}
            >
              <s.icon className="h-7 w-7" aria-hidden />
              <span className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-white text-sm font-black text-slate-900 shadow ring-1 ring-slate-200 dark:bg-slate-950 dark:text-white dark:ring-slate-700">
                {i + 1}
              </span>
            </span>
            <h3 className="mt-5 text-xl font-bold text-slate-900 dark:text-white">{s.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              {s.body}
            </p>
          </li>
        ))}
      </ol>
    </section>
  );
}
