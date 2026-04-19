import { GALLERY_IMAGES } from '@/constants/media';
import { Card } from '@/components/ui/Card';

export function GalleryPage() {
  return (
    <div className="space-y-8 animate-fade-in">
      <header className="text-center">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white sm:text-4xl">
          Momentos de alegria 🧡
        </h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">Veja a magia do nosso carretar em ação!</p>
      </header>

      <Card className="p-4 sm:p-8">
        <div className="grid gap-6 sm:grid-cols-2">
          {GALLERY_IMAGES.map(({ src, alt }) => (
            <figure
              key={src}
              className="group overflow-hidden rounded-3xl bg-slate-100 shadow-sm ring-1 ring-slate-100 dark:bg-slate-800 dark:ring-slate-700"
            >
              <img
                src={src}
                alt={alt}
                className="aspect-[4/3] w-full object-cover transition duration-500 group-hover:scale-105"
                loading="lazy"
              />
              <figcaption className="sr-only">{alt}</figcaption>
            </figure>
          ))}
        </div>
      </Card>
    </div>
  );
}
