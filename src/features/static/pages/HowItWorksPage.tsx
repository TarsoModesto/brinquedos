import { CalendarCheck, PartyPopper, Truck } from 'lucide-react';
import { Card } from '@/components/ui/Card';

const steps = [
  {
    title: '1. Escolha a data',
    body: 'Abra o calendário de reservas e veja quando o carretar está disponível na sua região.',
    icon: CalendarCheck,
  },
  {
    title: '2. Solicite a reserva',
    body: 'Faça login, informe seus dados e envie o pedido. Você receberá retorno em breve.',
    icon: PartyPopper,
  },
  {
    title: '3. Alegria na sua festa',
    body: 'No dia combinado, levamos o brinquedo até você com toda a segurança e diversão.',
    icon: Truck,
  },
] as const;

export function HowItWorksPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-10 animate-fade-in">
      <header className="text-center">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white sm:text-4xl">Como funciona</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">Três passos simples para garantir a diversão.</p>
      </header>
      <div className="space-y-4">
        {steps.map(({ title, body, icon: Icon }) => (
          <Card key={title} className="flex gap-4 p-6">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-sky-100 text-sky-700 dark:bg-sky-900/50 dark:text-sky-200">
              <Icon className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">{title}</h2>
              <p className="mt-1 text-slate-600 dark:text-slate-400">{body}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
