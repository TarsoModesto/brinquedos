import axios from 'axios';

/** Extrai mensagem amigável de erro de API (Axios ou genérico). */
export function getErrorMessage(err: unknown, fallback = 'Algo deu errado. Tente novamente.') {
  if (axios.isAxiosError(err)) {
    const data = err.response?.data as { message?: string } | undefined;
    if (data?.message) return data.message;
    if (err.message) return err.message;
  }
  if (err instanceof Error) return err.message;
  return fallback;
}
