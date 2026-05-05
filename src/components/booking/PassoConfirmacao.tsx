import { useState } from 'react';
import { motion } from 'framer-motion';
import { useBookingStore } from '@/store/bookingStore';
import { useAuthStore } from '@/store/authStore';
import { agendamentosService, servicosService } from '@/services/supabase';
import { QRCodeSVG } from 'qrcode.react';
import { toast } from 'sonner';

export function PassoConfirmacao() {
  const { current, stepAnterior, resetarFluxo } = useBookingStore();
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [metodoSelecionado, setMetodoSelecionado] = useState<'pix' | 'cartao'>('pix');
  const [agendamentoCriado, setAgendamentoCriado] = useState(false);

  if (!current.servico || !current.data) {
    return <div className="text-center py-8">Dados incompletos</div>;
  }

  const servico = current.servico;
  const preco = servicosService.getPreco(servico, current.data);
  const pixChave = import.meta.env.VITE_PIX_CHAVE || 'brinquedos@miniparque.com';

  const handleAgendar = async () => {
    if (!user) {
      toast.error('Você precisa estar logado');
      return;
    }

    setLoading(true);
    try {
      const dataInicio = new Date(
        current.data!.getFullYear(),
        current.data!.getMonth(),
        current.data!.getDate(),
        parseInt(current.horario!.split(':')[0]),
        0
      );

      await agendamentosService.criar(
        {
          servico_id: servico.id,
          data_inicio: dataInicio.toISOString(),
          zona_cliente: current.zona,
          lat_cliente: current.lat,
          lng_cliente: current.lng,
          observacoes: current.observacoes,
        },
        user.id
      );

      setAgendamentoCriado(true);
      toast.success('Agendamento criado com sucesso!');
    } catch (err) {
      toast.error('Erro ao criar agendamento: ' + (err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  if (agendamentoCriado) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-8"
      >
        <div className="text-6xl mb-4">✅</div>
        <h3 className="text-2xl font-bold mb-2">Agendamento Confirmado!</h3>
        <p className="text-gray-600 mb-8">
          {metodoSelecionado === 'pix'
            ? 'Escaneie o QR code abaixo para pagar'
            : 'Clique no botão abaixo para pagar com cartão'}
        </p>

        {metodoSelecionado === 'pix' && (
          <div className="flex justify-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="p-4 bg-white border-2 border-blue-500 rounded-lg"
            >
              <QRCodeSVG value={pixChave} size={256} />
            </motion.div>
          </div>
        )}

        <div className="bg-blue-50 p-6 rounded-lg mb-8">
          <p className="text-sm text-gray-600 mb-2">Chave PIX:</p>
          <p className="font-mono text-sm break-all mb-4">{pixChave}</p>
          <button
            onClick={() => navigator.clipboard.writeText(pixChave)}
            className="text-blue-600 text-sm hover:underline"
          >
            Copiar
          </button>
        </div>

        <div className="text-center mb-8">
          <p className="text-sm text-gray-600">Total a pagar:</p>
          <p className="text-4xl font-bold text-green-600">
            R$ {preco.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
        </div>

        <button
          onClick={() => {
            resetarFluxo();
          }}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition w-full"
        >
          Voltar ao Início
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h2 className="text-2xl font-bold mb-6">Confirme seu agendamento</h2>

      {/* Resumo */}
      <div className="bg-gray-50 p-6 rounded-lg mb-8 border-2 border-gray-200">
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600">Serviço:</span>
            <span className="font-semibold">{servico.nome}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Data:</span>
            <span className="font-semibold">
              {current.data?.toLocaleDateString('pt-BR')}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Horário:</span>
            <span className="font-semibold">{current.horario}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Duração:</span>
            <span className="font-semibold">{servico.duracao_minutos} min</span>
          </div>
          <div className="border-t-2 border-gray-300 pt-3 flex justify-between">
            <span className="text-lg font-bold">Total:</span>
            <span className="text-2xl font-bold text-blue-600">
              R$ {preco.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      </div>

      {/* Método de pagamento */}
      <div className="mb-8">
        <h3 className="font-bold mb-4">Escolha o método de pagamento</h3>
        <motion.button
          onClick={() => setMetodoSelecionado('pix')}
          className={`w-full p-4 border-2 rounded-lg mb-3 transition font-semibold text-left ${
            metodoSelecionado === 'pix'
              ? 'border-blue-600 bg-blue-50'
              : 'border-gray-300 hover:border-gray-400'
          }`}
        >
          💳 PIX (Imediato, sem juros)
        </motion.button>
        <button
          onClick={() => setMetodoSelecionado('cartao')}
          disabled
          className={`w-full p-4 border-2 rounded-lg transition font-semibold text-left opacity-50 cursor-not-allowed ${
            metodoSelecionado === 'cartao'
              ? 'border-blue-600 bg-blue-50'
              : 'border-gray-300'
          }`}
        >
          💰 Cartão (em breve)
        </button>
      </div>

      {/* Botões */}
      <div className="flex gap-4">
        <button
          onClick={stepAnterior}
          disabled={loading}
          className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-lg font-semibold hover:bg-gray-50 disabled:opacity-50 transition"
        >
          Voltar
        </button>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleAgendar}
          disabled={loading}
          className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50 transition"
        >
          {loading ? 'Processando...' : 'Confirmar e Pagar'}
        </motion.button>
      </div>
    </motion.div>
  );
}
