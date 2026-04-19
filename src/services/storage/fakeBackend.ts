import type { Booking, BookingStatus, CreateBookingInput } from '@/types';
import type { RegisterInput, User } from '@/types';
import { createId } from '@/utils/id';
import { STORAGE_KEYS } from './keys';

interface StoredUser extends User {
  password: string;
}

function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJson(key: string, value: unknown) {
  localStorage.setItem(key, JSON.stringify(value));
}

/** Dados iniciais para demonstração do calendário (abril/2026). */
function seedIfNeeded() {
  if (localStorage.getItem(STORAGE_KEYS.seeded)) return;

  const now = new Date().toISOString();
  const sample: Booking[] = [
    {
      id: createId(),
      name: 'Maria Silva',
      phone: '(11) 98888-0001',
      date: '2026-04-05',
      status: 'confirmed',
      createdAt: now,
    },
    {
      id: createId(),
      name: 'João Santos',
      phone: '(11) 97777-0002',
      date: '2026-04-12',
      status: 'pending',
      createdAt: now,
    },
    {
      id: createId(),
      name: 'Ana Costa',
      phone: '(11) 96666-0003',
      date: '2026-04-17',
      status: 'confirmed',
      createdAt: now,
    },
    {
      id: createId(),
      name: 'Pedro Lima',
      phone: '(11) 95555-0004',
      date: '2026-04-24',
      status: 'pending',
      createdAt: now,
    },
  ];

  writeJson(STORAGE_KEYS.bookings, sample);
  localStorage.setItem(STORAGE_KEYS.seeded, '1');
}

export const fakeBackend = {
  init() {
    seedIfNeeded();
  },

  getUsers(): StoredUser[] {
    return readJson<StoredUser[]>(STORAGE_KEYS.users, []);
  },

  saveUsers(users: StoredUser[]) {
    writeJson(STORAGE_KEYS.users, users);
  },

  register(input: RegisterInput): User {
    const users = this.getUsers();
    if (users.some((u) => u.email.toLowerCase() === input.email.toLowerCase())) {
      throw new Error('Este e-mail já está cadastrado.');
    }
    const user: StoredUser = {
      id: createId(),
      name: input.name.trim(),
      email: input.email.trim().toLowerCase(),
      password: input.password,
    };
    users.push(user);
    this.saveUsers(users);
    this.setSession(user.id);
    const { password: _, ...publicUser } = user;
    return publicUser;
  },

  login(email: string, password: string): User {
    const user = this.getUsers().find(
      (u) => u.email === email.toLowerCase() && u.password === password
    );
    if (!user) throw new Error('E-mail ou senha inválidos.');
    const { password: _, ...publicUser } = user;
    return publicUser;
  },

  setSession(userId: string | null) {
    if (userId) localStorage.setItem(STORAGE_KEYS.session, userId);
    else localStorage.removeItem(STORAGE_KEYS.session);
  },

  getSessionUserId(): string | null {
    return localStorage.getItem(STORAGE_KEYS.session);
  },

  getUserById(id: string): User | null {
    const u = this.getUsers().find((x) => x.id === id);
    if (!u) return null;
    const { password: _, ...publicUser } = u;
    return publicUser;
  },

  getBookings(): Booking[] {
    return readJson<Booking[]>(STORAGE_KEYS.bookings, []);
  },

  saveBookings(bookings: Booking[]) {
    writeJson(STORAGE_KEYS.bookings, bookings);
  },

  createBooking(input: CreateBookingInput, status: BookingStatus = 'pending'): Booking {
    const bookings = this.getBookings();
    const clash = bookings.some(
      (b) => b.date === input.date && b.status !== 'cancelled'
    );
    if (clash) {
      throw new Error('Esta data já possui uma reserva ativa.');
    }
    const booking: Booking = {
      id: createId(),
      name: input.name.trim(),
      phone: input.phone.trim(),
      date: input.date,
      status,
      createdAt: new Date().toISOString(),
    };
    bookings.push(booking);
    this.saveBookings(bookings);
    return booking;
  },

  updateBookingStatus(id: string, status: BookingStatus): Booking {
    const bookings = this.getBookings();
    const idx = bookings.findIndex((b) => b.id === id);
    if (idx === -1) throw new Error('Reserva não encontrada.');
    bookings[idx] = { ...bookings[idx], status };
    this.saveBookings(bookings);
    return bookings[idx];
  },
};
