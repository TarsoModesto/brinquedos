/** Orbs e estrelas decorativos do fundo (leves, como nos prints). */
export function PageDecor() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute -left-32 top-0 h-96 w-96 rounded-full bg-sky-200/40 blur-3xl dark:bg-sky-900/20" />
      <div className="absolute -right-24 top-24 h-80 w-80 rounded-full bg-pink-200/35 blur-3xl dark:bg-pink-900/15" />
      <div className="absolute bottom-20 left-1/4 h-64 w-64 rounded-full bg-emerald-200/25 blur-3xl dark:bg-emerald-900/10" />
      <span className="absolute left-[12%] top-32 text-sky-300/50 dark:text-sky-600/30">✦</span>
      <span className="absolute right-[18%] top-48 text-pink-300/40 dark:text-pink-600/25">✦</span>
    </div>
  );
}
