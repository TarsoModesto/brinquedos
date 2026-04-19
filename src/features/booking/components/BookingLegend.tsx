export function BookingLegend() {
  return (
    <ul className="mt-4 space-y-2 text-sm text-slate-600 dark:text-slate-400">
      <li className="flex items-center gap-2">
        <span className="h-3 w-3 rounded-full bg-red-400" /> Reservado
      </li>
      <li className="flex items-center gap-2">
        <span className="h-3 w-3 rounded-full bg-amber-300" /> Pendente
      </li>
      <li className="flex items-center gap-2">
        <span className="h-3 w-3 rounded-full bg-slate-200 dark:bg-slate-600" /> Disponível
      </li>
    </ul>
  );
}
