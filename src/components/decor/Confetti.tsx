/**
 * Confetes coloridos caindo (decorativos, posicionados absolutos no container).
 * Para usar dentro de uma seção `relative overflow-hidden`.
 */

// Mesma paleta das bolinhas, sem rosa.
const colors = ['#0ea5e9', '#facc15', '#14b8a6', '#84cc16', '#a78bfa', '#fb923c'];

interface Piece {
  size: number;
  left: string;
  delay: number;
  duration: number;
  color: string;
  shape: 'square' | 'circle' | 'triangle';
}

const pieces: Piece[] = Array.from({ length: 20 }).map((_, i) => ({
  size: 8 + ((i * 5) % 10),
  left: `${(i * 11) % 100}%`,
  delay: (i * 0.4) % 6,
  duration: 8 + ((i * 1.1) % 6),
  color: colors[i % colors.length],
  shape: (['square', 'circle', 'triangle'] as const)[i % 3],
}));

export function Confetti() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {pieces.map((p, i) => (
        <span
          key={i}
          className="absolute block animate-ball-rise opacity-70"
          style={{
            width: p.size,
            height: p.size,
            left: p.left,
            bottom: '-30px',
            background: p.shape === 'triangle' ? 'transparent' : p.color,
            borderRadius: p.shape === 'circle' ? '999px' : p.shape === 'square' ? '3px' : '0',
            transform: p.shape === 'square' ? 'rotate(20deg)' : undefined,
            borderLeft: p.shape === 'triangle' ? `${p.size / 2}px solid transparent` : undefined,
            borderRight: p.shape === 'triangle' ? `${p.size / 2}px solid transparent` : undefined,
            borderBottom: p.shape === 'triangle' ? `${p.size}px solid ${p.color}` : undefined,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
          }}
        />
      ))}
    </div>
  );
}
