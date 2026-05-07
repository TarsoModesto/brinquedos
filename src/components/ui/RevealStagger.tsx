import {
  Children,
  cloneElement,
  isValidElement,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react';
import { cn } from '@/utils/cn';

type Variant = 'up' | 'left' | 'right' | 'zoom';

interface RevealStaggerProps {
  children: ReactNode;
  /** Delay incremental entre filhos em ms. Default 100. */
  step?: number;
  /** Atraso inicial em ms. */
  initialDelay?: number;
  variant?: Variant;
  className?: string;
}

/**
 * Aplica reveal sequencial nos filhos imediatos. Cada filho recebe um
 * `transition-delay` incremental quando o container entra no viewport.
 */
export function RevealStagger({
  children,
  step = 100,
  initialDelay = 0,
  variant = 'up',
  className,
}: RevealStaggerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setShown(true);
            observer.disconnect();
          }
        });
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.05 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const hidden = `reveal-hidden-${variant}`;
  const showCls = `reveal-shown-${variant}`;

  const wrapped = Children.map(children, (child, i) => {
    if (!isValidElement(child)) return child;
    const childProps = child.props as { className?: string; style?: CSSProperties };
    const delay = initialDelay + i * step;
    return cloneElement(
      child as React.ReactElement<{ className?: string; style?: CSSProperties }>,
      {
        className: cn(childProps.className, shown ? showCls : hidden),
        style: {
          ...(childProps.style ?? {}),
          transitionDelay: shown ? `${delay}ms` : undefined,
        },
      }
    );
  });

  return (
    <div ref={ref} className={className}>
      {wrapped}
    </div>
  );
}
