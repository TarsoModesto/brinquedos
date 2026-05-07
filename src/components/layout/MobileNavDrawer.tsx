import { useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import {
  CalendarDays,
  Camera,
  Home,
  ListChecks,
  LogOut,
  MessageCircle,
  Moon,
  Shield,
  Sparkles,
  Sun,
  X,
} from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { useThemeStore } from '@/store/themeStore';
import { cn } from '@/utils/cn';

interface Props {
  open: boolean;
  onClose: () => void;
}

const items = [
  { to: '/', label: 'Início', icon: Home, end: true },
  { to: '/como-funciona', label: 'Como funciona', icon: Sparkles, end: false },
  { to: '/reservas', label: 'Reservas', icon: CalendarDays, end: false },
  { to: '/galeria', label: 'Galeria', icon: Camera, end: false },
  { to: '/contato', label: 'Contato', icon: MessageCircle, end: false },
] as const;

export function MobileNavDrawer({ open, onClose }: Props) {
  const { user, logout } = useAuth();
  const { theme, toggle } = useThemeStore();
  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] sm:hidden" role="dialog" aria-modal="true">
      <button
        type="button"
        aria-label="Fechar menu"
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
      />
      <div className="absolute inset-y-0 right-0 flex w-[85vw] max-w-sm animate-fade-in flex-col border-l border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-950">
        <header className="flex items-center justify-between border-b border-slate-100 px-5 py-4 dark:border-slate-800">
          <span className="font-display text-lg font-bold text-slate-900 dark:text-white">
            Menu
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar menu"
            className="rounded-full p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        <nav className="flex-1 overflow-y-auto p-3">
          <ul className="space-y-1">
            {items.map(({ to, label, icon: Icon, end }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  end={end}
                  onClick={onClose}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-3 rounded-2xl px-4 py-3 text-base font-semibold transition',
                      isActive
                        ? 'bg-gradient-fun text-white shadow-soft'
                        : 'text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800'
                    )
                  }
                >
                  <Icon className="h-5 w-5 shrink-0" aria-hidden />
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>

          {user ? (
            <>
              <div className="mt-6 border-t border-slate-100 pt-4 dark:border-slate-800">
                <p className="px-4 text-xs font-bold uppercase tracking-wider text-slate-400">
                  Sua conta
                </p>
                <ul className="mt-2 space-y-1">
                  <li>
                    <NavLink
                      to="/minhas-reservas"
                      onClick={onClose}
                      className={({ isActive }) =>
                        cn(
                          'flex items-center gap-3 rounded-2xl px-4 py-3 text-base font-semibold transition',
                          isActive
                            ? 'bg-brand-100 text-brand-800 dark:bg-brand-900/40 dark:text-brand-200'
                            : 'text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800'
                        )
                      }
                    >
                      <ListChecks className="h-5 w-5" aria-hidden />
                      Minhas reservas
                    </NavLink>
                  </li>
                  {isAdmin ? (
                    <li>
                      <NavLink
                        to="/admin"
                        onClick={onClose}
                        className={({ isActive }) =>
                          cn(
                            'flex items-center gap-3 rounded-2xl px-4 py-3 text-base font-semibold transition',
                            isActive
                              ? 'bg-gradient-fun text-white'
                              : 'text-amber-700 hover:bg-amber-50 dark:text-amber-300 dark:hover:bg-amber-900/30'
                          )
                        }
                      >
                        <Shield className="h-5 w-5" aria-hidden />
                        Painel admin
                      </NavLink>
                    </li>
                  ) : null}
                </ul>
              </div>
            </>
          ) : null}
        </nav>

        <footer className="space-y-2 border-t border-slate-100 p-3 dark:border-slate-800">
          <button
            type="button"
            onClick={toggle}
            className="flex w-full items-center justify-between rounded-2xl bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            <span className="flex items-center gap-2">
              {theme === 'dark' ? (
                <Sun className="h-5 w-5" aria-hidden />
              ) : (
                <Moon className="h-5 w-5" aria-hidden />
              )}
              {theme === 'dark' ? 'Modo claro' : 'Modo escuro'}
            </span>
          </button>

          {user ? (
            <button
              type="button"
              onClick={async () => {
                onClose();
                await logout();
                toast.success('Sessão encerrada.');
              }}
              className="flex w-full items-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold text-rose-700 transition hover:bg-rose-50 dark:text-rose-300 dark:hover:bg-rose-950/40"
            >
              <LogOut className="h-5 w-5" aria-hidden />
              Sair da conta
            </button>
          ) : (
            <Link
              to="/entrar"
              onClick={onClose}
              className="flex w-full items-center justify-center rounded-2xl bg-brand-500 px-4 py-3 text-sm font-bold text-white shadow-soft transition hover:bg-brand-600"
            >
              Entrar
            </Link>
          )}
        </footer>
      </div>
    </div>
  );
}
