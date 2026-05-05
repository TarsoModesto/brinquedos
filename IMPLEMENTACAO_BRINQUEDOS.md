# 🎉 IMPLEMENTAÇÃO BRINQUEDOS - GUIA 3 DIAS

**Deadline**: 8 de maio de 2026 (3 dias)  
**Stack**: React 18 + TypeScript + Supabase + Netlify + PIX + Mercado Pago  
**MVP**: Agendamento funcional + Pagamento + Admin básico

---

## 📋 RESUMO DO ESCOPO

### O que você está construindo
- **Mini parque de festas infantis** — agendamento de espaço por durações (3h, 4h, 5h)
- **Preços por dia da semana** — semana vs fim de semana
- **Fluxo**: Cliente → Escolher serviço → Data → Horário → Pagamento PIX → Confirmação
- **Admin**: Ver agenda, bloquear datas, ver pagamentos

### Decisões tomadas
- **PIX**: Chave estática (CPF/email) — você confirma manualmente no banco
- **Mercado Pago**: Opcional na v1, adicionado na v1.1 (tem webhook pronto nas Edge Functions)
- **Notificações**: Email genérico por enquanto
- **OpenStreetMap**: Cálculo de distância entre agendamentos (já tem função SQL pronta)

---

## 🚀 DIA 1: INFRAESTRUTURA (5-6h)

### 1️⃣ Setup Supabase

**O que fazer:**
1. Acesse https://supabase.com
2. Crie um **novo projeto**
   - Nome: `brinquedos-festas`
   - Região: **South America (São Paulo)**
   - Salve a senha em local seguro
3. Aguarde o projeto ficar pronto (2-3 min)
4. Vá em **Settings → API** e copie:
   - `Project URL` → copiar
   - `anon public key` → copiar

**Resultado esperado:**
```
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
```

**Tempo**: 10 minutos

---

### 2️⃣ Criar banco de dados

**O que fazer:**
1. No painel do Supabase, vá em **SQL Editor**
2. Clique em **"New query"**
3. Copie TODO o conteúdo do arquivo `database.sql` do projeto
4. Cole no editor
5. Clique **"Run"**
6. Espere terminar (2-3 minutos)

**O que foi criado:**
- 8 tabelas (servicos, disponibilidade, agendamentos, etc)
- Row Level Security ativado
- Funções SQL (buscar_horarios_disponiveis, calcular_distancia)
- Dados iniciais (3 serviços, horários de funcionamento)

**Tempo**: 15 minutos

---

### 3️⃣ Configurar autenticação

**O que fazer:**
1. Vá em **Authentication → Providers**
2. Clique em **Email** (já deve estar ativado)
3. Vá em **Email Templates** e procure `Confirm signup` — edite pra português se quiser (opcional)
4. Vá em **URL Configuration**
5. Em **Site URL**: adicione `http://localhost:5173` (desenvolvimento)
6. Em **Redirect URLs**: adicione:
   ```
   http://localhost:5173/auth/callback
   http://localhost:5173/login
   http://localhost:5173/cadastro
   ```

**Tempo**: 10 minutos

---

### 4️⃣ Gerar tipos TypeScript (opcional mas recomendado)

**O que fazer:**
1. Instale Supabase CLI:
   ```bash
   npm install -g supabase
   ```
2. No terminal, dentro do projeto:
   ```bash
   npx supabase gen types typescript \
     --project-id seu-project-id \
     > src/types/supabase.ts
   ```
   (substitua `seu-project-id` pelo ID do seu projeto)

**Se não conseguir**, é ok — vamos usar os tipos básicos que já estão prontos.

**Tempo**: 10 minutos

---

### 5️⃣ Criar arquivo `.env.local`

**O que fazer:**
1. Copie o arquivo `.env.example` para `.env.local`
2. Preencha com suas credenciais:
   ```env
   VITE_SUPABASE_URL=https://seu-projeto.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJ...
   VITE_MP_PUBLIC_KEY=TEST-xxxxx
   VITE_PIX_CHAVE=seu-cpf@email.com
   VITE_ENVIRONMENT=development
   ```

**CRÍTICO**: Confirme que `.env.local` está no `.gitignore`

**Tempo**: 5 minutos

---

