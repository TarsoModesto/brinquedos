import { useEffect, useState } from 'react';

const colors = ['#0ea5e9', '#facc15', '#14b8a6', '#84cc16', '#a78bfa', '#fb923c'];

interface Piece {
  id: number;
  size: number;
  x: number;
  hueIndex: number;
  rotate: number;
  duration: number;
  drift: number;
}

interface Props {
  /** Quando muda de false → true, dispara um burst. */
  trigger: boolean;
  /** Quantidade de pedaços. Default 60. */
  count?: number;
}

let nextId = 0;

/**
 * Burst de confetes que cai do topo da viewport por ~2.5s.
 * Disparado por mudança no prop `trigger`. Auto-limpa após terminar.
 */
export function ConfettiBurst({ trigger, count = 60 }: Props) {
  const [pieces, setPieces] = useState<Piece[]>([]);

  useEffect(() => {
    if (!trigger) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;

    const next: Piece[] = Array.from({ length: count }).map((_, i) => ({
      id: ++nextId,
      size: 6 + Math.random() * 10,
      x: Math.random() * 100,
      hueIndex: i % colors.length,
      rotate: Math.random() * 360,
      duration: 2 + Math.random() * 1.5,
      drift: (Math.random() - 0.5) * 200,
    }));
    setPieces(next);
    const timer = window.setTimeout(() => setPieces([]), 4000);
    return () => window.clearTimeout(timer);
  }, [trigger, count]);

  if (pieces.length === 0) return null;

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden"
    >
      {pieces.map((p) => (
        <span
          key={p.id}
          className="absolute block"
          style={{
            top: '-30px',
            left: `${p.x}%`,
            width: p.size,
            height: p.size,
            background: colors[p.hueIndex],
            borderRadius: p.id % 3 === 0 ? '999px' : '2px',
            transform: `rotate(${p.rotate}deg)`,
            animation: `confettiFall ${p.duration}s ease-in forwards`,
            ['--drift' as never]: `${p.drift}px`,
          }}
        />
      ))}
      <style>{`
        @keyframes confettiFall {
          to {
            transform: translate3d(var(--drift, 0px), 110vh, 0) rotate(720deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
