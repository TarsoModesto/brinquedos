import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ChevronDown,
  ListChecks,
  LogOut,
  Shield,
  User as UserIcon,
} from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/utils/cn';

/** Menu compacto do usuário logado: avatar + dropdown com ações. */
export function UserMenu() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent | KeyboardEvent) => {
      if (e instanceof KeyboardEvent && e.key !== 'Escape') return;
      if (
        e instanceof MouseEvent &&
        ref.current &&
        ref.current.contains(e.target as Node)
      ) {
        return;
      }
      setOpen(false);
    };
    document.addEventListener('mousedown', close);
    document.addEventListener('keydown', close);
    return () => {
      document.removeEventListener('mousedown', close);
      document.removeEventListener('keydown', close);
    };
  }, [open]);

  if (!user) return null;
  const isAdmin = user.role === 'admin';

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white py-1.5 pl-1.5 pr-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
      >
        <span
          className={cn(
            'flex h-7 w-7 items-center justify-center rounded-full text-xs font-black text-white',
            isAdmin ? 'bg-gradient-fun' : 'bg-brand-500'
          )}
          aria-hidden
        >
          {user.name.trim().charAt(0).toUpperCase() || '?'}
        </span>
        <span className="hidden max-w-[100px] truncate sm:inline">
          {user.name.split(' ')[0]}
        </span>
        <ChevronDown
          className={cn('h-4 w-4 transition-transform', open && 'rotate-180')}
          aria-hidden
        />
      </button>

      {open ? (
        <div
          role="menu"
          className="absolute right-0 top-full z-50 mt-2 w-60 origin-top-right animate-fade-in overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-soft dark:border-slate-700 dark:bg-slate-900"
        >
          <div className="border-b border-slate-100 px-4 py-3 dark:border-slate-800">
            <p className="truncate text-sm font-bold text-slate-900 dark:text-white">
              {user.name}
            </p>
            <p className="truncate text-xs text-slate-500 dark:text-slate-400">
              {user.email}
            </p>
            {isAdmin ? (
              <span className="mt-1.5 inline-flex items-center gap-1 rounded-full bg-gradient-fun px-2 py-0.5 text-[10px] font-black uppercase tracking-wide text-white">
                <Shield className="h-3 w-3" aria-hidden /> Admin
              </span>
            ) : null}
          </div>

          <div className="p-1.5">
            <MenuLink
              to="/minhas-reservas"
              icon={ListChecks}
              label="Minhas reservas"
              onClick={() => setOpen(false)}
            />
            {isAdmin ? (
              <MenuLink
                to="/admin"
                icon={Shield}
                label="Painel admin"
                onClick={() => setOpen(false)}
                accent
              />
            ) : null}
            <MenuLink
              to="/contato"
              icon={UserIcon}
              label="Contato"
              onClick={() => setOpen(false)}
            />
          </div>

          <div className="border-t border-slate-100 p-1.5 dark:border-slate-800">
            <button
              type="button"
              role="menuitem"
              onClick={async () => {
                setOpen(false);
                await logout();
                toast.success('Sessão encerrada.');
                navigate('/');
              }}
              className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm font-semibold text-slate-700 transition hover:bg-rose-50 hover:text-rose-700 dark:text-slate-200 dark:hover:bg-rose-950/40 dark:hover:text-rose-300"
            >
              <LogOut className="h-4 w-4" aria-hidden />
              Sair da conta
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

interface MenuLinkProps {
  to: string;
  icon: typeof ListChecks;
  label: string;
  onClick: () => void;
  accent?: boolean;
}

function MenuLink({ to, icon: Icon, label, onClick, accent }: MenuLinkProps) {
  return (
    <Link
      to={to}
      role="menuitem"
      onClick={onClick}
      className={cn(
        'flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition',
        accent
          ? 'text-brand-700 hover:bg-brand-50 dark:text-brand-300 dark:hover:bg-brand-900/30'
          : 'text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800'
      )}
    >
      <Icon className="h-4 w-4" aria-hidden />
      {label}
    </Link>
  );
}
