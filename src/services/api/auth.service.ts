import { supabase } from '@/services/supabase/client';
import type { LoginInput, RegisterInput, User } from '@/types';

async function buildUser(authUser: { id: string; email?: string | null }): Promise<User> {
  const [{ data: profile }, { data: adminRow }] = await Promise.all([
    supabase
      .from('profiles')
      .select('nome, telefone, criado_em')
      .eq('id', authUser.id)
      .maybeSingle(),
    supabase.from('admins').select('user_id').eq('user_id', authUser.id).maybeSingle(),
  ]);

  return {
    id: authUser.id,
    email: authUser.email ?? '',
    name: profile?.nome ?? authUser.email?.split('@')[0] ?? 'Usuário',
    role: adminRow ? 'admin' : 'user',
    createdAt: profile?.criado_em ?? new Date().toISOString(),
  };
}

export const authService = {
  async register(input: RegisterInput): Promise<User> {
    const { data, error } = await supabase.auth.signUp({
      email: input.email.trim().toLowerCase(),
      password: input.password,
      options: { data: { nome: input.name.trim() } },
    });
    if (error) throw new Error(translateAuthError(error.message));
    if (!data.user) throw new Error('Não foi possível criar a conta.');
    return buildUser(data.user);
  },

  async login(input: LoginInput): Promise<User> {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: input.email.trim().toLowerCase(),
      password: input.password,
    });
    if (error) throw new Error(translateAuthError(error.message));
    if (!data.user) throw new Error('E-mail ou senha inválidos.');
    return buildUser(data.user);
  },

  async logout(): Promise<void> {
    const { error } = await supabase.auth.signOut();
    if (error) throw new Error(error.message);
  },

  async me(): Promise<User | null> {
    const { data } = await supabase.auth.getUser();
    if (!data.user) return null;
    return buildUser(data.user);
  },
};

function translateAuthError(msg: string): string {
  const m = msg.toLowerCase();
  if (m.includes('invalid login credentials')) return 'E-mail ou senha inválidos.';
  if (m.includes('user already registered')) return 'Este e-mail já está cadastrado.';
  if (m.includes('email not confirmed')) return 'Confirme seu e-mail antes de entrar.';
  if (m.includes('password should be at least')) return 'Senha muito curta (mínimo 6 caracteres).';
  if (m.includes('rate limit')) return 'Muitas tentativas. Aguarde um momento e tente novamente.';
  return msg;
}
