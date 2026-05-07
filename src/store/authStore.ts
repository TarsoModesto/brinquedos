import { create } from 'zustand';
import type { User } from '@/types';
import { authService } from '@/services';

interface AuthState {
  user: User | null;
  initialized: boolean;
  init: () => Promise<void>;
  refresh: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  /** Retorna true se a confirmação de e-mail é exigida (login não acontece automaticamente). */
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  initialized: false,

  init: async () => {
    try {
      const user = await authService.me();
      set({ user, initialized: true });
    } catch {
      set({ user: null, initialized: true });
    }
  },

  refresh: async () => {
    try {
      const user = await authService.me();
      set({ user });
    } catch {
      set({ user: null });
    }
  },

  login: async (email, password) => {
    const user = await authService.login({ email, password });
    set({ user });
  },

  register: async (name, email, password) => {
    const result = await authService.register({ name, email, password });
    if (result.user) set({ user: result.user });
    return result.needsEmailConfirmation;
  },

  logout: async () => {
    await authService.logout();
    set({ user: null });
  },
}));
