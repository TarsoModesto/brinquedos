import { useEffect, useState, type ReactNode } from 'react';
import { useLocation } from 'react-router-dom';

interface Props {
  children: ReactNode;
}

/**
 * Faz fade+lift sutil quando a rota muda. Não bloqueia conteúdo nem
 * remonta o subtree (depende do React Router cuidar disso); só anima
 * a entrada da nova página.
 */
export function PageTransition({ children }: Props) {
  const { pathname } = useLocation();
  const [stage, setStage] = useState<'enter' | 'shown'>('shown');

  useEffect(() => {
    setStage('enter');
    const id = window.setTimeout(() => setStage('shown'), 16);
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
    return () => window.clearTimeout(id);
  }, [pathname]);

  return (
    <div
      key={pathname}
      className={
        stage === 'enter'
          ? 'opacity-0 translate-y-3 transition-none'
          : 'opacity-100 translate-y-0 transition-[opacity,transform] duration-500 ease-out'
      }
    >
      {children}
    </div>
  );
}
