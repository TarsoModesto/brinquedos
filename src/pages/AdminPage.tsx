import { useEffect, useState } from 'react';
import { agendamentosService, bloqueiosService } from '@/services/supabase';
import type { Agendamento, Bloqueio } from '@/types/database';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

export function AdminPage() {
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [bloqueios, setBloqueios] = useState<Bloqueio[]>([]);
  const [loading, setLoading] = useState(true);
  const [novaDataInicio, setNovaDataInicio] = useState('');
  const [novaDataFim, setNovaDataFim] = useState('');
  const [motivo, setMotivo] = useState('');

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      const [ags, blqs] = await Promise.all([
        agendamentosService.listarAdmin(),
        bloqueiosService.listar(),
      ]);
      setAgendamentos(ags || []);
      setBloqueios(blqs || []);
    } catch (err) {
      toast.error('Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmar = async (id: string) => {
    try {
      await agendamentosService.confirmar(id);
      toast.success('Agendamento confirmado');
      carregarDados();
    } catch (err) {
      toast.error('Erro ao confirmar');
    }
  };

  const handleCancelar = async (id: string) => {
    try {
      await agendamentosService.cancelar(id);
      toast.success('Agendamento cancelado');
      carregarDados();
    } catch (err) {
      toast.error('Erro ao cancelar');
    }
  };

  const handleBloquear = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!novaDataInicio || !novaDataFim) {
      toast.error('Preencha as datas');
      return;
    }

    try {
      await bloqueiosService.criar(
        {
          data_inicio: novaDataInicio,
          data_fim: novaDataFim,
          motivo,
        },
        '' // user_id será adicionado pelo RLS
      );
      toast.success('Data bloqueada');
      setNovaDataInicio('');
      setNovaDataFim('');
      setMotivo('');
      carregarDados();
    } catch (err) {
      toast.error('Erro ao bloquear data');
    }
  };

  if (loading) return <div className="text-center py-8">Carregando...</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-12">⚙️ Painel Admin</h1>

        {/* Seção de Agendamentos */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow p-8 mb-12"
        >
          <h2 className="text-2xl font-bold mb-6">📅 Agendamentos</h2>

          {agendamentos.length === 0 ? (
            <p className="text-gray-600">Nenhum agendamento ainda</p>
          ) : (
            <div className="space-y-4">
              {agendamentos.map((a) => (
                <motion.div
                  key={a.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="p-6 border-2 border-gray-200 rounded-lg hover:border-blue-300 transition"
                >
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-gray-500">Cliente</p>
                      <p className="font-bold">
                        {a.cliente?.nome || 'Não informado'}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Serviço</p>
                      <p className="font-bold">
                        {a.servico?.nome || 'Não informado'}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Data/Hora</p>
                      <p className="font-bold">
                        {new Date(a.data_inicio).toLocaleDateString('pt-BR')}{' '}
                        {new Date(a.data_inicio).toLocaleTimeString('pt-BR', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Valor</p>
                      <p className="font-bold text-green-600">
                        R$ {a.pagamento?.valor?.toLocaleString('pt-BR') || 'N/A'}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Status</p>
                      <p
                        className={`font-bold ${
                          a.status === 'confirmado'
                            ? 'text-green-600'
                            : a.status === 'cancelado'
                            ? 'text-red-600'
                            : 'text-yellow-600'
                        }`}
                      >
                        {a.status}
                      </p>
                    </div>
                  </div>

                  {a.status === 'aguardando_pagamento' && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleConfirmar(a.id)}
                        className="px-4 py-2 bg-green-600 text-white rounded text-sm hover:bg-green-700 transition"
                      >
                        ✅ Confirmar
                      </button>
                      <button
                        onClick={() => handleCancelar(a.id)}
                        className="px-4 py-2 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition"
                      >
                        ❌ Cancelar
                      </button>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </motion.section>

        {/* Seção de Bloqueios */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow p-8"
        >
          <h2 className="text-2xl font-bold mb-6">🚫 Bloquear Datas</h2>

          <form onSubmit={handleBloquear} className="mb-8 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Data Início
                </label>
                <input
                  type="date"
                  value={novaDataInicio}
                  onChange={(e) => setNovaDataInicio(e.target.value)}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Data Fim
                </label>
                <input
                  type="date"
                  value={novaDataFim}
                  onChange={(e) => setNovaDataFim(e.target.value)}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Motivo</label>
                <input
                  type="text"
                  value={motivo}
                  onChange={(e) => setMotivo(e.target.value)}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                  placeholder="Ex: Férias, Manutenção"
                />
              </div>
            </div>
            <button
              type="submit"
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-semibold"
            >
              Bloquear Período
            </button>
          </form>

          <div className="space-y-2">
            <h3 className="font-bold mb-3">Datas Bloqueadas:</h3>
            {bloqueios.length === 0 ? (
              <p className="text-gray-600">Nenhuma data bloqueada</p>
            ) : (
              bloqueios.map((b) => (
                <div key={b.id} className="p-3 border rounded bg-red-50">
                  <p>
                    <strong>{b.data_inicio}</strong> até{' '}
                    <strong>{b.data_fim}</strong>
                    {b.motivo && <span> — {b.motivo}</span>}
                  </p>
                </div>
              ))
            )}
          </div>
        </motion.section>
      </div>
    </div>
  );
}
