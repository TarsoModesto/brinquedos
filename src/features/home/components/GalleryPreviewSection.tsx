import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { GALLERY_IMAGES } from '@/constants/media';
import { ImageCarousel } from '@/components/ui/ImageCarousel';

export function GalleryPreviewSection() {
  // Mostra até 6 fotos no preview; '/galeria' tem todas.
  const images = GALLERY_IMAGES.slice(0, 6);

  return (
    <section className="space-y-6 sm:space-y-7">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="inline-block rounded-full bg-brand-100 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-brand-700 dark:bg-brand-900/40 dark:text-brand-200">
            Galeria
          </span>
          <h2 className="mt-3 font-display text-[clamp(1.8rem,4vw,2.6rem)] font-black text-slate-900 dark:text-white">
            Veja a Carretinha de perto
          </h2>
        </div>
        <Link
          to="/galeria"
          className="inline-flex items-center gap-1.5 rounded-full border border-slate-200/80 bg-white/95 px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:bg-white hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 dark:border-slate-700 dark:bg-slate-900/90 dark:text-slate-200 dark:hover:bg-slate-900"
        >
          Ver tudo ({GALLERY_IMAGES.length}) <ArrowRight className="h-4 w-4" aria-hidden />
        </Link>
      </header>

      <ImageCarousel images={images} className="mx-auto max-w-[min(100%,1120px)]" />
    </section>
  );
}
