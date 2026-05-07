import { useEffect, useRef, useState, type ReactNode } from 'react';
import { cn } from '@/utils/cn';

type Variant = 'up' | 'left' | 'right' | 'zoom';

interface RevealProps {
  children: ReactNode;
  /** Atraso em ms para escalonar revelações sequenciais. */
  delay?: number;
  /** Direção da entrada. Default: 'up'. */
  variant?: Variant;
  className?: string;
  as?: 'div' | 'section' | 'article' | 'li';
}

/**
 * Anima a entrada de um bloco quando ele entra no viewport.
 * Usa transition (não keyframes) para sentir mais fluido — o estado
 * "hidden" e "shown" são CSS classes; a transição é declarada na .shown.
 *
 * Respeita `prefers-reduced-motion` (CSS global cuida de neutralizar).
 */
export function Reveal({
  children,
  delay = 0,
  variant = 'up',
  className,
  as = 'div',
}: RevealProps) {
  const ref = useRef<HTMLElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setShown(true);
            observer.disconnect();
          }
        });
      },
      // dispara um pouco antes da seção entrar de fato — sensação mais fluida
      { rootMargin: '0px 0px -8% 0px', threshold: 0.05 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const Tag = as;
  const hidden = `reveal-hidden-${variant}`;
  const showCls = `reveal-shown-${variant}`;

  return (
    <Tag
      ref={ref as never}
      style={shown ? { transitionDelay: `${delay}ms` } : undefined}
      className={cn(shown ? showCls : hidden, className)}
    >
      {children}
    </Tag>
  );
}
