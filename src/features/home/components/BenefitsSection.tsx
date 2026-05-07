import { Heart, Shield, Smile, Sparkles } from 'lucide-react';
import { RevealStagger } from '@/components/ui/RevealStagger';

const benefits = [
  {
    title: 'Crianças felizes',
    description: 'Diversão garantida do início ao fim da festa, com atenção especial aos pequenos.',
    icon: Smile,
    accent: 'from-brand-400 to-brand-600',
  },
  {
    title: '100% seguro',
    description: 'Brinquedo revisado a cada uso e operação acompanhada pela nossa equipe.',
    icon: Shield,
    accent: 'from-support-400 to-support-600',
  },
  {
    title: 'Equipe atenciosa',
    description: 'Atendimento humanizado, falamos no seu tempo e ajustamos cada detalhe.',
    icon: Heart,
    accent: 'from-magic-400 to-magic-600',
  },
  {
    title: 'Estrutura completa',
    description: 'Tudo num só lugar: piscina, pula-pula, tobogã, obstáculos e monitor incluso.',
    icon: Sparkles,
    accent: 'from-accent-400 to-orange-500',
  },
] as const;

export function BenefitsSection() {
  return (
    <section className="space-y-8" id="beneficios">
      <header className="text-center">
        <span className="inline-block rounded-full bg-brand-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-brand-700 dark:bg-brand-900/40 dark:text-brand-200">
          Por que escolher
        </span>
        <h2 className="mt-3 font-display text-3xl font-black text-slate-900 dark:text-white sm:text-4xl">
          Mais que um brinquedo, uma <span className="gradient-text">experiência</span>
        </h2>
      </header>

      <RevealStagger className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4" step={120} variant="up">
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
      </RevealStagger>
    </section>
  );
}