### 6️⃣ Instalar dependências faltantes

**O que fazer:**
```bash
npm install framer-motion @supabase/supabase-js leaflet
npm install -D @types/leaflet
```

**Por que?**
- `framer-motion` — animações
- `@supabase/supabase-js` — client Supabase
- `leaflet` — mapas (OpenStreetMap)

**Tempo**: 2 minutos

---

### 7️⃣ Testar conexão com Supabase

**O que fazer:**
1. Crie um arquivo `test-supabase.ts` na raiz:
   ```typescript
   import { supabase } from './src/lib/supabase';

   supabase.from('servicos').select('*').then(r => console.log(r));
   ```
2. Execute:
   ```bash
   npm run dev
   ```
3. Abra o console do navegador (F12)
4. Vá pra aba Network ou Console
5. Procure pela request pra Supabase
6. Se tiver status 200 e dados, ✅ está funcionando

**Tempo**: 10 minutos

---

## 🎨 DIA 2: TELA DE AGENDAMENTO (6-8h)

### 8️⃣ Criar páginas base

**O que fazer:**
1. Crie pasta `src/pages/`
2. Crie os seguintes arquivos:
   - `BookingPage.tsx` — fluxo de agendamento
   - `AdminPage.tsx` — painel admin
   - `PaymentPage.tsx` — tela de pagamento
   - `SuccessPage.tsx` — sucesso de pagamento

**Exemplo inicial de BookingPage.tsx:**
```typescript
import { useBookingStore } from '@/store/bookingStore';
import { useEffect } from 'react';

export function BookingPage() {
  const { current, carregarServicos } = useBookingStore();

  useEffect(() => {
    carregarServicos();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Agende sua festa!</h1>
      {current.step === 'servico' && <PassoServico />}
      {current.step === 'data' && <PassoData />}
      {current.step === 'horario' && <PassoHorario />}
      {current.step === 'confirmacao' && <PassoConfirmacao />}
    </div>
  );
}

function PassoServico() {
  const { servicos, setServico, proximoStep } = useBookingStore();
  return (
    <div>
      <h2 className="text-xl mb-4">Escolha o serviço</h2>
      {servicos.map((s) => (
        <button
          key={s.id}
          onClick={() => {
            setServico(s);
            proximoStep();
          }}
          className="block w-full p-4 mb-2 border rounded hover:bg-blue-50"
        >
          {s.nome} - R$ {s.preco_semana}
        </button>
      ))}
    </div>
  );
}
```

**Tempo**: 30 minutos

---

### 9️⃣ Passo 1 - Escolher Serviço

**Componente:** `src/components/booking/PassoServico.tsx`

```typescript
import { motion } from 'framer-motion';
import { useBookingStore } from '@/store/bookingStore';

export function PassoServico() {
  const { servicos, setServico, proximoStep } = useBookingStore();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <h2 className="text-2xl font-bold mb-6">Escolha o tempo de festa</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {servicos.map((servico) => (
          <motion.button
            key={servico.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setServico(servico);
              proximoStep();
            }}
            className="p-6 border-2 rounded-lg hover:border-blue-500 transition text-center"
          >
            <h3 className="font-bold text-lg mb-2">{servico.nome}</h3>
            <p className="text-gray-600 mb-4">{servico.descricao}</p>
            <p className="text-2xl font-bold text-blue-600">
              R$ {servico.preco_semana.toLocaleString('pt-BR')}
            </p>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}
```

**Tempo**: 45 minutos

---

### 🔟 Passo 2 - Escolher Data

**Componente:** `src/components/booking/PassoData.tsx`

