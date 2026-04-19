import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  format,
  isToday,
  parseISO,
  startOfMonth,
  subMonths,
} from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useMemo, useState } from 'react';
import type { Booking } from '@/types';
import { Button } from '@/components/ui/Button';
import { cn } from '@/utils/cn';
import { getDayVisual, type DayVisual } from '../utils/calendar';

const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

function visualClasses(v: DayVisual, selected: boolean) {
  const base =
    'relative flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400';
  if (selected) return cn(base, 'ring-2 ring-sky-500 ring-offset-2 dark:ring-offset-slate-950');
  if (v === 'confirmed') return cn(base, 'bg-red-100 text-red-800 dark:bg-red-950/50 dark:text-red-200');
  if (v === 'pending')
    return cn(base, 'bg-amber-100 text-amber-900 dark:bg-amber-950/40 dark:text-amber-100');
  return cn(base, 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200');
}

export interface BookingCalendarProps {
  bookings: Booking[];
  selectedDate: string | null;
  onSelectDate: (iso: string) => void;
}

export function BookingCalendar({ bookings, selectedDate, onSelectDate }: BookingCalendarProps) {
  const [cursor, setCursor] = useState(() => startOfMonth(new Date()));

  const { days, paddingStart } = useMemo(() => {
    const start = startOfMonth(cursor);
    const end = endOfMonth(cursor);
    const startWeekday = start.getDay();
    const daysInMonth = eachDayOfInterval({ start, end });
    return { days: daysInMonth, paddingStart: startWeekday };
  }, [cursor]);

  const title = format(cursor, "MMMM yyyy", { locale: ptBR });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="!px-2"
          onClick={() => setCursor(subMonths(cursor, 1))}
          aria-label="Mês anterior"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <p className="min-w-0 flex-1 text-center text-lg font-bold capitalize text-slate-900 dark:text-white">
          {title}
        </p>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="!px-2"
          onClick={() => setCursor(addMonths(cursor, 1))}
          aria-label="Próximo mês"
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-slate-500 dark:text-slate-400">
        {weekDays.map((d) => (
          <div key={d} className="py-2">
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: paddingStart }).map((_, i) => (
          <div key={`pad-${i}`} />
        ))}
        {days.map((day) => {
          const iso = format(day, 'yyyy-MM-dd');
          const v = getDayVisual(iso, bookings);
          const sel = selectedDate === iso;
          return (
            <button
              key={iso}
              type="button"
              onClick={() => onSelectDate(iso)}
              className={visualClasses(v, sel)}
            >
              {format(day, 'd')}
              {isToday(parseISO(iso)) ? (
                <span className="absolute bottom-1 h-1 w-1 rounded-full bg-sky-500" />
              ) : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}
