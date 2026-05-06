import { useEffect, useMemo, useState } from 'react';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Check, Search, Trash2, X as XIcon } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { useBookingStore } from '@/store/bookingStore';
import type { BookingStatus } from '@/types';
import { cn } from '@/utils/cn';
import { getErrorMessage } from '@/utils/errors';

const statusFilters: ReadonlyArray<{ value: 'all' | BookingStatus; label: string }> = [
  { value: 'all', label: 'Todas' },
  { value: 'pending', label: 'Pendentes' },
  { value: 'confirmed', label: 'Confirmadas' },
  { value: 'cancelled', label: 'Canceladas' },
];

function badgeClass(s: BookingStatus) {
  if (s === 'confirmed')
    return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200';
  if (s === 'pending')
    return 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200';
  return 'bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-200';
}

function statusLabel(s: BookingStatus) {
  if (s === 'confirmed') return 'Confirmada';
  if (s === 'pending') return 'Pendente';
  return 'Cancelada';
}

export function AdminBookingsPage() {
  const bookings = useBookingStore((s) => s.bookings);
  const fetchBookings = useBookingStore((s) => s.fetchBookings);
  const updateStatus = useBookingStore((s) => s.updateStatus);
  const removeBooking = useBookingStore((s) => s.removeBooking);

  const [filter, setFilter] = useState<'all' | BookingStatus>('all');
  const [query, setQuery] = useState('');

  useEffect(() => {
    void fetchBookings();
  }, [fetchBookings]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return bookings
      .filter((b) => (filter === 'all' ? true : b.status === filter))
      .filter((b) => {
        if (!q) return true;
        return (
          b.name.toLowerCase().includes(q) ||
          b.phone.toLowerCase().includes(q) ||
          b.date.includes(q)
        );
      })
      .sort((a, b) => b.date.localeCompare(a.date));
  }, [bookings, filter, query]);

  const handle = async (op: () => Promise<unknown>, ok: string) => {
    try {
      await op();
      toast.success(ok);
    } catch (e) {
      toast.error(getErrorMessage(e));
    }
  };

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white sm:text-4xl">
          Reservas
        </h1>
        <p className="mt-1 text-slate-600 dark:text-slate-400">
          Aprove, recuse ou exclua solicitações.
        </p>
      </header>

      <Card>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-2">
            {statusFilters.map((f) => (
              <button
                key={f.value}
                type="button"
                onClick={() => setFilter(f.value)}
                className={cn(
                  'rounded-full px-4 py-2 text-sm font-semibold transition',
                  filter === f.value
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200'
                )}
              >
                {f.label}
              </button>
            ))}
          </div>
          <div className="relative max-w-xs flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              className="pl-10"
              placeholder="Buscar por nome, telefone ou data"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </div>
      </Card>

      {filtered.length === 0 ? (
        <Card className="text-center text-slate-500 dark:text-slate-400">
          Nenhuma reserva encontrada com os filtros atuais.
        </Card>
      ) : (
        <Card className="overflow-x-auto p-0">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500 dark:bg-slate-800/60 dark:text-slate-400">
              <tr>
                <th className="px-5 py-3">Data</th>
                <th className="px-5 py-3">Cliente</th>
                <th className="px-5 py-3">Telefone</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filtered.map((b) => (
                <tr key={b.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                  <td className="px-5 py-4 font-semibold text-slate-900 dark:text-white">
                    {format(parseISO(b.date), 'dd/MM/yyyy')}
                    <p className="text-xs font-normal text-slate-500 dark:text-slate-400">
                      {format(parseISO(b.date), 'EEEE', { locale: ptBR })}
                    </p>
                  </td>
                  <td className="px-5 py-4 text-slate-700 dark:text-slate-200">{b.name}</td>
                  <td className="px-5 py-4 text-slate-600 dark:text-slate-300">{b.phone}</td>
                  <td className="px-5 py-4">
                    <span
                      className={cn(
                        'inline-flex rounded-full px-3 py-1 text-xs font-semibold',
                        badgeClass(b.status)
                      )}
                    >
                      {statusLabel(b.status)}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-2">
                      {b.status !== 'confirmed' ? (
                        <Button
                          size="sm"
                          variant="primary"
                          onClick={() =>
                            handle(() => updateStatus(b.id, 'confirmed'), 'Reserva confirmada.')
                          }
                          aria-label="Confirmar"
                        >
                          <Check className="h-4 w-4" />
                          Confirmar
                        </Button>
                      ) : null}
                      {b.status !== 'cancelled' ? (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            handle(() => updateStatus(b.id, 'cancelled'), 'Reserva cancelada.')
                          }
                          aria-label="Cancelar"
                        >
                          <XIcon className="h-4 w-4" />
                          Cancelar
                        </Button>
                      ) : null}
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          if (
                            window.confirm(
                              `Excluir definitivamente a reserva de ${b.name} em ${format(parseISO(b.date), 'dd/MM/yyyy')}?`
                            )
                          ) {
                            void handle(() => removeBooking(b.id), 'Reserva excluída.');
                          }
                        }}
                        aria-label="Excluir"
                      >
                        <Trash2 className="h-4 w-4 text-rose-500" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  );
}
