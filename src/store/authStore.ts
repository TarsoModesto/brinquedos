import { create } from 'zustand';
import type { User } from '@/types';
import { authService } from '@/services';

interface AuthState {
  user: User | null;
  initialized: boolean;
  init: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
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

  login: async (email, password) => {
    const user = await authService.login({ email, password });
    set({ user });
  },

  register: async (name, email, password) => {
    const user = await authService.register({ name, email, password });
    set({ user });
  },

  logout: async () => {
    await authService.logout();
    set({ user: null });
  },
}));
