import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, Moon, Sun, Truck } from 'lucide-react';
import { SITE_NAME } from '@/constants/site';
import { useAuth } from '@/hooks/useAuth';
import { useScrollDirection } from '@/hooks/useScrollDirection';
import { useThemeStore } from '@/store/themeStore';
import { cn } from '@/utils/cn';
import { MobileNavDrawer } from './MobileNavDrawer';
import { UserMenu } from './UserMenu';

const navItems = [
  { to: '/', label: 'Início', end: true },
  { to: '/como-funciona', label: 'Como funciona', end: false },
  { to: '/reservas', label: 'Reservas', end: false },
  { to: '/galeria', label: 'Galeria', end: false },
  { to: '/contato', label: 'Contato', end: false },
] as const;

/**
 * Barra superior única e fina (~56px mobile, ~64px desktop).
 * Comportamento: visível no topo + ao rolar pra cima; some ao rolar pra baixo.
 * Mobile: hamburguer abre drawer lateral.
 */
export function Topbar() {
  const { user } = useAuth();
  const { theme, toggle } = useThemeStore();
  const { direction, atTop } = useScrollDirection();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const hidden = direction === 'down' && !atTop && !drawerOpen;

  return (
    <>
      <header
        className={cn(
          'sticky top-0 z-40 border-b backdrop-blur-md transition-transform duration-300',
          atTop
            ? 'border-transparent bg-white/70 dark:bg-slate-950/70'
            : 'border-slate-200/80 bg-white/90 shadow-nav dark:border-slate-800 dark:bg-slate-950/90',
          hidden ? '-translate-y-full' : 'translate-y-0'
        )}
      >
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4 sm:h-16 sm:px-6">
          <Link
            to="/"
            className="flex shrink-0 items-center gap-2 font-bold text-slate-900 dark:text-white"
            aria-label={`${SITE_NAME} — voltar à página inicial`}
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-fun text-white shadow-soft">
              <Truck className="h-5 w-5" aria-hidden />
            </span>
            <span className="hidden font-display text-base font-bold leading-none sm:flex sm:flex-col">
              <span className="text-slate-900 dark:text-white">Carretinha</span>
              <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-brand-600 dark:text-brand-400">
                Mini Parke
              </span>
            </span>
          </Link>

          <nav
            className="hidden flex-1 items-center justify-center gap-1 sm:flex"
            aria-label="Seções do site"
          >
            {navItems.map(({ to, label, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  cn(
                    'relative rounded-full px-3 py-1.5 text-sm font-semibold transition-colors',
                    isActive
                      ? 'text-brand-700 dark:text-brand-300'
                      : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    {label}
                    {isActive ? (
                      <span
                        aria-hidden
                        className="absolute -bottom-0.5 left-1/2 h-0.5 w-6 -translate-x-1/2 rounded-full bg-gradient-fun"
                      />
                    ) : null}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={toggle}
              className="hidden h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50 sm:flex dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800"
              aria-label={theme === 'dark' ? 'Ativar modo claro' : 'Ativar modo escuro'}
            >
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>

            {user ? (
              <UserMenu />
            ) : (
              <Link
                to="/entrar"
                className="hidden h-9 items-center justify-center rounded-full bg-brand-500 px-4 text-sm font-semibold text-white transition hover:bg-brand-600 sm:inline-flex"
              >
                Entrar
              </Link>
            )}

            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              aria-label="Abrir menu"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-50 sm:hidden dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
            >
              <Menu className="h-5 w-5" aria-hidden />
            </button>
          </div>
        </div>
      </header>

      <MobileNavDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  );
}
