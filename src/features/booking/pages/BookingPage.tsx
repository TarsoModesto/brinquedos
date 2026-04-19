import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Card } from '@/components/ui/Card';
import { useAuth } from '@/hooks/useAuth';
import { useBookingStore } from '@/store/bookingStore';
import { BookingCalendar } from '../components/BookingCalendar';
import { BookingLegend } from '../components/BookingLegend';
import { ReserveModal } from '../components/ReserveModal';
import { UpcomingReservations } from '../components/UpcomingReservations';

export function BookingPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, initialized } = useAuth();
  const fetchBookings = useBookingStore((s) => s.fetchBookings);
  const bookings = useBookingStore((s) => s.bookings);
  const [selected, setSelected] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const preferredDate = (location.state as { preferredDate?: string } | null)?.preferredDate;

  useEffect(() => {
    void fetchBookings();
  }, [fetchBookings]);

  /** Após login com data preferida, abre o fluxo de reserva. */
  useEffect(() => {
    if (!user || !preferredDate) return;
    setSelected(preferredDate);
    setModalOpen(true);
    navigate(location.pathname, { replace: true, state: {} });
  }, [user, preferredDate, location.pathname, navigate]);

  return (
    <div className="space-y-10">
      <header className="text-center">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white sm:text-4xl">
          Calendário de reservas 🗓️
        </h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">
          Datas em vermelho já estão reservadas. Em amarelo, aguardando confirmação.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <BookingCalendar
            bookings={bookings}
            selectedDate={selected}
            onSelectDate={(iso) => {
              if (!user) {
                toast.info('Faça login para reservar esta data.');
                navigate('/entrar', { state: { from: '/reservas', preferredDate: iso } });
                return;
              }
              setSelected(iso);
              setModalOpen(true);
            }}
          />
          <BookingLegend />
        </Card>

        <div className="space-y-6 lg:col-span-2">
          <UpcomingReservations />

          <div className="rounded-3xl bg-gradient-to-br from-pink-400 via-orange-400 to-amber-400 p-[1px] shadow-soft">
            <div className="rounded-[calc(1.5rem-1px)] bg-white/95 p-8 dark:bg-slate-950/90">
              <p className="text-lg font-semibold text-slate-900 dark:text-white">
                Quer reservar uma data?
              </p>
              <p className="mt-2 text-slate-600 dark:text-slate-400">
                {user
                  ? 'Toque em um dia disponível (cinza) no calendário para solicitar a sua reserva.'
                  : 'Faça login para solicitar a sua reserva.'}
              </p>
              {!user && initialized ? (
                <Link
                  to="/entrar"
                  state={{ from: '/reservas' }}
                  className="mt-6 inline-flex min-h-12 items-center justify-center rounded-full bg-sky-400 px-8 font-semibold text-white shadow transition hover:bg-sky-500"
                >
                  Entrar ou criar conta
                </Link>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      <ReserveModal
        open={modalOpen && !!user && !!selected}
        dateIso={selected}
        onClose={() => {
          setModalOpen(false);
          setSelected(null);
        }}
      />
    </div>
  );
}
