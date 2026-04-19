import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('E-mail inválido.'),
  password: z.string().min(4, 'Senha muito curta.'),
});

export const registerSchema = z.object({
  name: z.string().min(2, 'Informe seu nome.'),
  email: z.string().email('E-mail inválido.'),
  password: z.string().min(6, 'Use pelo menos 6 caracteres.'),
  confirm: z.string(),
}).refine((data) => data.password === data.confirm, {
  message: 'As senhas não conferem.',
  path: ['confirm'],
});

export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;
