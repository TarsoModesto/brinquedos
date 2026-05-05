import { supabase } from '@/lib/supabase';
import type {
  Servico,
  Agendamento,
  Pagamento,
  Bloqueio,
  CreateAgendamentoInput,
  CreatePagamentoInput,
  CreateBloqueioInput,
  HorarioDisponivel,
  Profile,
} from '@/types/database';

// ========================================
// SERVIÇOS
// ========================================
export const servicosService = {
  async listar() {
    const { data, error } = await supabase
      .from('servicos')
      .select('*')
      .eq('ativo', true);
    if (error) throw error;
    return data as Servico[];
  },

  async obter(id: string) {
    const { data, error } = await supabase
      .from('servicos')
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data as Servico;
  },

  // Retorna o preço do serviço baseado no dia da semana
  getPreco(servico: Servico, data: Date): number {
    const diaSemana = data.getDay();
    // sábado=6, domingo=0 = fim de semana
    const ehFimDeSemana = diaSemana === 0 || diaSemana === 6;
    return ehFimDeSemana ? servico.preco_fim_semana : servico.preco_semana;
  },
};

// ========================================
// DISPONIBILIDADE / HORÁRIOS LIVRES
// ========================================
export const horariosService = {
  async buscarDisponiveis(
    data: Date,
    servicoId: string
  ): Promise<HorarioDisponivel[]> {
    const dataString = data.toISOString().split('T')[0]; // YYYY-MM-DD

    const { data: horarios, error } = await supabase.rpc(
      'buscar_horarios_disponiveis',
      {
        p_data: dataString,
        p_servico_id: servicoId,
      }
    );

    if (error) throw error;
    return horarios as HorarioDisponivel[];
  },

  // Validar se data está bloqueada
  async estaData(data: Date, userId: string): Promise<boolean> {
    const { data: admin, error: erroAdmin } = await supabase
      .from('admins')
      .select('id')
      .eq('user_id', userId)
      .single();

    if (erroAdmin || !admin) return false;

    const dataString = data.toISOString().split('T')[0];
    const { data: bloqueios, error } = await supabase
      .from('bloqueios')
      .select('*')
      .lte('data_inicio', dataString)
      .gte('data_fim', dataString);

    if (error) throw error;
    return (bloqueios?.length || 0) > 0;
  },

  // Validar se é data futura e respeita mínimo 1 dia
  isDataValida(data: Date): boolean {
    const amanha = new Date();
    amanha.setDate(amanha.getDate() + 1);
    amanha.setHours(0, 0, 0, 0);

    data.setHours(0, 0, 0, 0);
    return data >= amanha;
  },

  // Validar se é semana (seg-sex após 17h) ou fim de semana
  isHorarioValido(data: Date, horario: string): boolean {
    const diaSemana = data.getDay();
    const [hora] = horario.split(':');
    const horaNum = parseInt(hora);

    // Semana: seg=1 a sex=5
    const ehSemana = diaSemana >= 1 && diaSemana <= 5;

    if (ehSemana) {
      // Apenas após 17h
      return horaNum >= 17;
    }
    // Fim de semana: o dia todo está ok
    return true;
  },
};

