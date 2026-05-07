import { BadgeCheck, Baby, Sparkles } from 'lucide-react';
import { SlideDecor } from '@/components/decor/SlideDecor';
import { RevealStagger } from '@/components/ui/RevealStagger';
import { TiltCard } from '@/components/ui/TiltCard';

const attractions = [
  {
    emoji: '🏐',
    title: 'Piscina de bolinhas',
    body: 'Centenas de bolinhas coloridas para mergulhos infinitos.',
    color: 'from-brand-400 to-brand-600',
  },
  {
    emoji: '🦘',
    title: 'Pula-pula',
    body: 'Espaço seguro para gastar energia e dar muitas risadas.',
    color: 'from-support-400 to-support-600',
  },
  {
    emoji: '🎢',
    title: 'Tobogã',
    body: 'Descidas radicais com toda a segurança para a meninada.',
    color: 'from-accent-400 to-orange-500',
  },
  {
    emoji: '🧗',
    title: 'Obstáculos',
    body: 'Túneis e desafios que estimulam a coordenação dos pequenos.',
    color: 'from-joy-400 to-joy-600',
  },
] as const;

const inclusos = [
  { icon: BadgeCheck, label: 'Monitor profissional', color: 'text-emerald-500' },
  { icon: Baby, label: 'Para crianças de 0 a 7 anos', color: 'text-brand-500' },
  { icon: Sparkles, label: 'Iluminação LED para festas à noite', color: 'text-accent-500' },
] as const;

export function AttractionsSection() {
  return (
    <section className="relative space-y-10" id="atracoes">
      <SlideDecor className="absolute -top-12 right-0 hidden h-40 w-52 opacity-90 lg:block animate-float-slow" />

      <header className="text-center">
        <span className="inline-block rounded-full bg-brand-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-brand-700 dark:bg-brand-900/40 dark:text-brand-200">
          O que vem na Carretinha
        </span>
        <h2 className="mt-3 font-display text-3xl font-black text-slate-900 dark:text-white sm:text-4xl">
          Um <span className="gradient-text">mini parque</span> completo na sua festa
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-pretty text-slate-600 dark:text-slate-400">
          A Carretinha Mini Parke chega pronta para virar o ponto alto do seu evento. Tudo num
          só lugar, com segurança e supervisão.
        </p>
      </header>

      <RevealStagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4" step={120} variant="zoom">
        {attractions.map((a) => (
          <TiltCard key={a.title}>
            <article className="group relative h-full overflow-hidden rounded-3xl border border-slate-100 bg-white p-6 shadow-soft transition hover:shadow-lg dark:border-slate-800 dark:bg-slate-900">
              <div
                className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${a.color} transition group-hover:h-2`}
                aria-hidden
              />
              <span
                className="inline-block text-5xl transition-transform duration-500 group-hover:scale-125 group-hover:animate-wiggle"
                aria-hidden
              >
                {a.emoji}
              </span>
              <h3 className="mt-4 text-lg font-bold text-slate-900 dark:text-white">
                {a.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                {a.body}
              </p>
            </article>
          </TiltCard>
        ))}
      </RevealStagger>

      <ul className="mx-auto flex max-w-3xl flex-wrap items-center justify-center gap-3">
        {inclusos.map(({ icon: Icon, label, color }) => (
          <li
            key={label}
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
          >
            <Icon className={`h-4 w-4 ${color}`} aria-hidden />
            {label}
          </li>
        ))}
      </ul>
    </section>
  );
}
