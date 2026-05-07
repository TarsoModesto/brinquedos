import { NavLink } from 'react-router-dom';
import {
  CalendarDays,
  Camera,
  Home,
  MessageCircle,
  Sparkles,
} from 'lucide-react';
import { cn } from '@/utils/cn';

interface NavItem {
  to: string;
  label: string;
  icon: typeof Home;
  end?: boolean;
}

const items: readonly NavItem[] = [
  { to: '/', label: 'Início', icon: Home, end: true },
  { to: '/como-funciona', label: 'Como funciona', icon: Sparkles },
  { to: '/reservas', label: 'Reservas', icon: CalendarDays },
  { to: '/galeria', label: 'Galeria', icon: Camera },
  { to: '/contato', label: 'Contato', icon: MessageCircle },
];

/**
 * Menu de páginas — barra horizontal compacta, fica dentro do wrapper
 * sticky do MainLayout (junto com o Header) para acompanhar o scroll.
 */
export function SecondaryNav() {
  return (
    <nav
      className="relative mx-auto flex max-w-3xl justify-center px-4 pb-2 sm:px-6"
      aria-label="Seções do site"
    >
      <div className="flex w-full flex-wrap items-center justify-center gap-1 rounded-full border border-slate-200/80 bg-white/95 p-1 shadow-nav backdrop-blur dark:border-slate-800 dark:bg-slate-900/95 sm:flex-nowrap sm:gap-0 sm:overflow-x-auto">
        {items.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              cn(
                'flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors sm:px-4 sm:py-2 sm:text-sm',
                isActive
                  ? 'bg-gradient-fun text-white shadow-soft'
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
