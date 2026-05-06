import { Link } from 'react-router-dom';
import { ArrowRight, Camera } from 'lucide-react';
import { GALLERY_IMAGES } from '@/constants/media';

export function GalleryPreviewSection() {
  return (
    <section className="space-y-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="inline-block rounded-full bg-pink-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-pink-700 dark:bg-pink-900/40 dark:text-pink-200">
            Galeria
          </span>
          <h2 className="mt-3 font-display text-3xl font-black text-slate-900 dark:text-white sm:text-4xl">
            Momentos que criamos juntos
          </h2>
        </div>
        <Link
          to="/galeria"
          className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-5 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
        >
          Ver tudo <ArrowRight className="h-4 w-4" />
        </Link>
      </header>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4 md:grid-rows-2">
        {GALLERY_IMAGES.map((img, i) => (
          <figure
            key={img.src}
            className={`group relative overflow-hidden rounded-3xl shadow-soft ring-1 ring-slate-100 dark:ring-slate-800 ${
              i === 0 ? 'col-span-2 row-span-2' : ''
            }`}
          >
            <img
              src={img.src}
              alt={img.alt}
              loading="lazy"
              className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-slate-900/20 to-transparent opacity-0 transition group-hover:opacity-100" />
            <span className="absolute bottom-3 left-3 inline-flex items-center gap-1 rounded-full bg-white/95 px-3 py-1 text-xs font-bold text-slate-900 opacity-0 transition group-hover:opacity-100">
              <Camera className="h-3 w-3" />
              Festa #{i + 1}
            </span>
          </figure>
        ))}
      </div>
    </section>
  );
}
