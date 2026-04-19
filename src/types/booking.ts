/** Status exibido no calendário: vermelho / amarelo / neutro (disponível). */
export type BookingStatus = 'pending' | 'confirmed' | 'cancelled';

export interface Booking {
  id: string;
  name: string;
  phone: string;
  date: string;
  status: BookingStatus;
  createdAt: string;
}

export interface CreateBookingInput {
  name: string;
  phone: string;
  date: string;
}
