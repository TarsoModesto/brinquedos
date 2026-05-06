-- =====================================================================
-- Carretar da Alegria — Setup Supabase (idempotente)
-- =====================================================================
-- Cole este script inteiro no SQL Editor do Supabase e execute.
-- Pode rodar quantas vezes quiser — usa IF NOT EXISTS / OR REPLACE.
-- Alinhado com tabelas já existentes (profiles, admins, agendamentos).
-- =====================================================================

-- 1) PROFILES — dados públicos do usuário (1:1 com auth.users) ----------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  nome text not null default 'Usuário',
  telefone text,
  criado_em timestamptz not null default now()
);

alter table public.profiles add column if not exists nome text not null default 'Usuário';
alter table public.profiles add column if not exists telefone text;
alter table public.profiles add column if not exists criado_em timestamptz not null default now();

-- 2) ADMINS — quem tem permissão administrativa -----------------------
create table if not exists public.admins (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  criado_em timestamptz not null default now()
);

alter table public.admins add column if not exists criado_em timestamptz not null default now();

-- 3) AGENDAMENTOS — reservas de datas ---------------------------------
create table if not exists public.agendamentos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  nome text not null,
  telefone text not null,
  data date not null,
  status text not null default 'pending',
  criado_em timestamptz not null default now()
);

alter table public.agendamentos add column if not exists user_id uuid references auth.users(id) on delete set null;
alter table public.agendamentos add column if not exists nome text;
alter table public.agendamentos add column if not exists telefone text;
alter table public.agendamentos add column if not exists data date;
alter table public.agendamentos add column if not exists status text default 'pending';
alter table public.agendamentos add column if not exists criado_em timestamptz default now();

-- Constraint do status (re-cria pra garantir os valores aceitos)
alter table public.agendamentos drop constraint if exists agendamentos_status_check;
alter table public.agendamentos
  add constraint agendamentos_status_check
  check (status in ('pending','confirmed','cancelled'));

-- Impede duas reservas ativas na mesma data (índice único parcial)
drop index if exists agendamentos_data_ativa_unica;
create unique index agendamentos_data_ativa_unica
  on public.agendamentos (data)
  where status <> 'cancelled';

-- 4) FUNÇÃO is_admin — checagem usada nas policies --------------------
create or replace function public.is_admin(uid uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (select 1 from public.admins where user_id = uid);
$$;

grant execute on function public.is_admin(uuid) to anon, authenticated;

-- 5) TRIGGER — cria profile automaticamente após signup ---------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, nome, telefone)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'nome', split_part(new.email, '@', 1)),
    new.raw_user_meta_data->>'telefone'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 6) ROW LEVEL SECURITY -----------------------------------------------
alter table public.profiles enable row level security;
alter table public.admins enable row level security;
alter table public.agendamentos enable row level security;

-- profiles: leitura pública (necessário pro painel admin listar);
-- usuário pode atualizar a própria; admin pode tudo.
drop policy if exists "profiles_select_all" on public.profiles;
create policy "profiles_select_all" on public.profiles
  for select using (true);

drop policy if exists "profiles_update_self" on public.profiles;
create policy "profiles_update_self" on public.profiles
  for update using (auth.uid() = id) with check (auth.uid() = id);

drop policy if exists "profiles_admin_all" on public.profiles;
create policy "profiles_admin_all" on public.profiles
  for all using (public.is_admin(auth.uid())) with check (public.is_admin(auth.uid()));

-- admins: leitura para todos (pra resolver papel no client);
-- só admin pode inserir/remover.
drop policy if exists "admins_select_all" on public.admins;
create policy "admins_select_all" on public.admins
  for select using (true);

drop policy if exists "admins_admin_write" on public.admins;
create policy "admins_admin_write" on public.admins
  for all using (public.is_admin(auth.uid())) with check (public.is_admin(auth.uid()));

-- agendamentos: todos podem ver (calendário público);
-- usuário autenticado pode criar com user_id próprio;
-- usuário pode cancelar a própria reserva pendente;
-- admin pode tudo.
drop policy if exists "agendamentos_select_all" on public.agendamentos;
create policy "agendamentos_select_all" on public.agendamentos
  for select using (true);

drop policy if exists "agendamentos_insert_auth" on public.agendamentos;
create policy "agendamentos_insert_auth" on public.agendamentos
  for insert with check (
    auth.uid() is not null and (user_id = auth.uid() or public.is_admin(auth.uid()))
  );

drop policy if exists "agendamentos_update_owner_or_admin" on public.agendamentos;
create policy "agendamentos_update_owner_or_admin" on public.agendamentos
  for update using (
    public.is_admin(auth.uid()) or (user_id = auth.uid() and status = 'pending')
  ) with check (
    public.is_admin(auth.uid()) or (user_id = auth.uid())
  );

drop policy if exists "agendamentos_delete_admin" on public.agendamentos;
create policy "agendamentos_delete_admin" on public.agendamentos
  for delete using (public.is_admin(auth.uid()));

-- 7) PRIMEIRO ADMIN ---------------------------------------------------
-- Após criar a sua conta normalmente pelo site (/cadastro), volte aqui
-- e rode o bloco abaixo trocando o e-mail. Isso te promove a admin.
--
--   insert into public.admins (user_id)
--   select id from auth.users where email = 'seu-email@aqui.com'
--   on conflict (user_id) do nothing;
--
-- =====================================================================
