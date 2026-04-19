import { format, parseISO, isValid } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export function formatDatePt(isoDate: string): string {
  try {
    const d = parseISO(isoDate);
    if (!isValid(d)) return isoDate;
    return format(d, "d 'de' MMMM 'de' yyyy", { locale: ptBR });
  } catch {
    return isoDate;
  }
}

export function formatShortDate(isoDate: string): string {
  try {
    const d = parseISO(isoDate);
    if (!isValid(d)) return isoDate;
    return format(d, 'dd/MM/yyyy');
  } catch {
    return isoDate;
  }
}
