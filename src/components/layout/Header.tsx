import { Link, NavLink } from 'react-router-dom';
import { CalendarDays, LogOut, Moon, Sun, Truck } from 'lucide-react';
import { SITE_NAME } from '@/constants/site';
import { useAuth } from '@/hooks/useAuth';
import { useThemeStore } from '@/store/themeStore';
import { cn } from '@/utils/cn';
import { toast } from 'sonner';

export function Header() {
  const { theme, toggle } = useThemeStore();
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 overflow-visible border-b border-slate-100/80 bg-white/90 backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/90">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
            <Truck className="h-6 w-6" aria-hidden />
          </span>
          <span className="hidden text-lg sm:inline">{SITE_NAME}</span>
        </Link>

        <div className="flex items-center gap-2 sm:gap-3">
          <NavLink
            to="/reservas"
            className={({ isActive }) =>
              cn(
                'hidden items-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:text-sky-600 sm:flex dark:text-slate-300',
                isActive && 'bg-sky-50 text-sky-700 dark:bg-sky-950/50 dark:text-sky-300'
              )
            }
          >
            <CalendarDays className="h-4 w-4" />
            Reservas
          </NavLink>

          <button
            type="button"
            onClick={toggle}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800"
            aria-label={theme === 'dark' ? 'Modo claro' : 'Modo escuro'}
          >
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>

          {user ? (
            <div className="flex items-center gap-2">
              <span className="hidden max-w-[140px] truncate text-sm font-medium text-slate-700 dark:text-slate-200 sm:inline">
                Olá, {user.name.split(' ')[0]}
              </span>
              <button
                type="button"
                onClick={async () => {
                  await logout();
                  toast.success('Sessão encerrada.');
                }}
                className="inline-flex min-h-10 items-center justify-center gap-1.5 rounded-full border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Sair</span>
              </button>
            </div>
          ) : (
            <Link
              to="/entrar"
              className="inline-flex min-h-10 items-center justify-center rounded-full bg-sky-100 px-5 text-sm font-semibold text-sky-900 transition hover:bg-sky-200 dark:bg-sky-900/40 dark:text-sky-100 dark:hover:bg-sky-800/50"
            >
              Entrar
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
