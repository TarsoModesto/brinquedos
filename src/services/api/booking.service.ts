import { apiClient } from './client';
import type { Booking, BookingStatus, CreateBookingInput } from '@/types';

export const bookingService = {
  async list(): Promise<Booking[]> {
    const { data } = await apiClient.get<Booking[]>('/bookings');
    return data;
  },

  async create(input: CreateBookingInput): Promise<Booking> {
    const { data } = await apiClient.post<Booking>('/bookings', input);
    return data;
  },

  async updateStatus(id: string, status: BookingStatus): Promise<Booking> {
    const { data } = await apiClient.patch<Booking>(`/bookings/${id}`, { status });
    return data;
  },
};
