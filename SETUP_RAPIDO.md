# ⚡ SETUP RÁPIDO - BRINQUEDOS

## Resumo do que foi gerado

✅ **database.sql** — Todas as tabelas + RLS + funções SQL  
✅ **.env.example** — Template de variáveis  
✅ **Types** — Types TypeScript para banco  
✅ **Services** — Integração com Supabase  
✅ **Store** — Zustand atualizado pra fluxo de agendamento  
✅ **Edge Functions** — Mercado Pago (criar-preferencia-mp + webhook-mp)  
✅ **IMPLEMENTACAO_BRINQUEDOS.md** — Guia passo a passo (3 dias)  

---

## 🔥 COMEÇAR AGORA (5 minutos)

### 1. Criar Supabase

```bash
# Acesse https://supabase.com
# 1. Crie novo projeto
# 2. Escolha região: South America (São Paulo)
# 3. Copie Project URL e anon public key
```

### 2. Criar `.env.local`

```bash
cp .env.example .env.local
# Edite com suas credenciais do Supabase
```

### 3. Rodar SQL

```bash
# No Supabase SQL Editor:
# 1. Copie tudo de database.sql
# 2. Cole e execute
# 3. Espere 2 minutos
```

### 4. Instalar libs

```bash
npm install framer-motion @supabase/supabase-js leaflet qrcode.react
npm install -D @types/leaflet
```

### 5. Rodar localmente

```bash
npm run dev
# Abra http://localhost:5173
```

---

## 📋 Estrutura de pastas criada

```
src/
├── lib/
│   └── supabase.ts          ← Cliente Supabase
├── types/
│   ├── database.ts          ← Types do banco
│   └── supabase.ts          ← Types Supabase
├── services/
│   └── supabase.ts          ← Chamadas ao banco
├── store/
│   └── bookingStore.ts      ← State de agendamento
├── pages/
│   ├── BookingPage.tsx      ← Fluxo de agendamento
│   ├── AdminPage.tsx        ← Painel admin
│   └── PaymentPage.tsx      ← Tela de pagamento
├── components/
│   ├── booking/
│   │   ├── PassoServico.tsx
│   │   ├── PassoData.tsx
│   │   ├── PassoHorario.tsx
│   │   └── PassoConfirmacao.tsx
│   ├── payment/
│   │   └── PixPayment.tsx
│   └── auth/
│       └── ProtectedRoute.tsx
└── ...

supabase/
└── functions/
    ├── criar-preferencia-mp/index.ts
    └── webhook-mp/index.ts
```

---

## 📚 Documentação

**IMPLEMENTACAO_BRINQUEDOS.md** — Guia completo, dia a dia, 19 etapas

**Índice rápido:**
- **Dia 1**: Setup Supabase + Banco + .env (5-6h)
- **Dia 2**: Tela de agendamento com Framer Motion (6-8h)
- **Dia 3**: Pagamento PIX + Admin + Deploy Netlify (6-8h)

---

## 🎯 MVP vs v1.1

### MVP (8 de maio) ✅
- Agendamento com cálculo de horários
- Pagamento PIX (chave estática)
- Admin básico (ver agenda, bloquear datas)
- Deploy no Netlify

### v1.1 (próxima semana) 🔄
- Mercado Pago integrado (cartão com juros)
- Notificações por email
- Analytics de faturamento
- Domínio customizado

---

## ❓ FAQ

**P: Por que PIX e não Mercado Pago já?**  
R: Mercado Pago é mais complexo. PIX é rápido (2h) e funciona. MP vai na v1.1.

**P: Preciso de backend próprio?**  
R: Não! Supabase + Edge Functions é o "backend". Gratuito até 500k requisições/mês.

**P: Como testar localmente?**  
R: Com `npm run dev`. Para webhooks do MP, use Supabase local: `supabase start`.

**P: Qual é o custo total?**  
R: Supabase (gratuito até 50k MAU), Netlify (gratuito), Mercado Pago (2.99% por cartão, 0% PIX).

---

## 🚨 CRÍTICO

- [ ] Verificar que `.env.local` está NO `.gitignore`
- [ ] NÃO fazer commit de `.env.local`
- [ ] Usar credenciais de TESTE do Mercado Pago até produção estar pronta
- [ ] Configurar CORS do Supabase (já vem configurado)

---

## 📞 Próximos passos

1. Leia **IMPLEMENTACAO_BRINQUEDOS.md** (é um guia passo a passo)
2. Siga Dia 1, Dia 2, Dia 3 na ordem
3. Se travar, veja "Troubleshooting" no final do guia
4. No dia 8, está no ar!

---

**Boa sorte! Você tem tudo pronto pra sair do ar em 3 dias.** 🚀
