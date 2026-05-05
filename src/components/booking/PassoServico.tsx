import { motion } from 'framer-motion';
import { useBookingStore } from '@/store/bookingStore';

export function PassoServico() {
  const { servicos, setServico, proximoStep, isLoading } = useBookingStore();

  if (isLoading) {
    return <div className="text-center py-8 text-gray-600">Carregando serviços...</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <h2 className="text-2xl font-bold mb-6">Escolha o tempo de festa</h2>

      <div className="grid grid-cols-1 gap-4">
        {servicos.map((servico) => (
          <motion.button
            key={servico.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              setServico(servico);
              proximoStep();
            }}
            className="p-6 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition text-left"
          >
            <h3 className="font-bold text-lg mb-2">{servico.nome}</h3>
            <p className="text-gray-600 mb-4">{servico.descricao}</p>
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-500">
                ⏱️ {servico.duracao_minutos} minutos
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500">A partir de</p>
                <p className="text-2xl font-bold text-blue-600">
                  R$ {servico.preco_semana.toLocaleString('pt-BR')}
                </p>
              </div>
            </div>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}
