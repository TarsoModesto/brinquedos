import { Mail, MapPin, Phone } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { WHATSAPP_DISPLAY, WHATSAPP_URL } from '@/constants/site';

export function ContactPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-8 animate-fade-in">
      <header className="text-center">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white sm:text-4xl">Contato</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">Fale com a equipe Carretar da Alegria.</p>
      </header>
      <Card className="space-y-6 p-8">
        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-4 rounded-2xl border border-slate-100 p-4 transition hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/50"
        >
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40">
            <Phone className="h-6 w-6" />
          </span>
          <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">WhatsApp</p>
            <p className="font-semibold text-slate-900 dark:text-white">{WHATSAPP_DISPLAY}</p>
          </div>
        </a>
        <div className="flex items-center gap-4 rounded-2xl border border-slate-100 p-4 dark:border-slate-800">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-sky-100 text-sky-700 dark:bg-sky-900/40">
            <Mail className="h-6 w-6" />
          </span>
          <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">E-mail</p>
            <p className="font-semibold text-slate-900 dark:text-white">contato@carretardaalegria.com.br</p>
          </div>
        </div>
        <div className="flex items-start gap-4 rounded-2xl border border-slate-100 p-4 dark:border-slate-800">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-800 dark:bg-amber-900/40">
            <MapPin className="h-6 w-6" />
          </span>
          <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Atendimento</p>
            <p className="text-slate-700 dark:text-slate-300">Grande São Paulo e região — consulte disponibilidade pelo WhatsApp.</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
