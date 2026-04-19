import axios, { AxiosError, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios';
import type { Booking, BookingStatus, CreateBookingInput } from '@/types';
import type { LoginInput, RegisterInput, User } from '@/types';
import { fakeBackend } from '@/services/storage/fakeBackend';

const LATENCY_MS = 280;

function delay() {
  return new Promise((r) => setTimeout(r, LATENCY_MS));
}

function ok<T>(data: T, config: InternalAxiosRequestConfig): AxiosResponse<T> {
  return {
    data,
    status: 200,
    statusText: 'OK',
    headers: {},
    config,
  };
}

function rejectAxios(message: string, config: InternalAxiosRequestConfig): Promise<never> {
  const err = new AxiosError(message, 'ERR_BAD_REQUEST', config, undefined, {
    data: { message },
    status: 400,
    statusText: 'Bad Request',
    headers: {},
    config,
  } as AxiosResponse);
  return Promise.reject(err);
}

/**
 * Cliente Axios com adapter local — substitua por `baseURL` + rotas reais depois.
 */
export const apiClient = axios.create({
  adapter: async (config) => {
    await delay();
    fakeBackend.init();

    const method = (config.method || 'get').toLowerCase();
    const url = String(config.url || '').replace(/^\/+/, '');
    const body = config.data
      ? typeof config.data === 'string'
        ? JSON.parse(config.data)
        : config.data
      : undefined;

    try {
      if (url === 'auth/register' && method === 'post') {
        const u = fakeBackend.register(body as RegisterInput);
        return ok({ user: u }, config);
      }
      if (url === 'auth/login' && method === 'post') {
        const { email, password } = body as LoginInput;
        const u = fakeBackend.login(email, password);
        fakeBackend.setSession(u.id);
        return ok({ user: u }, config);
      }
      if (url === 'auth/logout' && method === 'post') {
        fakeBackend.setSession(null);
        return ok({ ok: true }, config);
      }
      if (url === 'auth/me' && method === 'get') {
        const id = fakeBackend.getSessionUserId();
        if (!id) return ok<{ user: User | null }>({ user: null }, config);
        const user = fakeBackend.getUserById(id);
        return ok({ user }, config);
      }
      if (url === 'bookings' && method === 'get') {
        return ok<Booking[]>(fakeBackend.getBookings(), config);
      }
      if (url === 'bookings' && method === 'post') {
        const b = fakeBackend.createBooking(body as CreateBookingInput);
        return ok<Booking>(b, config);
      }
      if (url.startsWith('bookings/') && method === 'patch') {
        const id = url.replace('bookings/', '');
        const { status } = body as { status: BookingStatus };
        const b = fakeBackend.updateBookingStatus(id, status);
        return ok<Booking>(b, config);
      }
      return rejectAxios(`Rota não implementada: ${method} ${url}`, config);
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Erro desconhecido';
      return rejectAxios(msg, config);
    }
  },
});
