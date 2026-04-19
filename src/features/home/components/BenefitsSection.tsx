import { Shield, Smile, Star } from 'lucide-react';
import { Card } from '@/components/ui/Card';

const benefits = [
  {
    title: 'Crianças felizes',
    description: 'Diversão garantida do início ao fim da festa.',
    icon: Smile,
  },
  {
    title: '100% seguro',
    description: 'Brinquedo revisado e operação supervisionada.',
    icon: Shield,
  },
  {
    title: 'Já encantamos +200 festas',
    description: 'Avaliação 5 estrelas dos nossos clientes.',
    icon: Star,
  },
] as const;

export function BenefitsSection() {
  return (
    <section className="mt-20 space-y-8" id="beneficios">
      <div className="grid gap-6 md:grid-cols-3">
        {benefits.map(({ title, description, icon: Icon }) => (
          <Card key={title} className="animate-fade-in p-8">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-100 text-sky-800 dark:bg-sky-900/50 dark:text-sky-200">
              <Icon className="h-7 w-7" aria-hidden />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">{title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              {description}
            </p>
          </Card>
        ))}
      </div>
    </section>
  );
}
