-- ========================================
-- BRINQUEDOS MINI PARQUE - SCHEMA COMPLETO
-- ========================================
-- Execute isto no SQL Editor do Supabase
-- Timezone: America/Sao_Paulo

-- 1. TABELA: SERVIÇOS
CREATE TABLE IF NOT EXISTS servicos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome VARCHAR(100) NOT NULL,
  descricao TEXT,
  duracao_minutos INT NOT NULL, -- 180, 240, 300
  preco_semana DECIMAL(10, 2) NOT NULL, -- segunda a sexta
  preco_fim_semana DECIMAL(10, 2) NOT NULL, -- sábado e domingo
  ativo BOOLEAN DEFAULT TRUE,
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT duracao_positiva CHECK (duracao_minutos > 0),
  CONSTRAINT precos_positivos CHECK (preco_semana > 0 AND preco_fim_semana > 0)
);

-- 2. TABELA: DISPONIBILIDADE (horários de funcionamento)
CREATE TABLE IF NOT EXISTS disponibilidade (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dia_semana INT NOT NULL, -- 0=domingo, 1=segunda, ..., 6=sábado
  hora_inicio TIME NOT NULL,
  hora_fim TIME NOT NULL,
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT dia_valido CHECK (dia_semana >= 0 AND dia_semana <= 6),
  CONSTRAINT hora_valida CHECK (hora_inicio < hora_fim),
  UNIQUE(dia_semana)
);

-- 3. TABELA: BLOQUEIOS (admin bloqueia datas/períodos)
CREATE TABLE IF NOT EXISTS bloqueios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  data_inicio DATE NOT NULL,
  data_fim DATE NOT NULL,
  motivo VARCHAR(255),
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  criado_por UUID NOT NULL REFERENCES auth.users(id),
  CONSTRAINT datas_bloqueio CHECK (data_inicio <= data_fim)
);

-- 4. TABELA: PROFILES (estende auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nome VARCHAR(255),
  telefone VARCHAR(20),
  endereco VARCHAR(500),
  zona_atendimento VARCHAR(100), -- ex: "Zona Leste", "Centro"
  lat DECIMAL(10, 8), -- latitude para cálculo de distância
  lng DECIMAL(11, 8), -- longitude
  cpf_cnpj VARCHAR(20),
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. TABELA: ADMINS (permissões elevadas)
CREATE TABLE IF NOT EXISTS admins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. TABELA: AGENDAMENTOS (core)
CREATE TABLE IF NOT EXISTS agendamentos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cliente_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  servico_id UUID NOT NULL REFERENCES servicos(id),
  data_inicio TIMESTAMP WITH TIME ZONE NOT NULL,
  data_fim TIMESTAMP WITH TIME ZONE NOT NULL, -- calculado: data_inicio + duracao_minutos
  status VARCHAR(50) DEFAULT 'aguardando_pagamento', -- aguardando_pagamento, confirmado, realizado, cancelado
  zona_cliente VARCHAR(100),
  lat_cliente DECIMAL(10, 8),
  lng_cliente DECIMAL(11, 8),
  observacoes TEXT,
  requer_aprovacao_admin BOOLEAN DEFAULT FALSE, -- se agendou para hoje
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT data_futura CHECK (data_inicio > NOW()),
  CONSTRAINT status_valido CHECK (status IN ('aguardando_pagamento', 'confirmado', 'realizado', 'cancelado')),
  INDEX idx_cliente_id (cliente_id),
  INDEX idx_servico_id (servico_id),
  INDEX idx_data_inicio (data_inicio)
);

-- 7. TABELA: PAGAMENTOS (histórico)
CREATE TABLE IF NOT EXISTS pagamentos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agendamento_id UUID NOT NULL UNIQUE REFERENCES agendamentos(id) ON DELETE CASCADE,
  metodo VARCHAR(50) NOT NULL, -- 'pix', 'cartao'
  valor DECIMAL(10, 2) NOT NULL,
  status VARCHAR(50) DEFAULT 'pendente', -- pendente, aprovado, recusado
  mp_payment_id VARCHAR(100), -- ID do Mercado Pago (se aplica)
  juros DECIMAL(10, 2) DEFAULT 0,
  parcelas INT DEFAULT 1,
  chave_pix_utilizada VARCHAR(255), -- CPF/CNPJ/email/telefone da chave PIX usada
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT valor_positivo CHECK (valor > 0),
  CONSTRAINT parcelas_validas CHECK (parcelas >= 1 AND parcelas <= 12),
  INDEX idx_agendamento_id (agendamento_id),
  INDEX idx_status (status)
);

-- 8. TABELA: NOTIFICACOES (histórico de emails/notificações enviadas)
CREATE TABLE IF NOT EXISTS notificacoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agendamento_id UUID REFERENCES agendamentos(id) ON DELETE CASCADE,
  usuario_id UUID NOT NULL REFERENCES auth.users(id),
  tipo VARCHAR(50) NOT NULL, -- 'confirmacao', 'lembrete', 'cancelamento'
  assunto VARCHAR(255),
  corpo TEXT,
  status VARCHAR(50) DEFAULT 'enviada', -- enviada, falha
  tentativas INT DEFAULT 1,
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  INDEX idx_agendamento_id (agendamento_id)
);

