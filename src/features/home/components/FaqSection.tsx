import { ChevronDown } from 'lucide-react';

const faq = [
  {
    q: 'Em quais regiões vocês atendem?',
    a: 'Atendemos toda a Grande São Paulo. Para regiões mais distantes, consulte disponibilidade e taxa de deslocamento pelo WhatsApp.',
  },
  {
    q: 'Quais brinquedos vêm na Carretinha?',
    a: 'Em todas as festas a Carretinha leva piscina de bolinhas, pula-pula, tobogã e obstáculos. Tudo na mesma unidade, sem custos adicionais.',
  },
  {
    q: 'Para qual idade a Carretinha é indicada?',
    a: 'A estrutura é pensada para crianças de 0 a 7 anos, com supervisão do nosso monitor durante toda a festa.',
  },
  {
    q: 'O monitor já está incluso?',
    a: 'Sim! Todas as reservas incluem um monitor profissional acompanhando os pequenos do início ao fim — sem cobrança extra.',
  },
  {
    q: 'Como funciona a reserva da data?',
    a: 'Crie uma conta, escolha a data no calendário e confirme. Em até algumas horas retornamos com a confirmação ou ajuste necessário.',
  },
  {
    q: 'Qual o espaço necessário para a Carretinha?',
    a: 'Cabe em quintais médios e áreas comuns de salões. Se tiver dúvida, mande uma foto pelo WhatsApp que avaliamos junto com você antes de confirmar.',
  },
  {
    q: 'E se chover no dia da festa?',
    a: 'Conversamos com você previamente para encontrar a melhor solução: remarcação sem custo adicional ou adaptação do espaço, conforme o caso.',
  },
  {
    q: 'Posso cancelar ou remarcar?',
    a: 'Sim! Reservas pendentes podem ser canceladas direto na sua conta. Para remarcação, fale com a gente que ajustamos sem dor de cabeça.',
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
