import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  CalendarCheck,
  CalendarClock,
  CalendarDays,
  Sparkles,
  TrendingUp,
  Users,
} from 'lucide-react';
import {
  format,
  isFuture,
  isToday,
  parseISO,
  startOfMonth,
  endOfMonth,
  isWithinInterval,
} from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Card } from '@/components/ui/Card';
import { useBookingStore } from '@/store/bookingStore';
import { userService } from '@/services';
import type { User } from '@/types';
import { StatCard } from '../components/StatCard';

export function AdminDashboardPage() {
  const bookings = useBookingStore((s) => s.bookings);
  const fetchBookings = useBookingStore((s) => s.fetchBookings);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    void fetchBookings();
  }, [fetchBookings]);

  useEffect(() => {
    let active = true;
    void userService.list().then((list) => {
      if (active) setUsers(list);
    });
    return () => {
      active = false;
    };
  }, []);

  const stats = useMemo(() => {
    const now = new Date();
    const monthStart = startOfMonth(now);
    const monthEnd = endOfMonth(now);
    const inThisMonth = bookings.filter((b) =>
      isWithinInterval(parseISO(b.date), { start: monthStart, end: monthEnd })
    );
    const confirmed = bookings.filter((b) => b.status === 'confirmed').length;
    const pending = bookings.filter((b) => b.status === 'pending').length;
    const upcoming = bookings
      .filter((b) => b.status !== 'cancelled')
      .filter((b) => {
        const d = parseISO(b.date);
        return isToday(d) || isFuture(d);
      })
      .sort((a, b) => a.date.localeCompare(b.date));

    return {
      total: bookings.length,
      thisMonth: inThisMonth.length,
      confirmed,
      pending,
      upcoming,
    };
  }, [bookings]);

  const monthBars = useMemo(() => {
    const counts = new Map<string, number>();
    bookings.forEach((b) => {
      const key = b.date.slice(0, 7);
      counts.set(key, (counts.get(key) ?? 0) + 1);
    });
    const sorted = [...counts.entries()].sort((a, b) => a[0].localeCompare(b[0])).slice(-6);
    const max = Math.max(1, ...sorted.map(([, n]) => n));
    return sorted.map(([key, n]) => ({
      key,
      label: format(parseISO(`${key}-01`), 'MMM/yy', { locale: ptBR }),
      n,
      pct: Math.round((n / max) * 100),
    }));
  }, [bookings]);

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white sm:text-4xl">
            Dashboard
          </h1>
          <p className="mt-1 text-slate-600 dark:text-slate-400">
            Visão geral do Carretinha Mini Parke.
          </p>
        </div>
        <div className="rounded-full bg-gradient-to-r from-accent-100 to-brand-100 px-4 py-2 text-sm font-medium text-slate-700 dark:from-accent-700/40 dark:to-brand-900/40 dark:text-slate-200">
          <Sparkles className="mr-1 inline h-4 w-4" /> Painel administrativo
        </div>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Reservas no mês" value={stats.thisMonth} icon={CalendarDays} accent="brand" />
        <StatCard
          label="Confirmadas"
          value={stats.confirmed}
          icon={CalendarCheck}
          accent="emerald"
          hint="Total geral"
        />
        <StatCard
          label="Pendentes"
          value={stats.pending}
          icon={CalendarClock}
          accent="amber"
          hint="Aguardando ação"
        />
        <StatCard label="Usuários" value={users.length} icon={Users} accent="violet" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <div className="flex items-center gap-2 font-semibold text-slate-900 dark:text-white">
            <TrendingUp className="h-5 w-5 text-support-500" />
            Reservas por mês
          </div>
          {monthBars.length === 0 ? (
            <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">Sem dados ainda.</p>
          ) : (
            <div className="mt-10 flex items-end gap-3 sm:gap-5">
              {monthBars.map((m) => (
                <div key={m.key} className="flex flex-1 flex-col items-center gap-2">
                  <div
                    className="relative w-full overflow-hidden rounded-2xl bg-gradient-to-t from-brand-200 to-brand-500 dark:from-brand-900/40 dark:to-brand-400"
                    style={{ height: `${Math.max(12, m.pct * 1.6)}px` }}
                    title={`${m.n} reserva(s)`}
                  >
                    <span className="absolute inset-x-0 -top-6 text-center text-xs font-semibold text-slate-700 dark:text-slate-200">
                      {m.n}
                    </span>
                  </div>
                  <span className="text-xs font-medium uppercase text-slate-500 dark:text-slate-400">
                    {m.label}
                  </span>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <p className="font-semibold text-slate-900 dark:text-white">Próximas datas</p>
            <Link
              to="/admin/reservas"
              className="text-xs font-semibold text-brand-600 hover:underline dark:text-brand-300"
            >
              Ver todas
            </Link>
          </div>
          {stats.upcoming.length === 0 ? (
            <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
              Nenhuma reserva próxima.
            </p>
          ) : (
            <ul className="mt-4 space-y-2">
              {stats.upcoming.slice(0, 5).map((b) => (
                <li
                  key={b.id}
                  className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/70 px-3 py-2 text-sm dark:border-slate-800 dark:bg-slate-800/50"
                >
                  <span className="font-medium text-slate-700 dark:text-slate-200">
                    {format(parseISO(b.date), 'dd/MM')} — {b.name}
                  </span>
                  <span
                    className={
                      b.status === 'confirmed'
                        ? 'text-xs font-semibold text-emerald-700 dark:text-emerald-300'
                        : 'text-xs font-semibold text-amber-700 dark:text-amber-300'
                    }
                  >
                    {b.status === 'confirmed' ? 'Conf.' : 'Pend.'}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </div>
  );
}
