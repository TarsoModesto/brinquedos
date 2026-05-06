import { Navigate, Route, Routes } from 'react-router-dom';
import { Toaster } from 'sonner';
import { MainLayout } from '@/components/layout/MainLayout';
import { AdminLayout } from '@/features/admin/components/AdminLayout';
import { AdminBookingsPage } from '@/features/admin/pages/AdminBookingsPage';
import { AdminDashboardPage } from '@/features/admin/pages/AdminDashboardPage';
import { AdminUsersPage } from '@/features/admin/pages/AdminUsersPage';
import { LoginPage } from '@/features/auth/pages/LoginPage';
import { RegisterPage } from '@/features/auth/pages/RegisterPage';
import { BookingPage } from '@/features/booking/pages/BookingPage';
import { MyBookingsPage } from '@/features/booking/pages/MyBookingsPage';
import { GalleryPage } from '@/features/gallery/pages/GalleryPage';
import { HomePage } from '@/features/home/pages/HomePage';
import { ContactPage } from '@/features/static/pages/ContactPage';
import { HowItWorksPage } from '@/features/static/pages/HowItWorksPage';
import { RequireAdmin, RequireAuth } from './guards';

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
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
        <Route element={<RequireAdmin />}>
          <Route path="admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboardPage />} />
            <Route path="reservas" element={<AdminBookingsPage />} />
            <Route path="usuarios" element={<AdminUsersPage />} />
          </Route>
        </Route>
      </Routes>
      <Toaster richColors position="top-center" closeButton />
    </>
  );
}
