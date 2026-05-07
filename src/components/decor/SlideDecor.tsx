/**
 * Ilustração SVG inline de um escorregador estilizado.
 * Cores leves alinhadas à paleta "céu de dia": azul, amarelo, verde, lavanda.
 */

interface Props {
  className?: string;
}

export function SlideDecor({ className }: Props) {
  return (
    <svg
      className={className}
      viewBox="0 0 200 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <defs>
        <linearGradient id="slideGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#0ea5e9" />
          <stop offset="50%" stopColor="#facc15" />
          <stop offset="100%" stopColor="#14b8a6" />
        </linearGradient>
      </defs>
      {/* Plataforma */}
      <rect x="20" y="40" width="50" height="14" rx="4" fill="#a78bfa" />
      {/* Coluna */}
      <rect x="38" y="54" width="14" height="80" rx="4" fill="#84cc16" />
      {/* Escorregador (curva) */}
      <path
        d="M 70 50 Q 130 80 170 130 L 170 145 Q 125 100 70 70 Z"
        fill="url(#slideGrad)"
      />
      {/* Bolinhas embaixo (cores variadas, sem rosa) */}
      <circle cx="60" cy="142" r="6" fill="#facc15" />
      <circle cx="80" cy="148" r="5" fill="#0ea5e9" />
      <circle cx="100" cy="144" r="6" fill="#14b8a6" />
      <circle cx="120" cy="148" r="5" fill="#84cc16" />
      <circle cx="140" cy="144" r="6" fill="#a78bfa" />
      <circle cx="160" cy="148" r="5" fill="#fb923c" />
      {/* Estrelinhas no topo */}
      <path d="M 30 22 l 2 5 l 5 1 l -4 4 l 1 5 l -4 -3 l -4 3 l 1 -5 l -4 -4 l 5 -1 z" fill="#facc15" />
      <path d="M 165 30 l 1.5 4 l 4 1 l -3 3 l 0.5 4 l -3 -2 l -3 2 l 0.5 -4 l -3 -3 l 4 -1 z" fill="#0ea5e9" />
    </svg>
  );
}
