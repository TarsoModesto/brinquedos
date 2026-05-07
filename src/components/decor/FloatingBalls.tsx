/**
 * Bolinhas coloridas flutuando como saídas de uma piscina de bolinhas.
 * Distribuídas pelo viewport inteiro como decoração de fundo global.
 * Performance: SVG inline, animação CSS pura (sem JS), pointer-events:none.
 */

// Cores de bola de piscina real — azul, amarelo, verde-água, lima, lavanda, laranja-pêssego.
// Sem rosa: paleta leve para crianças.
const colors = [
  '#0ea5e9', // brand sky
  '#facc15', // accent yellow
  '#14b8a6', // support teal
  '#84cc16', // joy lime
  '#a78bfa', // magic lavender
  '#fb923c', // orange peach (calor pontual)
] as const;

interface Ball {
  size: number;
  left: string;
  delay: number;
  duration: number;
  color: string;
}

/** 22 bolinhas distribuídas pseudo-aleatoriamente. Determinístico entre renders. */
const balls: Ball[] = Array.from({ length: 22 }).map((_, i) => {
  const seed = i * 1.7;
  return {
    size: 12 + ((i * 11) % 32),
    left: `${(seed * 13.7) % 100}%`,
    delay: (i * 0.85) % 14,
    duration: 14 + ((i * 1.3) % 10),
    color: colors[i % colors.length],
  };
});

interface Props {
  /** Quando true, fica fixo na viewport. Default: true (decoração global). */
  fixed?: boolean;
  className?: string;
}

export function FloatingBalls({ fixed = true, className }: Props) {
  return (
    <div
      aria-hidden
      className={[
        'pointer-events-none overflow-hidden',
        fixed ? 'fixed inset-0 -z-10' : 'absolute inset-0',
        className ?? '',
      ].join(' ')}
    >
      {balls.map((b, i) => (
        <span
          key={i}
          className="absolute block rounded-full opacity-60 will-change-transform animate-ball-rise dark:opacity-40"
          style={{
            width: b.size,
            height: b.size,
            left: b.left,
            bottom: '-50px',
            background: `radial-gradient(circle at 30% 30%, ${b.color}ee, ${b.color} 65%, ${b.color}99)`,
            boxShadow: `0 0 12px ${b.color}55`,
            animationDelay: `${b.delay}s`,
            animationDuration: `${b.duration}s`,
          }}
        />
      ))}
    </div>
  );
}
