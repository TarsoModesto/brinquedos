import { useEffect, type ReactNode } from 'react';
import { supabase } from '@/services/supabase/client';
import { useAuthStore } from '@/store/authStore';

export function Providers({ children }: { children: ReactNode }) {
  const init = useAuthStore((s) => s.init);
  const refresh = useAuthStore((s) => s.refresh);

  useEffect(() => {
    void init();
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        void refresh();
      } else {
        useAuthStore.setState({ user: null });
      }
    });
    return () => {
      data.subscription.unsubscribe();
    };
  }, [init, refresh]);

  return <>{children}</>;
}