```typescript
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useBookingStore } from '@/store/bookingStore';
import { horariosService } from '@/services/supabase';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export function PassoData() {
  const { current, setData, proximoStep, stepAnterior, isLoading } = useBookingStore();
  const [mesExibido, setMesExibido] = useState(new Date());

  const diasMes = getDiasDoMes(mesExibido);

  const handleClickDia = async (dia: number) => {
    const data = new Date(mesExibido.getFullYear(), mesExibido.getMonth(), dia);
    
    // Validar data
    if (!horariosService.isDataValida(data)) {
      alert('Data deve ser no mínimo amanhã');
      return;
    }

    await setData(data);
    proximoStep();
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h2 className="text-2xl font-bold mb-6">Escolha a data</h2>

      {/* Seletor de mês */}
      <div className="flex justify-between items-center mb-6">
        <button onClick={() => setMesExibido(new Date(mesExibido.getFullYear(), mesExibido.getMonth() - 1))}>
          <ChevronLeft />
        </button>
        <h3 className="font-bold">
          {mesExibido.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
        </h3>
        <button onClick={() => setMesExibido(new Date(mesExibido.getFullYear(), mesExibido.getMonth() + 1))}>
          <ChevronRight />
        </button>
      </div>

      {/* Grid de dias */}
      <div className="grid grid-cols-7 gap-2 mb-6">
        {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((d) => (
          <div key={d} className="text-center font-bold text-sm text-gray-500">
            {d}
          </div>
        ))}
        {diasMes.map((dia, idx) => (
          <motion.button
            key={idx}
            disabled={dia === null}
            onClick={() => dia && handleClickDia(dia)}
            whileHover={dia ? { scale: 1.1 } : {}}
            className={`p-4 rounded ${
              dia
                ? 'hover:bg-blue-500 hover:text-white cursor-pointer'
                : 'opacity-0'
            }`}
          >
            {dia}
          </motion.button>
        ))}
      </div>

      {/* Botões */}
      <div className="flex gap-4">
        <button onClick={stepAnterior} className="px-6 py-2 border rounded">
          Voltar
        </button>
        <button disabled={!current.data} className="px-6 py-2 bg-blue-600 text-white rounded disabled:opacity-50">
          Próximo
        </button>
      </div>
    </motion.div>
  );
}

function getDiasDoMes(data: Date): (number | null)[] {
  const ano = data.getFullYear();
  const mes = data.getMonth();
  const primeiroDia = new Date(ano, mes, 1).getDay();
  const ultimoDia = new Date(ano, mes + 1, 0).getDate();

  const dias: (number | null)[] = Array(primeiroDia).fill(null);
  for (let i = 1; i <= ultimoDia; i++) {
    dias.push(i);
  }
  return dias;
}
```

**Tempo**: 1 hora

---

### 1️⃣1️⃣ Passo 3 - Escolher Horário

**Componente:** `src/components/booking/PassoHorario.tsx`

```typescript
import { motion } from 'framer-motion';
import { useBookingStore } from '@/store/bookingStore';

export function PassoHorario() {
  const { current, horariosDisponiveis, setHorario, proximoStep, stepAnterior, isLoading } = useBookingStore();

  if (isLoading) {
    return <div className="text-center py-8">Carregando horários...</div>;
  }

  if (!horariosDisponiveis.length) {
    return (
      <div className="text-center py-8 text-red-600">
        Nenhum horário disponível nesta data. Escolha outra.
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h2 className="text-2xl font-bold mb-6">
        Escolha o horário para {current.data?.toLocaleDateString('pt-BR')}
      </h2>

      <div className="grid grid-cols-3 gap-3 mb-6">
        {horariosDisponiveis.map((h, idx) => (
          <motion.button
            key={idx}
            whileHover={{ scale: 1.05 }}
            onClick={() => {
              setHorario(h.hora_inicio);
              proximoStep();
            }}
            className="p-4 border-2 rounded hover:border-blue-500 hover:bg-blue-50 transition"
          >
            {h.hora_inicio} - {h.hora_fim}
          </motion.button>
        ))}
      </div>

      <div className="flex gap-4">
        <button onClick={stepAnterior} className="px-6 py-2 border rounded">
          Voltar
        </button>
      </div>
    </motion.div>
  );
}
```

**Tempo**: 45 minutos

---

### 1️⃣2️⃣ Passo 4 - Confirmação e Pagamento

**Componente:** `src/components/booking/PassoConfirmacao.tsx`

