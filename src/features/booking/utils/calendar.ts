import type { Booking } from '@/types';

/** Cor do dia no calendário conforme regras de negócio. */
export type DayVisual = 'confirmed' | 'pending' | 'free';

export function getDayVisual(isoDay: string, bookings: Booking[]): DayVisual {
  const active = bookings.filter((b) => b.date === isoDay && b.status !== 'cancelled');
  if (active.some((b) => b.status === 'confirmed')) return 'confirmed';
  if (active.some((b) => b.status === 'pending')) return 'pending';
  return 'free';
}
