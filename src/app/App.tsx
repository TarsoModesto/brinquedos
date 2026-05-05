import { Navigate, Route, Routes } from 'react-router-dom';
import { Toaster } from 'sonner';
import { MainLayout } from '@/components/layout/MainLayout';
import { LoginPage } from '@/pages/LoginPage';
import { AdminPage } from '@/pages/AdminPage';
import { BookingPage } from '@/pages/BookingPage';
import { HomePage } from '@/features/home/pages/HomePage';

export default function App() {
  return (
    <>
      <Routes>
        <Route element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="agendar" element={<BookingPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="admin" element={<AdminPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
      <Toaster richColors position="top-center" closeButton />
    </>
  );
}
