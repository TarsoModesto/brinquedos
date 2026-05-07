/** Orbs decorativos do fundo, com toda a paleta vibrante. */
export function PageDecor() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute -left-32 top-0 h-96 w-96 rounded-full bg-brand-300/35 blur-3xl dark:bg-brand-900/20" />
      <div className="absolute -right-24 top-24 h-80 w-80 rounded-full bg-accent-300/40 blur-3xl dark:bg-accent-700/15" />
      <div className="absolute top-[40vh] left-1/3 h-72 w-72 rounded-full bg-magic-300/30 blur-3xl dark:bg-magic-700/15" />
      <div className="absolute bottom-20 left-1/4 h-64 w-64 rounded-full bg-support-300/30 blur-3xl dark:bg-support-700/15" />
      <div className="absolute bottom-40 right-10 h-72 w-72 rounded-full bg-joy-300/30 blur-3xl dark:bg-joy-700/10" />
      <span className="absolute left-[12%] top-32 text-brand-300/50 dark:text-brand-600/30">✦</span>
      <span className="absolute right-[18%] top-48 text-accent-300/50 dark:text-accent-600/30">✦</span>
      <span className="absolute left-[60%] top-[70vh] text-magic-300/50 dark:text-magic-600/30">✦</span>
    </div>
  );
}
