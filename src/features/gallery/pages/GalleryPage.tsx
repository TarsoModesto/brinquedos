import { GALLERY_IMAGES } from '@/constants/media';
import { Card } from '@/components/ui/Card';

export function GalleryPage() {
  return (
    <div className="space-y-8 animate-fade-in">
      <header className="text-center">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white sm:text-4xl">
          Momentos de pura diversão 🧡
        </h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">
          Veja a Carretinha Mini Parke em ação — cada foto é real, vinda das festas que
          já fizemos.
        </p>
      </header>

      <Card className="p-4 sm:p-8">
        {/*
          Masonry CSS columns — cada foto exibida na sua proporção natural
          (vertical/horizontal), sem cortes via object-cover.
        */}
        <div className="columns-1 gap-4 sm:columns-2 lg:columns-3 [&>*]:mb-4">
          {GALLERY_IMAGES.map(({ src, alt }) => (
            <figure
              key={src}
              className="group relative overflow-hidden rounded-3xl bg-slate-100 shadow-sm ring-1 ring-slate-100 break-inside-avoid dark:bg-slate-800 dark:ring-slate-700"
            >
              <img
                src={src}
                alt={alt}
                loading="lazy"
                className="block h-auto w-full transition duration-500 group-hover:scale-105"
              />
              <figcaption className="sr-only">{alt}</figcaption>
            </figure>
          ))}
        </div>
      </Card>
    </div>
  );
}
