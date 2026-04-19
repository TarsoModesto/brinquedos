import { zodResolver } from '@hookform/resolvers/zod';
import { X } from 'lucide-react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/hooks/useAuth';
import { useBookingStore } from '@/store/bookingStore';
import { getErrorMessage } from '@/utils/errors';
import { formatShortDate } from '@/utils/date';
import { bookingFormSchema, type BookingFormValues } from '../schemas/bookingFormSchema';

interface ReserveModalProps {
  open: boolean;
  dateIso: string | null;
  onClose: () => void;
}

export function ReserveModal({ open, dateIso, onClose }: ReserveModalProps) {
  const { user } = useAuth();
  const createBooking = useBookingStore((s) => s.createBooking);

  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: { name: '', phone: '', date: dateIso ?? '' },
  });

  useEffect(() => {
    if (dateIso) {
      form.setValue('date', dateIso);
      if (user?.name) form.setValue('name', user.name);
    }
  }, [dateIso, user?.name, form]);

  if (!open || !dateIso) return null;

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      await createBooking({
        name: values.name,
        phone: values.phone,
        date: values.date,
      });
      toast.success(`Reserva solicitada para ${formatShortDate(values.date)}!`);
      onClose();
      form.reset({ name: user?.name ?? '', phone: '', date: '' });
    } catch (e) {
      toast.error(getErrorMessage(e));
    }
  });

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center bg-slate-900/50 p-4 backdrop-blur-sm sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="reserve-title"
    >
      <Card className="relative w-full max-w-md animate-fade-in shadow-2xl">
        <button
          type="button"
          className="absolute right-4 top-4 rounded-full p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
          onClick={onClose}
          aria-label="Fechar"
        >
          <X className="h-5 w-5" />
        </button>
        <h2 id="reserve-title" className="text-xl font-bold text-slate-900 dark:text-white">
          Nova reserva
        </h2>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          Data selecionada: <strong>{formatShortDate(dateIso)}</strong>
        </p>
        <form className="mt-6 space-y-4" onSubmit={onSubmit}>
          <Input label="Nome" {...form.register('name')} error={form.formState.errors.name?.message} />
          <Input label="Telefone" placeholder="(11) 99999-9999" {...form.register('phone')} error={form.formState.errors.phone?.message} />
          <input type="hidden" {...form.register('date')} />
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" className="flex-1" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" variant="primary" className="flex-1" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? 'Enviando…' : 'Confirmar'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
