# Setup Supabase — Carretar da Alegria

## 1) Aplicar o schema

1. Abra o **SQL Editor** do projeto Supabase.
2. Cole o conteúdo de `supabase/setup.sql` e clique em **Run**.
3. O script é idempotente — pode ser rodado várias vezes sem efeitos colaterais.

O script garante:
- Tabelas `profiles`, `admins`, `agendamentos` com as colunas que o frontend espera.
- Trigger que cria a `profile` automaticamente quando um usuário se cadastra.
- Função `is_admin(uid)` usada pelas policies.
- Row Level Security configurado para cada tabela.
- Índice único parcial impedindo duas reservas ativas na mesma data.

## 2) Configurar credenciais no frontend

1. No painel do Supabase: **Project Settings → API**.
2. Copie `Project URL` e `anon public` key.
3. Crie/edite o arquivo `.env.local` na raiz do projeto:

```
VITE_SUPABASE_URL=https://opkpcjeppesdgpkauyvr.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJI... (a sua anon key aqui)
```

> A `anon key` é pública por design — é segura no client. **Nunca** coloque a `service_role` key no frontend.

## 3) Auth — confirmação de e-mail

Por padrão o Supabase exige confirmação de e-mail. Para teste local mais rápido:

- **Authentication → Providers → Email** → desabilite "Confirm email" temporariamente, ou
- **Authentication → URL Configuration** → ajuste a URL de redirect.

## 4) Criar o primeiro admin

1. Cadastre-se normalmente em `/cadastro` no site.
2. Volte ao SQL Editor e rode (substitua o e-mail):

```sql
insert into public.admins (user_id)
select id from auth.users where email = 'seu-email@aqui.com'
on conflict (user_id) do nothing;
```

3. Recarregue a aba do site — o link "Admin" aparece no header.

## 5) Promover novos admins

Depois do primeiro admin, basta usar a página `/admin/usuarios` e clicar em "Promover a admin" — não precisa mais voltar ao SQL Editor.

## Estrutura de RLS aplicada

| Tabela | SELECT | INSERT | UPDATE | DELETE |
|---|---|---|---|---|
| `profiles` | público | trigger | dono / admin | admin |
| `admins` | público | admin | — | admin |
| `agendamentos` | público | autenticado (próprio) | dono pendente / admin | admin |

## Tabelas extras presentes no projeto

O frontend só consome `profiles`, `admins` e `agendamentos`. As tabelas `bloqueios`, `disponibilidade`, `notificacoes`, `pagamentos` e `servicos` permanecem intactas e podem ser integradas em iterações futuras.
