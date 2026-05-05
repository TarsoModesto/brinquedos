// ========================================
// TIPOS DO BANCO DE DADOS
// ========================================

export interface Servico {
  id: string;
  nome: string;
  descricao?: string;
  duracao_minutos: number; // 180, 240, 300
  preco_semana: number;
  preco_fim_semana: number;
  ativo: boolean;
  criado_em: string;
  atualizado_em: string;
}

export interface Disponibilidade {
  id: string;
  dia_semana: number; // 0=dom, 1=seg, ..., 6=sáb
  hora_inicio: string; // HH:MM
  hora_fim: string; // HH:MM
  criado_em: string;
}

export interface Bloqueio {
  id: string;
  data_inicio: string; // YYYY-MM-DD
  data_fim: string; // YYYY-MM-DD
  motivo?: string;
  criado_em: string;
  criado_por: string;
}

export interface Profile {
  id: string; // UUID do auth.users
  nome?: string;
  telefone?: string;
  endereco?: string;
  zona_atendimento?: string;
  lat?: number;
  lng?: number;
  cpf_cnpj?: string;
  criado_em: string;
  atualizado_em: string;
}

export interface Admin {
  id: string;
  user_id: string;
  criado_em: string;
}

export type AgendamentoStatus =
  | 'aguardando_pagamento'
  | 'confirmado'
  | 'realizado'
  | 'cancelado';

export interface Agendamento {
  id: string;
  cliente_id: string;
  servico_id: string;
  data_inicio: string; // ISO 8601 timestamp
  data_fim: string; // ISO 8601 timestamp
  status: AgendamentoStatus;
  zona_cliente?: string;
  lat_cliente?: number;
  lng_cliente?: number;
  observacoes?: string;
  requer_aprovacao_admin: boolean;
  criado_em: string;
  atualizado_em: string;

  // Joins (opcionais)
  servico?: Servico;
  cliente?: Profile;
  pagamento?: Pagamento;
}

export type PagamentoMetodo = 'pix' | 'cartao';
export type PagamentoStatus = 'pendente' | 'aprovado' | 'recusado';

export interface Pagamento {
  id: string;
  agendamento_id: string;
  metodo: PagamentoMetodo;
  valor: number;
  status: PagamentoStatus;
  mp_payment_id?: string; // Mercado Pago
  juros: number;
  parcelas: number;
  chave_pix_utilizada?: string;
  criado_em: string;
  atualizado_em: string;
}

export interface Notificacao {
  id: string;
  agendamento_id?: string;
  usuario_id: string;
  tipo: 'confirmacao' | 'lembrete' | 'cancelamento';
  assunto: string;
  corpo: string;
  status: 'enviada' | 'falha';
  tentativas: number;
  criado_em: string;
}

// ========================================
// TIPOS DE ENTRADA (REQUEST)
// ========================================

export interface CreateAgendamentoInput {
  servico_id: string;
  data_inicio: string; // ISO 8601
  zona_cliente?: string;
  lat_cliente?: number;
  lng_cliente?: number;
  observacoes?: string;
}

export interface UpdateAgendamentoInput {
  status?: AgendamentoStatus;
  observacoes?: string;
  requer_aprovacao_admin?: boolean;
}

export interface CreatePagamentoInput {
  agendamento_id: string;
  metodo: PagamentoMetodo;
  parcelas?: number; // só para cartão
  chave_pix?: string; // para validação
}

export interface CreateBloqueioInput {
  data_inicio: string; // YYYY-MM-DD
  data_fim: string; // YYYY-MM-DD
  motivo?: string;
}

// ========================================
// TIPOS DE RESPOSTA (helpers)
// ========================================

export interface HorarioDisponivel {
  hora_inicio: string; // HH:MM
  hora_fim: string; // HH:MM
  disponivel: boolean;
}

export interface AgendamentoComDetalhes extends Agendamento {
  servico: Servico;
  cliente: Profile;
  pagamento?: Pagamento;
  preco_final: number; // com juros se aplicável
}