// ========================================
// AGENDAMENTOS
// ========================================
export const agendamentosService = {
  async criar(input: CreateAgendamentoInput, userId: string) {
    const servico = await servicosService.obter(input.servico_id);

    // Calcular data_fim baseado na duração
    const dataInicio = new Date(input.data_inicio);
    const dataFim = new Date(
      dataInicio.getTime() + servico.duracao_minutos * 60 * 1000
    );

    // Determinar se precisa aprovação (se for para hoje)
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    dataInicio.setHours(0, 0, 0, 0);
    const requerAprovacao = dataInicio.getTime() === hoje.getTime();

    const { data, error } = await supabase
      .from('agendamentos')
      .insert({
        cliente_id: userId,
        servico_id: input.servico_id,
        data_inicio: input.data_inicio,
        data_fim: dataFim.toISOString(),
        zona_cliente: input.zona_cliente,
        lat_cliente: input.lat_cliente,
        lng_cliente: input.lng_cliente,
        observacoes: input.observacoes,
        requer_aprovacao_admin: requerAprovacao,
        status: 'aguardando_pagamento',
      })
      .select()
      .single();

    if (error) throw error;
    return data as Agendamento;
  },

  async listarMeus(userId: string) {
    const { data, error } = await supabase
      .from('agendamentos')
      .select(`
        *,
        servico:servicos(*),
        pagamento:pagamentos(*)
      `)
      .eq('cliente_id', userId)
      .order('data_inicio', { ascending: false });

    if (error) throw error;
    return data;
  },

  async listarAdmin() {
    const { data, error } = await supabase
      .from('agendamentos')
      .select(`
        *,
        servico:servicos(*),
        cliente:profiles(*),
        pagamento:pagamentos(*)
      `)
      .order('data_inicio', { ascending: true });

    if (error) throw error;
    return data;
  },

  async obter(id: string) {
    const { data, error } = await supabase
      .from('agendamentos')
      .select(`
        *,
        servico:servicos(*),
        cliente:profiles(*),
        pagamento:pagamentos(*)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  async atualizar(id: string, atualizacoes: any) {
    const { data, error } = await supabase
      .from('agendamentos')
      .update(atualizacoes)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as Agendamento;
  },

  async cancelar(id: string) {
    return this.atualizar(id, { status: 'cancelado' });
  },

  async confirmar(id: string) {
    return this.atualizar(id, { status: 'confirmado' });
  },
};

// ========================================
// PAGAMENTOS
// ========================================
export const pagamentosService = {
  async criar(input: CreatePagamentoInput) {
    const { data, error } = await supabase
      .from('pagamentos')
      .insert({
        agendamento_id: input.agendamento_id,
        metodo: input.metodo,
        valor: 0, // será preenchido pela Edge Function
        status: 'pendente',
        parcelas: input.parcelas || 1,
        chave_pix_utilizada: input.chave_pix,
      })
      .select()
      .single();

    if (error) throw error;
    return data as Pagamento;
  },

  async obter(agendamentoId: string) {
    const { data, error } = await supabase
      .from('pagamentos')
      .select('*')
      .eq('agendamento_id', agendamentoId)
      .single();

    if (error) throw error;
    return data as Pagamento;
  },

  // Chamar Edge Function para gerar preferência MP
  async criarPreferenciaMercadoPago(agendamentoId: string) {
    const { data, error } = await supabase.functions.invoke(
      'criar-preferencia-mp',
      {
        body: { agendamento_id: agendamentoId },
      }
    );

    if (error) throw error;
    return data;
  },

  // Gerar QR Code PIX (chave estática)
  gerarQRCodePIX(chavePix: string): string {
    // Nota: isso é um placeholder
    // Na prática, você geraria via uma API de QR Code
    // Por enquanto, retorna a chave
    return chavePix;
  },
};

// ========================================
// BLOQUEIOS
// ========================================
export const bloqueiosService = {
  async criar(input: CreateBloqueioInput, userId: string) {
    const { data, error } = await supabase
      .from('bloqueios')
      .insert({
        data_inicio: input.data_inicio,
        data_fim: input.data_fim,
        motivo: input.motivo,
        criado_por: userId,
      })
      .select()
      .single();

    if (error) throw error;
    return data as Bloqueio;
  },

  async listar() {
    const { data, error } = await supabase
      .from('bloqueios')
      .select('*')
      .order('data_inicio', { ascending: true });

    if (error) throw error;
    return data as Bloqueio[];
  },

  async deletar(id: string) {
    const { error } = await supabase.from('bloqueios').delete().eq('id', id);

    if (error) throw error;
  },
};

// ========================================
// PROFILES
// ========================================
export const profilesService = {
  async obterMeu(userId: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw error;
    return data as Profile;
  },

  async atualizar(userId: string, atualizacoes: any) {
    const { data, error } = await supabase
      .from('profiles')
      .update(atualizacoes)
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return data as Profile;
  },
};
