import { useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';

export function RequireAuth() {
  const { user, initialized } = useAuth();
  const location = useLocation();

  if (!initialized) return <FullPageLoader />;
  if (!user) {
    return <Navigate to="/entrar" replace state={{ from: location.pathname }} />;
  }
  return <Outlet />;
}

export function RequireAdmin() {
  const { user, initialized } = useAuth();

  useEffect(() => {
    if (initialized && user && user.role !== 'admin') {
      toast.error('Área restrita ao administrador.');
    }
  }, [initialized, user]);

  if (!initialized) return <FullPageLoader />;
  if (!user) return <Navigate to="/entrar" replace state={{ from: '/admin' }} />;
  if (user.role !== 'admin') return <Navigate to="/" replace />;
  return <Outlet />;
}

function FullPageLoader() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-200 border-t-brand-500" />
    </div>
  );
}
