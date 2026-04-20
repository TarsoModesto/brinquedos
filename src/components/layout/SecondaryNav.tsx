import { NavLink } from 'react-router-dom';
import {
  CalendarDays,
  Camera,
  Home,
  MessageCircle,
  Sparkles,
} from 'lucide-react';
import { cn } from '@/utils/cn';

const items = [
  { to: '/', label: 'Início', icon: Home, end: true },
  { to: '/como-funciona', label: 'Como funciona', icon: Sparkles },
  { to: '/reservas', label: 'Reservas', icon: CalendarDays },
  { to: '/galeria', label: 'Galeria', icon: Camera },
  { to: '/contato', label: 'Contato', icon: MessageCircle },
] as const;

export function SecondaryNav() {
  return (
    <nav
      className="relative z-[45] mx-auto -mt-5 flex max-w-3xl justify-center px-4 pb-1 sm:-mt-6"
      aria-label="Seções do site"
    >
      <div className="flex w-full flex-wrap items-center justify-center gap-1 rounded-full border border-slate-100 bg-white/95 p-2 shadow-nav backdrop-blur dark:border-slate-800 dark:bg-slate-900/95 sm:flex-nowrap sm:gap-0 sm:overflow-x-auto">
        {items.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              cn(
                'flex shrink-0 items-center gap-2 rounded-full px-3 py-2.5 text-sm font-medium transition-colors sm:px-4',
                isActive
                  ? 'bg-sky-100 text-slate-900 dark:bg-sky-900/50 dark:text-white'
                  : 'text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800'
              )
            }
          >
            <Icon className="h-4 w-4 shrink-0" aria-hidden />
            <span className="whitespace-nowrap">{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
