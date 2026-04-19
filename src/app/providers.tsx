import { useEffect, type ReactNode } from 'react';
import { useAuthStore } from '@/store/authStore';

export function Providers({ children }: { children: ReactNode }) {
  const init = useAuthStore((s) => s.init);

  useEffect(() => {
    void init();
  }, [init]);

  return <>{children}</>;
}
