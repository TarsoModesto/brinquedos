import { useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { CalendarDays, Trash2 } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { toast } from 'sonner';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import { useAuth } from '@/hooks/useAuth';
import { useBookingStore } from '@/store/bookingStore';
import type { BookingStatus } from '@/types';
import { cn } from '@/utils/cn';
import { getErrorMessage } from '@/utils/errors';

function statusLabel(s: BookingStatus) {
  if (s === 'confirmed') return 'Confirmada';
  if (s === 'pending') return 'Aguardando confirmação';
  return 'Cancelada';
}

function statusBadgeClass(s: BookingStatus) {
  if (s === 'confirmed')
    return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200';
  if (s === 'pending')
    return 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200';
  return 'bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-200';
}

export function MyBookingsPage() {
  const { user } = useAuth();
  const bookings = useBookingStore((s) => s.bookings);
  const loading = useBookingStore((s) => s.loading);
  const fetchBookings = useBookingStore((s) => s.fetchBookings);
  const updateStatus = useBookingStore((s) => s.updateStatus);

  useEffect(() => {
    void fetchBookings();
  }, [fetchBookings]);

  const mine = useMemo(() => {
    if (!user) return [];
    return bookings
      .filter((b) => b.userId === user.id)
      .sort((a, b) => b.date.localeCompare(a.date));
  }, [bookings, user]);

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white sm:text-4xl">
          Minhas reservas
        </h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">
          Acompanhe o status das suas solicitações de reserva.
        </p>
      </header>

      {loading ? (
        <Card className="space-y-3">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </Card>
      ) : mine.length === 0 ? (
        <Card className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand-100 dark:bg-brand-900/40">
            <CalendarDays className="h-8 w-8 text-brand-600 dark:text-brand-300" />
          </div>
          <h2 className="mt-4 text-xl font-semibold text-slate-900 dark:text-white">
            Nenhuma reserva ainda
          </h2>
          <p className="mt-2 text-slate-600 dark:text-slate-400">
            Que tal escolher uma data no calendário para a sua festa?
          </p>
          <Link to="/reservas" className="mt-6 inline-block">
            <Button variant="primary" size="lg">
              <CalendarDays className="h-5 w-5" />
              Ver datas disponíveis
            </Button>
          </Link>
        </Card>
      ) : (
        <ul className="space-y-3">
          {mine.map((b) => (
            <li
              key={b.id}
              className="flex flex-col gap-3 rounded-3xl border border-slate-100 bg-white p-5 shadow-soft dark:border-slate-800 dark:bg-slate-900 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="text-lg font-semibold text-slate-900 dark:text-white">
                  {format(parseISO(b.date), "d 'de' MMMM 'de' yyyy", { locale: ptBR })}
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Solicitada em {format(parseISO(b.createdAt), "dd/MM/yyyy 'às' HH:mm")}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className={cn(
                    'inline-flex rounded-full px-3 py-1 text-xs font-semibold',
                    statusBadgeClass(b.status)
                  )}
                >
                  {statusLabel(b.status)}
                </span>
                {b.status === 'pending' ? (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={async () => {
                      try {
                        await updateStatus(b.id, 'cancelled');
                        toast.success('Reserva cancelada.');
                      } catch (e) {
                        toast.error(getErrorMessage(e));
                      }
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                    Cancelar
                  </Button>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
