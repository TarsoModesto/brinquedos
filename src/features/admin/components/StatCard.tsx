import type { LucideIcon } from 'lucide-react';
import { cn } from '@/utils/cn';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  accent?: 'brand' | 'emerald' | 'amber' | 'support' | 'violet';
  hint?: string;
}

const accents = {
  brand: 'from-brand-400 to-brand-600 text-white',
  emerald: 'from-emerald-400 to-emerald-600 text-white',
  amber: 'from-accent-400 to-orange-500 text-white',
  support: 'from-support-400 to-support-600 text-white',
  violet: 'from-magic-400 to-magic-600 text-white',
} as const;

export function StatCard({ label, value, icon: Icon, accent = 'brand', hint }: StatCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-3xl border border-slate-100 bg-white p-6 shadow-soft transition hover:-translate-y-0.5 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{label}</p>
          <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">{value}</p>
          {hint ? (
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{hint}</p>
          ) : null}
        </div>
        <span
          className={cn(
            'flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br shadow-soft',
            accents[accent]
          )}
        >
          <Icon className="h-6 w-6" aria-hidden />
        </span>
      </div>
    </div>
  );
}
