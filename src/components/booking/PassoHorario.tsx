import { motion } from 'framer-motion';
import { useBookingStore } from '@/store/bookingStore';

export function PassoHorario() {
  const { current, horariosDisponiveis, setHorario, proximoStep, stepAnterior, isLoading } = useBookingStore();

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin">⏳</div>
        <p className="text-gray-600 mt-2">Carregando horários...</p>
      </div>
    );
  }

  if (!horariosDisponiveis.length) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 font-semibold">
          Nenhum horário disponível nesta data
        </p>
        <p className="text-gray-600 mt-2">Escolha outra data</p>
        <button
          onClick={stepAnterior}
          className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Voltar
        </button>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h2 className="text-2xl font-bold mb-2">
        Escolha o horário
      </h2>
      <p className="text-gray-600 mb-6">
        📅 {current.data?.toLocaleDateString('pt-BR')}
      </p>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-8">
        {horariosDisponiveis.map((h, idx) => (
          <motion.button
            key={idx}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setHorario(h.hora_inicio);
              proximoStep();
            }}
            className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition font-semibold"
          >
            {h.hora_inicio}
          </motion.button>
        ))}
      </div>

      <div className="flex gap-4">
        <button
          onClick={stepAnterior}
          className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition"
        >
          Voltar
        </button>
      </div>
    </motion.div>
  );
}