```typescript
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useBookingStore } from '@/store/bookingStore';
import { useAuthStore } from '@/store/authStore';
import { agendamentosService, pagamentosService, servicosService } from '@/services/supabase';

export function PassoConfirmacao() {
  const { current, stepAnterior, resetarFluxo } = useBookingStore();
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [metodoSelecionado, setMetodoSelecionado] = useState<'pix' | 'cartao'>('pix');

  const preco = servicosService.getPreco(
    current.servico!,
    current.data!
  );

  const handleAgendar = async () => {
    if (!user) {
      alert('Você precisa estar logado');
      return;
    }

    setLoading(true);
    try {
      // Criar agendamento
      const agendamento = await agendamentosService.criar(
        {
          servico_id: current.servico!.id,
          data_inicio: new Date(
            current.data!.getFullYear(),
            current.data!.getMonth(),
            current.data!.getDate(),
            parseInt(current.horario!.split(':')[0]),
            0
          ).toISOString(),
          zona_cliente: current.zona,
          lat_cliente: current.lat,
          lng_cliente: current.lng,
          observacoes: current.observacoes,
        },
        user.id
      );

      // Criar pagamento
      if (metodoSelecionado === 'pix') {
        const pixChave = import.meta.env.VITE_PIX_CHAVE;
        await pagamentosService.criar({
          agendamento_id: agendamento.id,
          metodo: 'pix',
          chave_pix: pixChave,
        });
      }

      alert('Agendamento criado! Prossiga para o pagamento.');
      resetarFluxo();
    } catch (err) {
      alert('Erro ao criar agendamento: ' + (err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h2 className="text-2xl font-bold mb-6">Confirme seu agendamento</h2>

      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <p><strong>Serviço:</strong> {current.servico?.nome}</p>
        <p><strong>Data:</strong> {current.data?.toLocaleDateString('pt-BR')}</p>
        <p><strong>Horário:</strong> {current.horario}</p>
        <p><strong>Duração:</strong> {current.servico?.duracao_minutos} minutos</p>
        <p className="text-2xl font-bold mt-4">Total: R$ {preco.toLocaleString('pt-BR')}</p>
      </div>

      <div className="mb-6">
        <h3 className="font-bold mb-3">Escolha o método de pagamento</h3>
        <motion.button
          onClick={() => setMetodoSelecionado('pix')}
          className={`w-full p-4 border rounded mb-3 transition ${
            metodoSelecionado === 'pix'
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-300'
          }`}
        >
          💳 PIX (Imediato, sem juros)
        </motion.button>
        <button
          onClick={() => setMetodoSelecionado('cartao')}
          className={`w-full p-4 border rounded transition ${
            metodoSelecionado === 'cartao'
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-300'
          }`}
        >
          💰 Cartão (com juros)
        </button>
      </div>

      <div className="flex gap-4">
        <button onClick={stepAnterior} className="px-6 py-2 border rounded" disabled={loading}>
          Voltar
        </button>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleAgendar}
          disabled={loading}
          className="flex-1 px-6 py-2 bg-green-600 text-white rounded disabled:opacity-50"
        >
          {loading ? 'Processando...' : 'Confirmar e Pagar'}
        </motion.button>
      </div>
    </motion.div>
  );
}
```

**Tempo**: 1 hora

---

## 💳 DIA 3: PAGAMENTO + ADMIN (6-8h)

### 1️⃣3️⃣ Integração PIX (chave estática)

**Componente:** `src/components/payment/PixPayment.tsx`

```typescript
import QRCode from 'qrcode.react';
import { useState } from 'react';

export function PixPayment({ chave, valor }: { chave: string; valor: number }) {
  const [mostrarQR, setMostrarQR] = useState(false);

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 p-6 rounded">
        <h3 className="font-bold mb-3">Dados para transferência PIX</h3>
        <p className="text-sm text-gray-700 mb-4">
          Escaneie o QR Code ou copie a chave abaixo:
        </p>
        
        {mostrarQR && (
          <div className="flex justify-center my-4">
            <QRCode value={chave} size={256} />
          </div>
        )}

        <button
          onClick={() => setMostrarQR(!mostrarQR)}
          className="block w-full p-3 bg-blue-600 text-white rounded mb-4"
        >
          {mostrarQR ? 'Esconder QR' : 'Mostrar QR Code'}
        </button>

        <div className="bg-white p-4 rounded border">
          <p className="text-xs text-gray-500 mb-1">Chave PIX:</p>
          <p className="font-mono text-sm break-all">{chave}</p>
          <button
            onClick={() => navigator.clipboard.writeText(chave)}
            className="text-xs text-blue-600 mt-2"
          >
            Copiar
          </button>
        </div>
      </div>

      <div className="bg-yellow-50 p-4 rounded border border-yellow-200">
        <p className="text-sm text-yellow-800">
          ⚠️ Após efetuar a transferência, aguarde a confirmação. 
          Você será notificado por email assim que recebermos seu pagamento.
        </p>
      </div>

      <div className="text-center">
        <p className="text-sm text-gray-600">Valor a pagar:</p>
        <p className="text-3xl font-bold text-green-600">
          R$ {valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
        </p>
      </div>
    </div>
  );
}
```

