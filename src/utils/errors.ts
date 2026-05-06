/** Extrai mensagem amigável de erro (Error genérico ou objeto com `message`). */
export function getErrorMessage(err: unknown, fallback = 'Algo deu errado. Tente novamente.') {
  if (err instanceof Error) return err.message;
  if (typeof err === 'object' && err !== null && 'message' in err) {
    const m = (err as { message?: unknown }).message;
    if (typeof m === 'string') return m;
  }
  if (typeof err === 'string') return err;
  return fallback;
}
