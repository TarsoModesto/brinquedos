import { Link } from 'react-router-dom';
import { Heart, Instagram, Mail, Phone, Truck } from 'lucide-react';
import { SITE_NAME, WHATSAPP_DISPLAY, WHATSAPP_URL } from '@/constants/site';

export function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-100 bg-white/60 backdrop-blur dark:border-slate-800 dark:bg-slate-950/40">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:grid-cols-2 sm:px-6 lg:grid-cols-4">
        <div className="space-y-3">
          <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-400 to-amber-400 text-white shadow-soft">
              <Truck className="h-5 w-5" aria-hidden />
            </span>
            <span className="font-display text-lg">{SITE_NAME}</span>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Diversão móvel para festas, aniversários e eventos especiais. A alegria chega até você.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-bold uppercase tracking-wide text-slate-900 dark:text-white">
            Site
          </h3>
          <ul className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-400">
            <li><Link to="/" className="hover:text-sky-600">Início</Link></li>
            <li><Link to="/reservas" className="hover:text-sky-600">Reservas</Link></li>
            <li><Link to="/galeria" className="hover:text-sky-600">Galeria</Link></li>
            <li><Link to="/como-funciona" className="hover:text-sky-600">Como funciona</Link></li>
            <li><Link to="/contato" className="hover:text-sky-600">Contato</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-bold uppercase tracking-wide text-slate-900 dark:text-white">
            Contato
          </h3>
          <ul className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-400">
            <li>
              <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 hover:text-emerald-600">
                <Phone className="h-4 w-4" /> {WHATSAPP_DISPLAY}
              </a>
            </li>
            <li className="inline-flex items-center gap-2">
              <Mail className="h-4 w-4" /> contato@carretardaalegria.com.br
            </li>
            <li>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 hover:text-pink-600">
                <Instagram className="h-4 w-4" /> @carretardaalegria
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-bold uppercase tracking-wide text-slate-900 dark:text-white">
            Reserve já
          </h3>
          <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
            Garanta a sua data antes que ocupem!
          </p>
          <Link
            to="/reservas"
            className="mt-4 inline-flex min-h-10 items-center justify-center rounded-full bg-gradient-to-r from-pink-500 to-orange-400 px-5 text-sm font-semibold text-white shadow-soft hover:opacity-90"
          >
            Ver calendário
          </Link>
        </div>
      </div>

      <div className="border-t border-slate-100 py-5 text-center text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400">
        © {new Date().getFullYear()} {SITE_NAME} — Feito com{' '}
        <Heart className="inline h-3 w-3 fill-rose-500 text-rose-500" /> para alegrar a sua festa.
      </div>
    </footer>
  );
}