**Dependência adicional:**
```bash
npm install qrcode.react
```

**Tempo**: 1 hora

---

### 1️⃣4️⃣ Painel Admin

**Componente:** `src/pages/AdminPage.tsx`

```typescript
import { useEffect, useState } from 'react';
import { agendamentosService, bloqueiosService } from '@/services/supabase';
import type { Agendamento, Bloqueio } from '@/types/database';

export function AdminPage() {
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [bloqueios, setBloqueios] = useState<Bloqueio[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      const [agendamentos, bloqueios] = await Promise.all([
        agendamentosService.listarAdmin(),
        bloqueiosService.listar(),
      ]);
      setAgendamentos(agendamentos || []);
      setBloqueios(bloqueios || []);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmar = async (id: string) => {
    await agendamentosService.confirmar(id);
    carregarDados();
  };

  const handleCancelar = async (id: string) => {
    await agendamentosService.cancelar(id);
    carregarDados();
  };

  if (loading) return <div className="p-8 text-center">Carregando...</div>;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Painel Admin</h1>

      {/* Agendamentos do Dia */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">Agendamentos</h2>
        <div className="space-y-3">
          {agendamentos.map((a) => (
            <div key={a.id} className="p-4 border rounded-lg">
              <div className="grid grid-cols-4 gap-4 mb-3">
                <div>
                  <p className="text-xs text-gray-500">Cliente</p>
                  <p className="font-bold">{a.cliente?.nome || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Data</p>
                  <p className="font-bold">
                    {new Date(a.data_inicio).toLocaleDateString('pt-BR')}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Valor</p>
                  <p className="font-bold">
                    R$ {a.pagamento?.valor?.toLocaleString('pt-BR') || 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Status</p>
                  <p className={`font-bold ${
                    a.status === 'confirmado' ? 'text-green-600' : 'text-yellow-600'
                  }`}>
                    {a.status}
                  </p>
                </div>
              </div>

              {a.status === 'aguardando_pagamento' && (
                <div className="flex gap-2">
                  <button
                    onClick={() => handleConfirmar(a.id)}
                    className="px-4 py-2 bg-green-600 text-white rounded text-sm"
                  >
                    Confirmar
                  </button>
                  <button
                    onClick={() => handleCancelar(a.id)}
                    className="px-4 py-2 bg-red-600 text-white rounded text-sm"
                  >
                    Cancelar
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Bloqueios */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Datas Bloqueadas</h2>
        <div className="space-y-2">
          {bloqueios.map((b) => (
            <div key={b.id} className="p-3 border rounded bg-red-50">
              <p>
                <strong>{b.data_inicio}</strong> até <strong>{b.data_fim}</strong>
                {b.motivo && <span> — {b.motivo}</span>}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
```

**Tempo**: 1 hora

---

### 1️⃣5️⃣ Rotas no App.tsx

**Atualizar:** `src/app/App.tsx`

```typescript
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { BookingPage } from '@/pages/BookingPage';
import { AdminPage } from '@/pages/AdminPage';
import { LoginPage } from '@/pages/LoginPage';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<BookingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute adminOnly>
              <AdminPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
```

**Tempo**: 15 minutos

---

### 1️⃣6️⃣ Componente de Rota Protegida

**Novo:** `src/components/auth/ProtectedRoute.tsx`

