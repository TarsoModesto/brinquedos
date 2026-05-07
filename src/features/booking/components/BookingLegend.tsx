export function BookingLegend() {
  return (
    <ul className="mt-6 grid gap-2 text-sm text-slate-600 dark:text-slate-400">
      <li className="flex items-center gap-3 rounded-xl bg-red-50 px-3 py-2 dark:bg-red-950/30">
        <span className="h-3 w-3 rounded-full bg-red-400" />
        <span>
          <strong className="text-red-800 dark:text-red-200">Reservado</strong> — data confirmada
        </span>
      </li>
      <li className="flex items-center gap-3 rounded-xl bg-amber-50 px-3 py-2 dark:bg-amber-950/30">
        <span className="relative flex h-3 w-3">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-300 opacity-75" />
          <span className="relative inline-flex h-3 w-3 rounded-full bg-amber-400" />
        </span>
        <span>
          <strong className="text-amber-800 dark:text-amber-200">Pendente</strong> — aguardando confirmação
        </span>
      </li>
      <li className="flex items-center gap-3 rounded-xl bg-slate-100 px-3 py-2 dark:bg-slate-800/40">
        <span className="h-3 w-3 rounded-full bg-slate-300 dark:bg-slate-500" />
        <span>
          <strong className="text-slate-800 dark:text-slate-200">Disponível</strong> — clique para reservar
        </span>
      </li>
    </ul>
  );
}
