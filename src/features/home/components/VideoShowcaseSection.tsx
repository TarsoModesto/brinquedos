import { useEffect, useRef, useState } from 'react';
import { Pause, Play, Volume2, VolumeX } from 'lucide-react';
import { RevealStagger } from '@/components/ui/RevealStagger';
import { cn } from '@/utils/cn';

interface VideoItem {
  src: string;
  poster: string;
  caption: string;
  hasAudio: boolean;
  ariaLabel: string;
}

const videos: readonly VideoItem[] = [
  {
    src: '/videos/carretinha-acao-1.mp4',
    poster: '/images/hero/principal.jpeg',
    caption: 'A Carretinha em ação',
    hasAudio: false,
    ariaLabel: 'Vídeo da Carretinha Mini Parke em uso',
  },
  {
    src: '/videos/carretinha-acao-2.mp4',
    poster: '/images/gallery/carretinha-dia.jpeg',
    caption: 'Diversão de pertinho',
    hasAudio: true,
    ariaLabel: 'Close da Carretinha Mini Parke em ação',
  },
  {
    src: '/videos/carretinha-acao-3.mp4',
    poster: '/images/gallery/crianca-brincando.jpeg',
    caption: 'Risadas garantidas',
    hasAudio: true,
    ariaLabel: 'Crianças se divertindo na Carretinha Mini Parke',
  },
];

export function VideoShowcaseSection() {
  return (
    <section className="space-y-10" id="em-acao">
      <header className="text-center">
        <span className="inline-block rounded-full bg-support-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-support-700 dark:bg-support-700/40 dark:text-support-200">
          Veja em ação
        </span>
        <h2 className="mt-3 font-display text-3xl font-black text-slate-900 dark:text-white sm:text-4xl">
          A magia <span className="gradient-text">acontecendo</span>
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-pretty text-slate-600 dark:text-slate-400">
          Toque em cada vídeo para ouvir. Quem aparece aqui é que diz o quanto vale.
        </p>
      </header>

      <RevealStagger
        className="mx-auto grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-3"
        step={150}
        variant="up"
      >
        {videos.map((v) => (
          <VideoCard key={v.src} video={v} />
        ))}
      </RevealStagger>
    </section>
  );
}

interface VideoCardProps {
  video: VideoItem;
}

function VideoCard({ video }: VideoCardProps) {
  const ref = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);
  const [playing, setPlaying] = useState(true);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    setReduceMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }, []);

  const toggleMute = () => {
    const node = ref.current;
    if (!node) return;
    node.muted = !node.muted;
    setMuted(node.muted);
  };

  const togglePlay = () => {
    const node = ref.current;
    if (!node) return;
    if (node.paused) {
      void node.play();
      setPlaying(true);
    } else {
      node.pause();
      setPlaying(false);
    }
  };

  return (
    <div className="group relative">
      <div
        className="absolute inset-0 -z-10 rounded-[2rem] bg-gradient-fun opacity-30 blur-2xl transition group-hover:opacity-50"
        aria-hidden
      />
      <figure className="relative overflow-hidden rounded-[2rem] border-4 border-white bg-slate-900 shadow-glow ring-1 ring-slate-200 dark:border-slate-800 dark:ring-slate-700">
        <video
          ref={ref}
          src={video.src}
          poster={video.poster}
          autoPlay={!reduceMotion}
          loop
          muted
          playsInline
          preload="metadata"
          controls={reduceMotion}
          aria-label={video.ariaLabel}
          className="aspect-[9/16] h-full w-full object-cover"
        />

        {!reduceMotion ? (
          <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 bg-gradient-to-t from-slate-900/80 via-slate-900/30 to-transparent p-3 sm:p-4">
            <p className="pointer-events-none text-sm font-bold text-white drop-shadow">
              {video.caption}
            </p>
            <div className="pointer-events-auto flex items-center gap-2">
              <button
                type="button"
                onClick={togglePlay}
                aria-label={playing ? 'Pausar vídeo' : 'Reproduzir vídeo'}
                className={cn(
                  'flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-slate-800 shadow-soft backdrop-blur transition hover:bg-white active:scale-95',
                  !playing && 'animate-pulse-soft'
                )}
              >
                {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </button>
              {video.hasAudio ? (
                <button
                  type="button"
                  onClick={toggleMute}
                  aria-label={muted ? 'Ativar som' : 'Desativar som'}
                  aria-pressed={!muted}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-slate-800 shadow-soft backdrop-blur transition hover:bg-white active:scale-95"
                >
                  {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                </button>
              ) : null}
            </div>
          </div>
        ) : null}
      </figure>
    </div>
  );
}
