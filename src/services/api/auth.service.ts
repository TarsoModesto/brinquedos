import { apiClient } from './client';
import type { LoginInput, RegisterInput, User } from '@/types';

export const authService = {
  async register(input: RegisterInput): Promise<User> {
    const { data } = await apiClient.post<{ user: User }>('/auth/register', input);
    return data.user;
  },

  async login(input: LoginInput): Promise<User> {
    const { data } = await apiClient.post<{ user: User }>('/auth/login', input);
    return data.user;
  },

  async logout(): Promise<void> {
    await apiClient.post('/auth/logout');
  },

  async me(): Promise<User | null> {
    const { data } = await apiClient.get<{ user: User | null }>('/auth/me');
    return data.user;
  },
};