-- ========================================
-- ROW LEVEL SECURITY (RLS)
-- ========================================

-- Habilitar RLS em todas as tabelas
ALTER TABLE servicos ENABLE ROW LEVEL SECURITY;
ALTER TABLE disponibilidade ENABLE ROW LEVEL SECURITY;
ALTER TABLE bloqueios ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE agendamentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE pagamentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE notificacoes ENABLE ROW LEVEL SECURITY;

-- SERVICOS: leitura pública, escrita só admin
CREATE POLICY "servicos_leitura_publica" ON servicos FOR SELECT USING (true);
CREATE POLICY "servicos_escrita_admin" ON servicos FOR INSERT
  WITH CHECK (EXISTS(SELECT 1 FROM admins WHERE user_id = auth.uid()));
CREATE POLICY "servicos_update_admin" ON servicos FOR UPDATE
  USING (EXISTS(SELECT 1 FROM admins WHERE user_id = auth.uid()));

-- DISPONIBILIDADE: leitura pública, escrita só admin
CREATE POLICY "disponibilidade_leitura_publica" ON disponibilidade FOR SELECT USING (true);
CREATE POLICY "disponibilidade_escrita_admin" ON disponibilidade FOR INSERT
  WITH CHECK (EXISTS(SELECT 1 FROM admins WHERE user_id = auth.uid()));
CREATE POLICY "disponibilidade_update_admin" ON disponibilidade FOR UPDATE
  USING (EXISTS(SELECT 1 FROM admins WHERE user_id = auth.uid()));

-- BLOQUEIOS: leitura só admin, escrita só admin
CREATE POLICY "bloqueios_leitura_admin" ON bloqueios FOR SELECT
  USING (EXISTS(SELECT 1 FROM admins WHERE user_id = auth.uid()));
CREATE POLICY "bloqueios_escrita_admin" ON bloqueios FOR INSERT
  WITH CHECK (EXISTS(SELECT 1 FROM admins WHERE user_id = auth.uid()));
CREATE POLICY "bloqueios_update_admin" ON bloqueios FOR UPDATE
  USING (EXISTS(SELECT 1 FROM admins WHERE user_id = auth.uid()));

-- PROFILES: usuário lê/edita só seu próprio
CREATE POLICY "profiles_leitura_propria" ON profiles FOR SELECT
  USING (auth.uid() = id);
CREATE POLICY "profiles_admin_leitura_tudo" ON profiles FOR SELECT
  USING (EXISTS(SELECT 1 FROM admins WHERE user_id = auth.uid()));
CREATE POLICY "profiles_update_propria" ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- ADMINS: ninguém edita pelo frontend (só via painel Supabase)
CREATE POLICY "admins_leitura" ON admins FOR SELECT
  USING (EXISTS(SELECT 1 FROM admins WHERE user_id = auth.uid()));

-- AGENDAMENTOS: cliente cria/lê os próprios, admin lê/edita todos
CREATE POLICY "agendamentos_cliente_cria" ON agendamentos FOR INSERT
  WITH CHECK (auth.uid() = cliente_id);
CREATE POLICY "agendamentos_cliente_leitura" ON agendamentos FOR SELECT
  USING (auth.uid() = cliente_id);
CREATE POLICY "agendamentos_admin_leitura" ON agendamentos FOR SELECT
  USING (EXISTS(SELECT 1 FROM admins WHERE user_id = auth.uid()));
CREATE POLICY "agendamentos_admin_update" ON agendamentos FOR UPDATE
  USING (EXISTS(SELECT 1 FROM admins WHERE user_id = auth.uid()));
CREATE POLICY "agendamentos_cliente_update" ON agendamentos FOR UPDATE
  USING (auth.uid() = cliente_id AND status = 'aguardando_pagamento');

-- PAGAMENTOS: usuário lê só os próprios, admin lê todos, Edge Function cria/atualiza
CREATE POLICY "pagamentos_cliente_leitura" ON pagamentos FOR SELECT
  USING (EXISTS(
    SELECT 1 FROM agendamentos
    WHERE agendamentos.id = pagamentos.agendamento_id
    AND agendamentos.cliente_id = auth.uid()
  ));
CREATE POLICY "pagamentos_admin_leitura" ON pagamentos FOR SELECT
  USING (EXISTS(SELECT 1 FROM admins WHERE user_id = auth.uid()));
CREATE POLICY "pagamentos_admin_update" ON pagamentos FOR UPDATE
  USING (EXISTS(SELECT 1 FROM admins WHERE user_id = auth.uid()));

-- NOTIFICACOES: leitura só admin
CREATE POLICY "notificacoes_leitura_admin" ON notificacoes FOR SELECT
  USING (EXISTS(SELECT 1 FROM admins WHERE user_id = auth.uid()));

