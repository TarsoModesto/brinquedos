import { Link } from 'react-router-dom';
import { Compass, Home } from 'lucide-react';

export function NotFoundPage() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center text-center animate-fade-in">
      <span className="flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-fun text-white shadow-glow">
        <Compass className="h-10 w-10" aria-hidden />
      </span>
      <h1 className="mt-6 font-display text-5xl font-black text-slate-900 dark:text-white sm:text-6xl">
        404
      </h1>
      <p className="mt-2 font-display text-2xl font-bold text-slate-700 dark:text-slate-200">
        Página não encontrada
      </p>
      <p className="mt-3 text-pretty text-slate-600 dark:text-slate-400">
        O caminho que você procura saiu da rota — mas a Carretinha não para! Volte para o
        início e siga a diversão.
      </p>
      <Link
        to="/"
        className="mt-8 inline-flex min-h-12 items-center gap-2 rounded-full bg-brand-500 px-8 font-semibold text-white shadow-soft transition hover:bg-brand-600"
      >
        <Home className="h-5 w-5" aria-hidden />
        Voltar para o início
      </Link>
    </div>
  );
}
