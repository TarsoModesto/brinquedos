import { useCallback, useEffect, useMemo, useRef, useState, type KeyboardEvent } from 'react';
import { ChevronLeft, ChevronRight, ImageOff } from 'lucide-react';
import { cn } from '@/utils/cn';

type CarouselImage = {
  src: string;
  alt: string;
};

interface ImageCarouselProps {
  images: readonly CarouselImage[];
  className?: string;
  autoPlayMs?: number;
}

const LOOP_COPIES = 3;
const LOOP_THRESHOLD_PX = 80;

export function ImageCarousel({
  images,
  className,
  autoPlayMs = 4500,
}: ImageCarouselProps) {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const isAdjustingLoopRef = useRef(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [failedSources, setFailedSources] = useState<Record<string, true>>({});
  const [isPaused, setIsPaused] = useState(false);

  const totalImages = images.length;
  const hasManyImages = totalImages > 1;

  const displayImages = useMemo(
    () =>
      Array.from({ length: LOOP_COPIES }, (_, copyIndex) =>
        images.map((image, baseIndex) => ({
          image,
          baseIndex,
          key: `${copyIndex}-${baseIndex}-${image.src}`,
        }))
      ).flat(),
    [images]
  );

  const getCardStep = useCallback(() => {
    const track = trackRef.current;
    if (!track || track.children.length === 0) {
      return 0;
    }

    const firstCard = track.children[0] as HTMLElement;
    const gap = Number.parseFloat(window.getComputedStyle(track).gap || '0');
    return firstCard.offsetWidth + gap;
  }, []);

  const scrollByCard = useCallback(
    (direction: 'left' | 'right') => {
      const track = trackRef.current;
      if (!track) {
        return;
      }

      const step = getCardStep();
      if (!step) {
        return;
      }

      track.scrollBy({
        left: direction === 'left' ? -step : step,
        behavior: 'smooth',
      });
    },
    [getCardStep]
  );

  useEffect(() => {
    if (!hasManyImages || isPaused) {
      return;
    }

    const timer = window.setInterval(() => {
      scrollByCard('right');
    }, autoPlayMs);

    return () => window.clearInterval(timer);
  }, [autoPlayMs, hasManyImages, isPaused, scrollByCard]);

  useEffect(() => {
    if (activeIndex > totalImages - 1 && totalImages > 0) {
      setActiveIndex(0);
    }
  }, [activeIndex, totalImages]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track || !hasManyImages) {
      return;
    }

    const rafId = window.requestAnimationFrame(() => {
      const segment = track.scrollWidth / LOOP_COPIES;
      if (segment > 0) {
        track.scrollLeft = segment;
      }
    });

    return () => window.cancelAnimationFrame(rafId);
  }, [displayImages.length, hasManyImages]);

  const goTo = useCallback(
    (index: number) => {
      if (totalImages === 0) {
        return;
      }

      const normalized = (index + totalImages) % totalImages;
      setActiveIndex(normalized);

      const track = trackRef.current;
      if (!track) {
        return;
      }

      const targetChildIndex = totalImages + normalized;
      const targetCard = track.children[targetChildIndex] as HTMLElement | undefined;
      if (!targetCard) {
        return;
      }

      targetCard.scrollIntoView({
        behavior: 'smooth',
        inline: 'start',
        block: 'nearest',
      });
    },
    [totalImages]
  );

  const goNext = useCallback(() => {
    setActiveIndex((current) => (current + 1) % totalImages);
    scrollByCard('right');
  }, [scrollByCard, totalImages]);

  const goPrevious = useCallback(() => {
    setActiveIndex((current) => (current - 1 + totalImages) % totalImages);
    scrollByCard('left');
  }, [scrollByCard, totalImages]);

  const handleImageError = useCallback((source: string) => {
    setFailedSources((current) => {
      if (current[source]) {
        return current;
      }

      return { ...current, [source]: true };
    });
  }, []);

  if (totalImages === 0) {
    return null;
  }

  const handleKeyNavigation = (event: KeyboardEvent<HTMLElement>) => {
    if (!hasManyImages) {
      return;
    }

    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      goPrevious();
      return;
    }

    if (event.key === 'ArrowRight') {
      event.preventDefault();
      goNext();
    }
  };

  const handleTrackScroll = () => {
    const track = trackRef.current;
    if (!track || track.children.length === 0) {
      return;
    }

    const step = getCardStep();
    if (!step) {
      return;
    }

    if (hasManyImages && !isAdjustingLoopRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = track;
      const segment = scrollWidth / LOOP_COPIES;

      if (segment > 0) {
        const nearStart = scrollLeft <= LOOP_THRESHOLD_PX;
        const nearEnd = scrollLeft >= 2 * segment - clientWidth - LOOP_THRESHOLD_PX;

        if (nearStart || nearEnd) {
          isAdjustingLoopRef.current = true;
          track.scrollLeft = nearStart ? scrollLeft + segment : scrollLeft - segment;
          window.requestAnimationFrame(() => {
            isAdjustingLoopRef.current = false;
          });
        }
      }
    }

    const absoluteIndex = Math.round(track.scrollLeft / step);
    const normalized = ((absoluteIndex % totalImages) + totalImages) % totalImages;
    setActiveIndex(normalized);
  };

  return (
    <div
      className={cn('space-y-4', className)}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocusCapture={() => setIsPaused(true)}
      onBlurCapture={() => setIsPaused(false)}
    >
      <div
        className="relative rounded-[2rem] border border-slate-200/80 bg-white/85 p-3 shadow-[0_20px_45px_-28px_rgba(15,23,42,0.5)] backdrop-blur-sm dark:border-slate-700 dark:bg-slate-900/80 sm:p-4"
        onKeyDown={handleKeyNavigation}
        tabIndex={0}
        aria-label="Carrossel de imagens da carretinha"
      >
        {hasManyImages ? (
          <button
            type="button"
            onClick={goPrevious}
            className="absolute left-4 top-1/2 z-20 hidden -translate-y-1/2 rounded-full border border-white/60 bg-white/90 p-2 text-slate-800 shadow-md transition hover:scale-105 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 dark:border-slate-700 dark:bg-slate-900/90 dark:text-slate-100 dark:hover:bg-slate-900 sm:inline-flex"
            aria-label="Imagem anterior"
          >
            <ChevronLeft className="h-4 w-4" aria-hidden />
          </button>
        ) : null}

        {hasManyImages ? (
          <button
            type="button"
            onClick={goNext}
            className="absolute right-4 top-1/2 z-20 hidden -translate-y-1/2 rounded-full border border-white/60 bg-white/90 p-2 text-slate-800 shadow-md transition hover:scale-105 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 dark:border-slate-700 dark:bg-slate-900/90 dark:text-slate-100 dark:hover:bg-slate-900 sm:inline-flex"
            aria-label="Próxima imagem"
          >
            <ChevronRight className="h-4 w-4" aria-hidden />
          </button>
        ) : null}

        <div
          ref={trackRef}
          onScroll={handleTrackScroll}
          className="-mx-1 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-1 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {displayImages.map(({ image, baseIndex, key }) => {
            const isActive = baseIndex === activeIndex;
            const showFallback = Boolean(failedSources[image.src]);

            return (
              <button
                key={key}
                type="button"
                onClick={() => goTo(baseIndex)}
                className={cn(
                  'group relative w-[min(78vw,340px)] shrink-0 snap-start overflow-hidden rounded-[1.65rem] border text-left shadow-[0_18px_45px_-30px_rgba(15,23,42,0.45)] transition duration-300 sm:w-[340px] lg:w-[380px] xl:w-[420px]',
                  isActive
                    ? 'scale-[1.01] border-brand-400/70 ring-2 ring-brand-400/40'
                    : 'border-slate-200/70 hover:-translate-y-0.5 hover:border-slate-300 dark:border-slate-700 dark:hover:border-slate-500'
                )}
                aria-label={`Abrir foto ${baseIndex + 1}`}
                aria-current={isActive}
              >
                <div className="relative aspect-[4/5] bg-slate-100 dark:bg-slate-900 sm:aspect-[3/4]">
                  {showFallback ? (
                    <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-gradient-to-br from-brand-100 to-sky-50 text-slate-600 dark:from-brand-900/40 dark:to-slate-900 dark:text-slate-300">
                      <ImageOff className="h-10 w-10" aria-hidden />
                      <p className="px-4 text-center text-sm font-semibold">
                        Não foi possível carregar esta foto.
                      </p>
                    </div>
                  ) : (
                    <img
                      src={image.src}
                      alt={image.alt}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      onError={() => handleImageError(image.src)}
                    />
                  )}
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/35 via-transparent to-transparent" />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {hasManyImages ? (
        <div className="flex items-center justify-center gap-2">
          {images.map((image, index) => (
            <button
              key={image.src}
              type="button"
              onClick={() => goTo(index)}
              className={cn(
                'h-2.5 w-2.5 rounded-full transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400',
                index === activeIndex
                  ? 'w-6 bg-brand-500'
                  : 'bg-slate-300 hover:bg-slate-400 dark:bg-slate-700 dark:hover:bg-slate-500'
              )}
              aria-label={`Ir para foto ${index + 1}`}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