```typescript
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { adminsService } from '@/services/supabase'; // você vai criar isso
import { useEffect, useState } from 'react';

export function ProtectedRoute({
  children,
  adminOnly,
}: {
  children: React.ReactNode;
  adminOnly?: boolean;
}) {
  const { user, initialized } = useAuthStore();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (adminOnly && user) {
      // Verificar se é admin
      // Por enquanto, vamos deixar em branco e testar manualmente
    }
  }, [user, adminOnly]);

  if (!initialized) return <div className="p-8 text-center">Carregando...</div>;

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
}
```

**Tempo**: 15 minutos

---

## 🎬 DEPLOY NO NETLIFY (1h)

### 1️⃣7️⃣ Preparar para deploy

**O que fazer:**
1. Commit todas as mudanças:
   ```bash
   git add .
   git commit -m "feat: implementação completa brinquedos"
   ```

2. Push para main:
   ```bash
   git push origin main
   ```

**Tempo**: 5 minutos

---

### 1️⃣8️⃣ Conectar Netlify

**O que fazer:**
1. Acesse https://netlify.com
2. Clique **"Add new site"** → **"Import an existing project"**
3. Conecte sua conta GitHub
4. Selecione repositório `brinquedos`
5. Configure:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
6. Clique **"Deploy site"**
7. Aguarde 2-3 minutos (build vai rodar automaticamente)

**Tempo**: 15 minutos

---

### 1️⃣9️⃣ Adicionar variáveis de ambiente no Netlify

**O que fazer:**
1. No painel do Netlify, vá em **Site settings** → **Build & deploy** → **Environment**
2. Clique **"Edit variables"**
3. Adicione cada linha do seu `.env.local`:
   ```
   VITE_SUPABASE_URL=https://...
   VITE_SUPABASE_ANON_KEY=eyJ...
   VITE_MP_PUBLIC_KEY=TEST-...
   VITE_PIX_CHAVE=seu-cpf@email
   VITE_ENVIRONMENT=production
   ```

**Tempo**: 10 minutos

---

### 🔟 Deploy das Edge Functions

**O que fazer:**
1. No terminal:
   ```bash
   npx supabase functions deploy criar-preferencia-mp
   npx supabase functions deploy webhook-mp
   ```

2. Configure secrets (para a Edge Function acessar Mercado Pago):
   ```bash
   npx supabase secrets set MP_ACCESS_TOKEN=seu_token_aqui
   npx supabase secrets set FRONTEND_URL=https://seu-site.netlify.app
   ```

**Nota**: Você vai usar credenciais de teste do Mercado Pago por enquanto

**Tempo**: 15 minutos

---

## ✅ CHECKLIST FINAL (8 de maio)

- [ ] Supabase criado e banco populado (database.sql rodou)
- [ ] `.env.local` preenchido com credenciais
- [ ] Site roda em `localhost:5173` sem erros
- [ ] Pode fazer login/cadastro
- [ ] Pode agendar (selecionar serviço → data → horário)
- [ ] Tela de agendamento mostra horários disponíveis
- [ ] Painel admin mostra agendamentos
- [ ] Site está no ar em Netlify
- [ ] PIX funciona (mostra QR Code)

---

## 🚀 PRÓXIMOS PASSOS (v1.1 - próxima semana)

- [ ] Integração Mercado Pago completa (cartão com juros)
- [ ] Notificações por email (com Resend)
- [ ] Dashboard de analytics (faturamento, horários mais procurados)
- [ ] Confirmação automática de agendamentos (via webhook)
- [ ] Calcular melhor os horários considerando distância e tempo de deslocamento
- [ ] Domínio customizado (Registro.br)

---

## 🆘 TROUBLESHOOTING

**"Erro ao conectar com Supabase"**
- Verificar credenciais no `.env.local`
- Confirmar que `.env.local` NÃO está em `.gitignore` (espera, sim está!)

**"Horários não aparecem"**
- Verificar se os dados iniciais foram inseridos em `disponibilidade`
- Testar a função SQL diretamente no Supabase: `SELECT * FROM disponibilidade`

**"Pagamento não funciona"**
- Usar o QR Code genérico (chave estática) por enquanto
- Mercado Pago é v1.1

**"Erro no deploy do Netlify"**
- Verificar se todas as variáveis de ambiente estão em **Site settings**
- Ver logs: Deploys → clique no deploy → "Deploy log"

---

## 📞 CONTATO

Qualquer dúvida, chamar!

Boa sorte! 🎉
