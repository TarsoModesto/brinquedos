import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import { Toaster } from 'sonner';
import { MainLayout } from '@/components/layout/MainLayout';
import { RouteLoader } from '@/components/ui/RouteLoader';
import { LoginPage } from '@/features/auth/pages/LoginPage';
import { RegisterPage } from '@/features/auth/pages/RegisterPage';
import { BookingPage } from '@/features/booking/pages/BookingPage';
import { MyBookingsPage } from '@/features/booking/pages/MyBookingsPage';
import { GalleryPage } from '@/features/gallery/pages/GalleryPage';
import { HomePage } from '@/features/home/pages/HomePage';
import { ContactPage } from '@/features/static/pages/ContactPage';
import { HowItWorksPage } from '@/features/static/pages/HowItWorksPage';
import { NotFoundPage } from '@/features/static/pages/NotFoundPage';
import { RequireAdmin, RequireAuth } from './guards';

// Admin é dividido em chunk próprio — visitantes não baixam esse JS.
const AdminLayout = lazy(() =>
  import('@/features/admin/components/AdminLayout').then((m) => ({ default: m.AdminLayout }))
);
const AdminDashboardPage = lazy(() =>
  import('@/features/admin/pages/AdminDashboardPage').then((m) => ({
    default: m.AdminDashboardPage,
  }))
);
const AdminBookingsPage = lazy(() =>
  import('@/features/admin/pages/AdminBookingsPage').then((m) => ({
    default: m.AdminBookingsPage,
  }))
);
const AdminUsersPage = lazy(() =>
  import('@/features/admin/pages/AdminUsersPage').then((m) => ({ default: m.AdminUsersPage }))
);

export default function App() {
  return (
    <>
      <Routes>
        <Route element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="reservas" element={<BookingPage />} />
          <Route path="galeria" element={<GalleryPage />} />
          <Route path="como-funciona" element={<HowItWorksPage />} />
          <Route path="contato" element={<ContactPage />} />
          <Route path="entrar" element={<LoginPage />} />
          <Route path="cadastro" element={<RegisterPage />} />
          <Route element={<RequireAuth />}>
            <Route path="minhas-reservas" element={<MyBookingsPage />} />
          </Route>
          <Route path="*" element={<NotFoundPage />} />
        </Route>
        <Route element={<RequireAdmin />}>
          <Route
            path="admin"
            element={
              <Suspense fallback={<RouteLoader />}>
                <AdminLayout />
              </Suspense>
            }
          >
            <Route
              index
              element={
                <Suspense fallback={<RouteLoader />}>
                  <AdminDashboardPage />
                </Suspense>
              }
            />
            <Route
              path="reservas"
              element={
                <Suspense fallback={<RouteLoader />}>
                  <AdminBookingsPage />
                </Suspense>
              }
            />
            <Route
              path="usuarios"
              element={
                <Suspense fallback={<RouteLoader />}>
                  <AdminUsersPage />
                </Suspense>
              }
            />
          </Route>
        </Route>
      </Routes>
      <Toaster richColors position="top-center" closeButton />
    </>
  );
}
