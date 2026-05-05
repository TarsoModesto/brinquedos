-- ========================================
-- BRINQUEDOS MINI PARQUE - SCHEMA COMPLETO (CORRIGIDO)
-- ========================================

-- 1. TABELA: SERVIÇOS
CREATE TABLE IF NOT EXISTS servicos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome VARCHAR(100) NOT NULL,
  descricao TEXT,
  duracao_minutos INT NOT NULL,
  preco_semana DECIMAL(10, 2) NOT NULL,
  preco_fim_semana DECIMAL(10, 2) NOT NULL,
  ativo BOOLEAN DEFAULT TRUE,
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT duracao_positiva CHECK (duracao_minutos > 0),
  CONSTRAINT precos_positivos CHECK (preco_semana > 0 AND preco_fim_semana > 0)
);

-- 2. TABELA: DISPONIBILIDADE
CREATE TABLE IF NOT EXISTS disponibilidade (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dia_semana INT NOT NULL,
  hora_inicio TIME NOT NULL,
  hora_fim TIME NOT NULL,
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT dia_valido CHECK (dia_semana >= 0 AND dia_semana <= 6),
  CONSTRAINT hora_valida CHECK (hora_inicio < hora_fim),
  UNIQUE(dia_semana)
);

-- 3. TABELA: BLOQUEIOS
CREATE TABLE IF NOT EXISTS bloqueios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  data_inicio DATE NOT NULL,
  data_fim DATE NOT NULL,
  motivo VARCHAR(255),
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  criado_por UUID NOT NULL REFERENCES auth.users(id),
  CONSTRAINT datas_bloqueio CHECK (data_inicio <= data_fim)
);

-- 4. TABELA: PROFILES
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nome VARCHAR(255),
  telefone VARCHAR(20),
  endereco VARCHAR(500),
  zona_atendimento VARCHAR(100),
  lat DECIMAL(10, 8),
  lng DECIMAL(11, 8),
  cpf_cnpj VARCHAR(20),
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. TABELA: ADMINS
CREATE TABLE IF NOT EXISTS admins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. TABELA: AGENDAMENTOS
CREATE TABLE IF NOT EXISTS agendamentos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cliente_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  servico_id UUID NOT NULL REFERENCES servicos(id),
  data_inicio TIMESTAMP WITH TIME ZONE NOT NULL,
  data_fim TIMESTAMP WITH TIME ZONE NOT NULL,
  status VARCHAR(50) DEFAULT 'aguardando_pagamento',
  zona_cliente VARCHAR(100),
  lat_cliente DECIMAL(10, 8),
  lng_cliente DECIMAL(11, 8),
  observacoes TEXT,
  requer_aprovacao_admin BOOLEAN DEFAULT FALSE,
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT data_futura CHECK (data_inicio > NOW()),
  CONSTRAINT status_valido CHECK (status IN ('aguardando_pagamento', 'confirmado', 'realizado', 'cancelado'))
);

-- 7. TABELA: PAGAMENTOS
CREATE TABLE IF NOT EXISTS pagamentos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agendamento_id UUID NOT NULL UNIQUE REFERENCES agendamentos(id) ON DELETE CASCADE,
  metodo VARCHAR(50) NOT NULL,
  valor DECIMAL(10, 2) NOT NULL,
  status VARCHAR(50) DEFAULT 'pendente',
  mp_payment_id VARCHAR(100),
  juros DECIMAL(10, 2) DEFAULT 0,
  parcelas INT DEFAULT 1,
  chave_pix_utilizada VARCHAR(255),
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT valor_positivo CHECK (valor > 0),
  CONSTRAINT parcelas_validas CHECK (parcelas >= 1 AND parcelas <= 12)
);

-- 8. TABELA: NOTIFICACOES
CREATE TABLE IF NOT EXISTS notificacoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agendamento_id UUID REFERENCES agendamentos(id) ON DELETE CASCADE,
  usuario_id UUID NOT NULL REFERENCES auth.users(id),
  tipo VARCHAR(50) NOT NULL,
  assunto VARCHAR(255),
  corpo TEXT,
  status VARCHAR(50) DEFAULT 'enviada',
  tentativas INT DEFAULT 1,
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- ÍNDICES (MELHOR PERFORMANCE)
-- ========================================
CREATE INDEX IF NOT EXISTS idx_agendamentos_cliente ON agendamentos(cliente_id);
CREATE INDEX IF NOT EXISTS idx_agendamentos_servico ON agendamentos(servico_id);
CREATE INDEX IF NOT EXISTS idx_agendamentos_data ON agendamentos(data_inicio);
CREATE INDEX IF NOT EXISTS idx_pagamentos_agendamento ON pagamentos(agendamento_id);
CREATE INDEX IF NOT EXISTS idx_pagamentos_status ON pagamentos(status);
CREATE INDEX IF NOT EXISTS idx_notificacoes_agendamento ON notificacoes(agendamento_id);

-- ========================================
-- ROW LEVEL SECURITY (RLS)
-- ========================================

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

-- ADMINS: ninguém edita pelo frontend
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

-- PAGAMENTOS: usuário lê só os próprios, admin lê todos
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
  SELECT duracao_minutos INTO v_duracao_minutos
  FROM servicos WHERE id = p_servico_id;

  IF v_duracao_minutos IS NULL THEN
    RETURN;
  END IF;

  v_dia_semana := EXTRACT(ISODOW FROM p_data) % 7;

  SELECT hora_inicio, hora_fim INTO v_disponibilidade_inicio, v_disponibilidade_fim
  FROM disponibilidade
  WHERE dia_semana = v_dia_semana;

  IF v_disponibilidade_inicio IS NULL THEN
    RETURN;
  END IF;

  IF v_dia_semana IN (1, 2, 3, 4, 5) THEN
    v_disponibilidade_inicio := GREATEST(v_disponibilidade_inicio, '17:00'::TIME);
  END IF;

  FOR hora_inicio, hora_fim IN
    SELECT ts::TIME, (ts + (v_duracao_minutos || ' minutes')::INTERVAL)::TIME
    FROM GENERATE_SERIES(
      v_disponibilidade_inicio,
      v_disponibilidade_fim - (v_duracao_minutos || ' minutes')::INTERVAL,
      '1 hour'::INTERVAL
    ) AS ts
  LOOP
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
-- DADOS INICIAIS
-- ========================================

INSERT INTO servicos (nome, descricao, duracao_minutos, preco_semana, preco_fim_semana) VALUES
('3 Horas de Festa', 'Festa com 3 horas de diversão', 180, 300.00, 400.00),
('4 Horas de Festa', 'Festa com 4 horas de diversão', 240, 400.00, 500.00),
('5 Horas de Festa', 'Festa com 5 horas de diversão', 300, 500.00, 600.00)
ON CONFLICT DO NOTHING;

INSERT INTO disponibilidade (dia_semana, hora_inicio, hora_fim) VALUES
(1, '17:00'::TIME, '22:00'::TIME),
(2, '17:00'::TIME, '22:00'::TIME),
(3, '17:00'::TIME, '22:00'::TIME),
(4, '17:00'::TIME, '22:00'::TIME),
(5, '17:00'::TIME, '22:00'::TIME),
(6, '10:00'::TIME, '22:00'::TIME),
(0, '10:00'::TIME, '22:00'::TIME)
ON CONFLICT DO NOTHING;

-- ========================================
-- TRIGGER: Criar profile automaticamente
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
