import { Link } from 'react-router-dom';
import { Moon, Sun, Truck } from 'lucide-react';
import { SITE_NAME } from '@/constants/site';
import { useAuth } from '@/hooks/useAuth';
import { useThemeStore } from '@/store/themeStore';
import { UserMenu } from './UserMenu';

/**
 * Linha superior do site — fica dentro do wrapper sticky do MainLayout
 * (junto com SecondaryNav). Por isso não tem position/background próprio.
 */
export function Header() {
  const { theme, toggle } = useThemeStore();
  const { user } = useAuth();

  return (
    <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6 sm:py-4">
      <Link
        to="/"
        className="flex items-center gap-2.5 font-bold text-slate-900 dark:text-white"
        aria-label={`${SITE_NAME} — voltar à página inicial`}
      >
        <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-fun text-white shadow-soft">
          <Truck className="h-6 w-6" aria-hidden />
        </span>
        <span className="hidden font-display text-lg leading-none sm:inline">
          Carretinha
          <span className="block text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
            Mini Parke
          </span>
        </span>
      </Link>

      <div className="flex items-center gap-2 sm:gap-3">
        <button
          type="button"
          onClick={toggle}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800"
          aria-label={theme === 'dark' ? 'Ativar modo claro' : 'Ativar modo escuro'}
        >
          {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>

        {user ? (
          <UserMenu />
        ) : (
          <Link
            to="/entrar"
            className="inline-flex min-h-10 items-center justify-center rounded-full bg-brand-500 px-5 text-sm font-semibold text-white transition hover:bg-brand-600"
          >
            Entrar
          </Link>
        )}
      </div>
    </div>
  );
}
