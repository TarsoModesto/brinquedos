import { Navigate, Route, Routes } from 'react-router-dom';
import { Toaster } from 'sonner';
import { MainLayout } from '@/components/layout/MainLayout';
import { LoginPage } from '@/features/auth/pages/LoginPage';
import { RegisterPage } from '@/features/auth/pages/RegisterPage';
import { BookingPage } from '@/features/booking/pages/BookingPage';
import { GalleryPage } from '@/features/gallery/pages/GalleryPage';
import { HomePage } from '@/features/home/pages/HomePage';
import { ContactPage } from '@/features/static/pages/ContactPage';
import { HowItWorksPage } from '@/features/static/pages/HowItWorksPage';

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
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
      <Toaster richColors position="top-center" closeButton />
    </>
  );
}
