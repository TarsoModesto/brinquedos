import { supabase } from '@/services/supabase/client';
import type { Booking, BookingStatus, CreateBookingInput } from '@/types';

interface AgendamentoRow {
  id: string;
  user_id: string | null;
  nome: string;
  telefone: string;
  data: string;
  status: BookingStatus;
  criado_em: string;
}

function toBooking(row: AgendamentoRow): Booking {
  return {
    id: row.id,
    userId: row.user_id,
    name: row.nome,
    phone: row.telefone,
    date: row.data,
    status: row.status,
    createdAt: row.criado_em,
  };
}

export const bookingService = {
  async list(): Promise<Booking[]> {
    const { data, error } = await supabase
      .from('agendamentos')
      .select('id, user_id, nome, telefone, data, status, criado_em')
      .order('data', { ascending: true });
    if (error) throw new Error(error.message);
    return (data ?? []).map(toBooking);
  },

  async create(input: CreateBookingInput): Promise<Booking> {
    const { data: session } = await supabase.auth.getUser();
    if (!session.user) throw new Error('Faça login para reservar.');

    const { data, error } = await supabase
      .from('agendamentos')
      .insert({
        user_id: session.user.id,
        nome: input.name.trim(),
        telefone: input.phone.trim(),
        data: input.date,
        status: 'pending',
      })
      .select('id, user_id, nome, telefone, data, status, criado_em')
      .single();
    if (error) {
      if (error.code === '23505' || error.message.toLowerCase().includes('unique')) {
        throw new Error('Esta data já possui uma reserva ativa.');
      }
      throw new Error(error.message);
    }
    return toBooking(data);
  },

  async updateStatus(id: string, status: BookingStatus): Promise<Booking> {
    const { data, error } = await supabase
      .from('agendamentos')
      .update({ status })
      .eq('id', id)
      .select('id, user_id, nome, telefone, data, status, criado_em')
      .single();
    if (error) throw new Error(error.message);
    return toBooking(data);
  },

  async remove(id: string): Promise<void> {
    const { error } = await supabase.from('agendamentos').delete().eq('id', id);
    if (error) throw new Error(error.message);
  },
};
