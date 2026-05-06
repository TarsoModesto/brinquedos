import { ChevronDown } from 'lucide-react';

const faq = [
  {
    q: 'Em quais regiões vocês atendem?',
    a: 'Atendemos toda a Grande São Paulo. Para regiões mais distantes, consulte disponibilidade e taxa de deslocamento pelo WhatsApp.',
  },
  {
    q: 'Como funciona a reserva da data?',
    a: 'Basta criar uma conta, escolher a data no calendário e confirmar. Em até algumas horas retornamos com a confirmação ou ajuste necessário.',
  },
  {
    q: 'O brinquedo precisa de espaço grande?',
    a: 'A carretinha cabe em quintais médios e áreas comuns de salões. Se tiver dúvida, mande uma foto pelo WhatsApp que avaliamos junto.',
  },
  {
    q: 'Posso cancelar ou remarcar?',
    a: 'Sim! Você pode cancelar reservas pendentes direto na sua conta. Para remarcação, fale com a gente que ajustamos sem dor de cabeça.',
  },
  {
    q: 'Quais formas de pagamento vocês aceitam?',
    a: 'Aceitamos PIX, transferência e cartão de crédito (parcelamos em até 3x sem juros). Sinal de 30% para garantir a data.',
  },
] as const;

export function FaqSection() {
  return (
    <section className="space-y-8" id="faq">
      <header className="text-center">
        <span className="inline-block rounded-full bg-violet-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-violet-700 dark:bg-violet-900/40 dark:text-violet-200">
          Perguntas frequentes
        </span>
        <h2 className="mt-3 font-display text-3xl font-black text-slate-900 dark:text-white sm:text-4xl">
          Dúvidas? A gente responde.
        </h2>
      </header>

      <div className="mx-auto max-w-3xl space-y-3">
        {faq.map((item) => (
          <details
            key={item.q}
            className="group rounded-2xl border border-slate-200 bg-white p-5 transition open:shadow-soft dark:border-slate-800 dark:bg-slate-900"
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left">
              <span className="font-semibold text-slate-900 dark:text-white">{item.q}</span>
              <ChevronDown className="h-5 w-5 shrink-0 text-slate-500 transition group-open:rotate-180" />
            </summary>
            <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              {item.a}
            </p>
          </details>
        ))}
      </div>
    </section>
  );
}
