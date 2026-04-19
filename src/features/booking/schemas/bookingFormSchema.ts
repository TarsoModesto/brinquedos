import { z } from 'zod';

export const bookingFormSchema = z.object({
  name: z.string().min(3, 'Informe o nome completo.'),
  phone: z
    .string()
    .min(10, 'Telefone inválido.')
    .regex(/^[\d\s()\-+]+$/, 'Use apenas números e símbolos de telefone.'),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Data inválida.'),
});

export type BookingFormValues = z.infer<typeof bookingFormSchema>;
