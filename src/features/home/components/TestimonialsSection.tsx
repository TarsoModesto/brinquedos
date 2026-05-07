import { Quote, Star } from 'lucide-react';

// TODO(carretinha): substituir por depoimentos reais (Google, Instagram, indicação)
// quando coletados. Manter formato `name`, `location`, `text`.
const testimonials = [
  {
    name: 'Carla M.',
    location: 'Aniversário de 5 anos · Guarulhos',
    text: 'A festa foi inesquecível! As crianças não saíram de perto da carretinha. Equipe pontual, atenciosa e o brinquedo estava impecável.',
    color: 'from-brand-200 to-accent-200',
  },
  {
    name: 'Rodrigo F.',
    location: 'Confraternização · Osasco',
    text: 'Contratei pra um evento de empresa e foi sucesso até com os adultos. Recomendo sem dúvida — vale cada centavo.',
    color: 'from-support-200 to-violet-200',
  },
  {
    name: 'Juliana P.',
    location: 'Chá de bebê · Santo André',
    text: 'Atendimento humanizado de verdade. Mudei a data em cima da hora e foram super flexíveis. Voltaremos a contratar com certeza!',
    color: 'from-emerald-200 to-support-200',
  },
] as const;

export function TestimonialsSection() {
  return (
    <section className="space-y-10" id="depoimentos">
      <header className="text-center">
        <span className="inline-block rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-200">
          Depoimentos
        </span>
        <h2 className="mt-3 font-display text-3xl font-black text-slate-900 dark:text-white sm:text-4xl">
          Famílias que já se encantaram
        </h2>
      </header>

      <div className="-mx-4 flex snap-x snap-mandatory gap-5 overflow-x-auto px-4 pb-4 sm:mx-0 sm:grid sm:grid-cols-3 sm:gap-6 sm:overflow-visible sm:px-0">
        {testimonials.map((t) => (
          <article
            key={t.name}
            className={`scroll-snap-start min-w-[85%] shrink-0 rounded-3xl bg-gradient-to-br ${t.color} p-[2px] sm:min-w-0`}
          >
            <div className="flex h-full flex-col rounded-[calc(1.5rem-2px)] bg-white/95 p-6 dark:bg-slate-900/95">
              <Quote className="h-8 w-8 text-slate-300 dark:text-slate-600" aria-hidden />
              <p className="mt-3 flex-1 text-slate-700 dark:text-slate-200">"{t.text}"</p>
              <div className="mt-5 flex items-center gap-1 text-accent-400">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <p className="mt-3 font-bold text-slate-900 dark:text-white">{t.name}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{t.location}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
