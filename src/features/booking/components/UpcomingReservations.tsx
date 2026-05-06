import { format, isFuture, isToday, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ListChecks } from 'lucide-react';
import { useMemo } from 'react';
import type { Booking, BookingStatus } from '@/types';
import { Card } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import { useAuth } from '@/hooks/useAuth';
import { useBookingStore } from '@/store/bookingStore';
import { getErrorMessage } from '@/utils/errors';
import { toast } from 'sonner';
import { cn } from '@/utils/cn';

function statusLabel(s: BookingStatus) {
  if (s === 'confirmed') return 'Confirmada';
  if (s === 'pending') return 'Pendente';
  return 'Cancelada';
}

function statusBadgeClass(s: BookingStatus) {
  if (s === 'confirmed')
    return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200';
  if (s === 'pending')
    return 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200';
  return 'bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-200';
}

export function UpcomingReservations() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const bookings = useBookingStore((s) => s.bookings);
  const loading = useBookingStore((s) => s.loading);
  const updateStatus = useBookingStore((s) => s.updateStatus);

  const upcoming = useMemo<Booking[]>(() => {
    return bookings
      .filter((b) => b.status !== 'cancelled')
      .filter((b) => {
        const d = parseISO(b.date);
        return isToday(d) || isFuture(d);
      })
      .sort((a, b) => a.date.localeCompare(b.date));
  }, [bookings]);

  if (loading) {
    return (
      <Card className="space-y-4">
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-8 rounded-lg" />
          <Skeleton className="h-6 w-40" />
        </div>
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-full" />
      </Card>
    );
  }

  return (
    <Card>
      <div className="mb-4 flex items-center gap-2 font-semibold text-slate-900 dark:text-white">
        <ListChecks className="h-5 w-5 text-sky-500" aria-hidden />
        Próximas reservas
      </div>
      {upcoming.length === 0 ? (
        <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
          Nenhuma reserva próxima. As datas estão livres! 🚀
        </p>
      ) : (
        <ul className="space-y-3">
          {upcoming.map((b) => (
            <li
              key={b.id}
              className="flex flex-col gap-2 rounded-2xl border border-slate-100 bg-slate-50/80 p-4 dark:border-slate-800 dark:bg-slate-800/50 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="font-medium text-slate-900 dark:text-white">
                  {isAdmin ? b.name : 'Reservado'}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {format(parseISO(b.date), "EEEE, d 'de' MMMM", { locale: ptBR })}
                </p>
                {isAdmin ? (
                  <p className="text-sm text-slate-600 dark:text-slate-300">{b.phone}</p>
                ) : null}
              </div>
              <div className="flex flex-col items-stretch gap-2 sm:items-end">
                <span
                  className={cn(
                    'inline-flex w-fit self-end rounded-full px-3 py-1 text-xs font-semibold',
                    statusBadgeClass(b.status)
                  )}
                >
                  {statusLabel(b.status)}
                </span>
                {isAdmin ? (
                  <select
                    className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-900"
                    value={b.status}
                    onChange={async (ev) => {
                      try {
                        await updateStatus(b.id, ev.target.value as BookingStatus);
                        toast.success('Status atualizado.');
                      } catch (e) {
                        toast.error(getErrorMessage(e));
                      }
                    }}
                    aria-label={`Alterar status da reserva de ${b.name}`}
                  >
                    <option value="pending">Pendente</option>
                    <option value="confirmed">Confirmada</option>
                    <option value="cancelled">Cancelada</option>
                  </select>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