-- ========================================
-- FUNÇÃO SQL: BUSCAR HORÁRIOS DISPONÍVEIS
-- ========================================
CREATE OR REPLACE FUNCTION buscar_horarios_disponiveis(
  p_data DATE,
  p_servico_id UUID
)
RETURNS TABLE (
  hora_inicio TIME,
  hora_fim TIME,
  disponivel BOOLEAN
) AS $$
DECLARE
  v_duracao_minutos INT;
  v_dia_semana INT;
  v_disponibilidade_inicio TIME;
  v_disponibilidade_fim TIME;
BEGIN
  -- Obter duração do serviço
  SELECT duracao_minutos INTO v_duracao_minutos
  FROM servicos WHERE id = p_servico_id;

  IF v_duracao_minutos IS NULL THEN
    RETURN;
  END IF;

  -- Dia da semana (0=dom, 1=seg, ..., 6=sáb)
  v_dia_semana := EXTRACT(ISODOW FROM p_data) % 7;

  -- Horário de funcionamento do dia
  SELECT hora_inicio, hora_fim INTO v_disponibilidade_inicio, v_disponibilidade_fim
  FROM disponibilidade
  WHERE dia_semana = v_dia_semana;

  IF v_disponibilidade_inicio IS NULL THEN
    RETURN;
  END IF;

  -- Se for semana (seg-sex, dias 1-5), válido apenas após 17h
  IF v_dia_semana IN (1, 2, 3, 4, 5) THEN
    v_disponibilidade_inicio := GREATEST(v_disponibilidade_inicio, '17:00'::TIME);
  END IF;

  -- Gerar slots de 1 hora (podem ajustar a granularidade)
  FOR hora_inicio, hora_fim IN
    SELECT ts::TIME, (ts + (v_duracao_minutos || ' minutes')::INTERVAL)::TIME
    FROM GENERATE_SERIES(
      v_disponibilidade_inicio,
      v_disponibilidade_fim - (v_duracao_minutos || ' minutes')::INTERVAL,
      '1 hour'::INTERVAL
    ) AS ts
  LOOP
    -- Verificar se horário não está bloqueado e não tem agendamento
    disponivel := NOT EXISTS(
      SELECT 1 FROM bloqueios
      WHERE p_data::TIMESTAMP WITH TIME ZONE BETWEEN
            (p_data || ' ' || hora_inicio)::TIMESTAMP WITH TIME ZONE AND
            (p_data || ' ' || hora_fim)::TIMESTAMP WITH TIME ZONE
    )
    AND NOT EXISTS(
      SELECT 1 FROM agendamentos
      WHERE data_inicio::DATE = p_data
      AND data_inicio::TIME < (hora_inicio + (v_duracao_minutos || ' minutes')::INTERVAL)::TIME
      AND data_fim::TIME > hora_inicio
      AND status NOT IN ('cancelado')
    );

    RETURN NEXT;
  END LOOP;
END;
$$ LANGUAGE plpgsql STABLE;

-- ========================================
-- FUNÇÃO SQL: CALCULAR DISTÂNCIA ENTRE COORDENADAS
-- ========================================
CREATE OR REPLACE FUNCTION calcular_distancia(
  lat1 DECIMAL(10, 8),
  lng1 DECIMAL(11, 8),
  lat2 DECIMAL(10, 8),
  lng2 DECIMAL(11, 8)
)
RETURNS DECIMAL(10, 2) AS $$
BEGIN
  -- Fórmula de Haversine (distância em km)
  RETURN 111.2 * DEGREES(ACOS(
    COS(RADIANS(lat1)) * COS(RADIANS(lat2)) * COS(RADIANS(lng2 - lng1)) +
    SIN(RADIANS(lat1)) * SIN(RADIANS(lat2))
  ))::DECIMAL(10, 2);
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- ========================================
-- DADOS INICIAIS (exemplo)
-- ========================================

-- Serviços
INSERT INTO servicos (nome, descricao, duracao_minutos, preco_semana, preco_fim_semana) VALUES
('3 Horas de Festa', 'Festa com 3 horas de diversão', 180, 300.00, 400.00),
('4 Horas de Festa', 'Festa com 4 horas de diversão', 240, 400.00, 500.00),
('5 Horas de Festa', 'Festa com 5 horas de diversão', 300, 500.00, 600.00)
ON CONFLICT DO NOTHING;

-- Disponibilidade (semana seg-sex: 17h-22h, fim de semana sáb-dom: 10h-22h)
INSERT INTO disponibilidade (dia_semana, hora_inicio, hora_fim) VALUES
(1, '17:00'::TIME, '22:00'::TIME), -- segunda
(2, '17:00'::TIME, '22:00'::TIME), -- terça
(3, '17:00'::TIME, '22:00'::TIME), -- quarta
(4, '17:00'::TIME, '22:00'::TIME), -- quinta
(5, '17:00'::TIME, '22:00'::TIME), -- sexta
(6, '10:00'::TIME, '22:00'::TIME), -- sábado
(0, '10:00'::TIME, '22:00'::TIME)  -- domingo
ON CONFLICT DO NOTHING;

-- ========================================
-- TRIGGER: Criar profile automaticamente ao registrar
-- ========================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, nome, telefone)
  VALUES (new.id, new.raw_user_meta_data->>'name', new.raw_user_meta_data->>'phone');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
