import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Theme = 'light' | 'dark';

function applyClass(theme: Theme) {
  const root = document.documentElement;
  if (theme === 'dark') root.classList.add('dark');
  else root.classList.remove('dark');
}

export const useThemeStore = create<{
  theme: Theme;
  toggle: () => void;
  setTheme: (t: Theme) => void;
}>()(
  persist(
    (set, get) => ({
      theme: 'light',
      toggle: () => {
        const next: Theme = get().theme === 'light' ? 'dark' : 'light';
        applyClass(next);
        set({ theme: next });
      },
      setTheme: (t) => {
        applyClass(t);
        set({ theme: t });
      },
    }),
    {
      name: 'cda-theme',
      partialize: (s) => ({ theme: s.theme }),
      onRehydrateStorage: () => (state) => {
        if (state) applyClass(state.theme);
      },
    }
  )
);
