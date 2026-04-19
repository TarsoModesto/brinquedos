import { create } from 'zustand';
import type { Booking, BookingStatus, CreateBookingInput } from '@/types';
import { bookingService } from '@/services';

interface BookingState {
  bookings: Booking[];
  loading: boolean;
  fetchBookings: () => Promise<void>;
  createBooking: (input: CreateBookingInput) => Promise<Booking>;
  updateStatus: (id: string, status: BookingStatus) => Promise<Booking>;
}

export const useBookingStore = create<BookingState>((set, get) => ({
  bookings: [],
  loading: false,

  fetchBookings: async () => {
    set({ loading: true });
    try {
      const bookings = await bookingService.list();
      set({ bookings });
    } finally {
      set({ loading: false });
    }
  },

  createBooking: async (input) => {
    const booking = await bookingService.create(input);
    set({ bookings: [...get().bookings, booking] });
    return booking;
  },

  updateStatus: async (id, status) => {
    const updated = await bookingService.updateStatus(id, status);
    set({
      bookings: get().bookings.map((b) => (b.id === id ? updated : b)),
    });
    return updated;
  },
}));
