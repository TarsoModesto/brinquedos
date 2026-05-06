import { Heart, Shield, Smile, Sparkles } from 'lucide-react';

const benefits = [
  {
    title: 'Crianças felizes',
    description: 'Diversão garantida do início ao fim da festa, com atenção especial aos pequenos.',
    icon: Smile,
    accent: 'from-pink-400 to-rose-500',
  },
  {
    title: '100% seguro',
    description: 'Brinquedo revisado a cada uso e operação supervisionada pela nossa equipe.',
    icon: Shield,
    accent: 'from-sky-400 to-sky-600',
  },
  {
    title: '+200 festas realizadas',
    description: 'Avaliação 5 estrelas e clientes que voltam a contratar a cada nova celebração.',
    icon: Sparkles,
    accent: 'from-amber-400 to-orange-500',
  },
  {
    title: 'Atendimento humanizado',
    description: 'Falamos no seu tempo, ajustamos detalhes e tratamos cada festa como única.',
    icon: Heart,
    accent: 'from-emerald-400 to-emerald-600',
  },
] as const;

export function BenefitsSection() {
  return (
    <section className="space-y-8" id="beneficios">
      <header className="text-center">
        <span className="inline-block rounded-full bg-rose-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-rose-700 dark:bg-rose-900/40 dark:text-rose-200">
          Por que escolher
        </span>
        <h2 className="mt-3 font-display text-3xl font-black text-slate-900 dark:text-white sm:text-4xl">
          Mais que um brinquedo, uma <span className="gradient-text">experiência</span>
        </h2>
      </header>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {benefits.map(({ title, description, icon: Icon, accent }) => (
          <article
            key={title}
            className="group relative overflow-hidden rounded-3xl border border-slate-100 bg-white p-6 shadow-soft transition hover:-translate-y-1 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900"
          >
            <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${accent} text-white shadow-soft`}>
              <Icon className="h-6 w-6" aria-hidden />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">{title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              {description}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
