import { useEffect, useState } from 'react';

interface ScrollState {
  direction: 'up' | 'down';
  atTop: boolean;
}

/**
 * Detecta direção do scroll com throttle por requestAnimationFrame.
 * Aplica threshold de 8px pra evitar flicker em micro-movimentos.
 */
export function useScrollDirection(threshold = 8): ScrollState {
  const [state, setState] = useState<ScrollState>({ direction: 'up', atTop: true });

  useEffect(() => {
    let lastY = window.scrollY;
    let ticking = false;

    const update = () => {
      const y = window.scrollY;
      const atTop = y < 24;
      const delta = y - lastY;

      if (Math.abs(delta) >= threshold) {
        setState({ direction: delta > 0 ? 'down' : 'up', atTop });
        lastY = y;
      } else if (atTop !== state.atTop) {
        setState((s) => ({ ...s, atTop }));
      }
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
    // intencional: não dependemos de state aqui (lemos via setState callback)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [threshold]);

  return state;
}
