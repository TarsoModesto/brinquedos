import { supabase } from '@/services/supabase/client';
import type { User, UserRole } from '@/types';

interface ProfileRow {
  id: string;
  nome: string;
  criado_em: string;
}

interface AdminRow {
  user_id: string;
}

export const userService = {
  /**
   * Lista usuários combinando `profiles` + `admins`.
   * O e-mail vem do auth.users e só admin consegue ler — então não retornamos
   * aqui (ficaria sempre vazio para clientes).
   */
  async list(): Promise<User[]> {
    const [{ data: profiles, error: pErr }, { data: admins, error: aErr }] = await Promise.all([
      supabase
        .from('profiles')
        .select('id, nome, criado_em')
        .order('criado_em', { ascending: false }),
      supabase.from('admins').select('user_id'),
    ]);
    if (pErr) throw new Error(pErr.message);
    if (aErr) throw new Error(aErr.message);

    const adminSet = new Set((admins as AdminRow[] | null ?? []).map((a) => a.user_id));

    return (profiles as ProfileRow[] | null ?? []).map((p) => ({
      id: p.id,
      name: p.nome,
      email: '',
      role: adminSet.has(p.id) ? 'admin' : 'user',
      createdAt: p.criado_em,
    }));
  },

  async setRole(userId: string, role: UserRole): Promise<User> {
    if (role === 'admin') {
      const { error } = await supabase
        .from('admins')
        .insert({ user_id: userId });
      if (error && !error.message.toLowerCase().includes('duplicate')) {
        throw new Error(error.message);
      }
    } else {
      const { error } = await supabase.from('admins').delete().eq('user_id', userId);
      if (error) throw new Error(error.message);
    }

    const { data: profile, error: pErr } = await supabase
      .from('profiles')
      .select('id, nome, criado_em')
      .eq('id', userId)
      .single();
    if (pErr) throw new Error(pErr.message);

    return {
      id: profile.id,
      name: profile.nome,
      email: '',
      role,
      createdAt: profile.criado_em,
    };
  },
};
