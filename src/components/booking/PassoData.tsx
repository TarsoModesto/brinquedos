import { useState } from 'react';
import { motion } from 'framer-motion';
import { useBookingStore } from '@/store/bookingStore';
import { horariosService } from '@/services/supabase';
import { ChevronLeft, ChevronRight } from 'lucide-react';

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

export function PassoData() {
  const { current, setData, proximoStep, stepAnterior, isLoading } = useBookingStore();
  const [mesExibido, setMesExibido] = useState(new Date());

  const diasMes = getDiasDoMes(mesExibido);

  const handleClickDia = async (dia: number) => {
    const data = new Date(mesExibido.getFullYear(), mesExibido.getMonth(), dia);

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
        <button
          onClick={() =>
            setMesExibido(
              new Date(mesExibido.getFullYear(), mesExibido.getMonth() - 1)
            )
          }
          className="p-2 hover:bg-gray-100 rounded"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h3 className="font-bold text-lg">
          {mesExibido.toLocaleDateString('pt-BR', {
            month: 'long',
            year: 'numeric',
          })}
        </h3>
        <button
          onClick={() =>
            setMesExibido(
              new Date(mesExibido.getFullYear(), mesExibido.getMonth() + 1)
            )
          }
          className="p-2 hover:bg-gray-100 rounded"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Grid de dias */}
      <div className="grid grid-cols-7 gap-2 mb-8">
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
            className={`p-4 rounded font-semibold transition ${
              dia
                ? 'hover:bg-blue-500 hover:text-white cursor-pointer bg-gray-50'
                : 'opacity-0'
            }`}
          >
            {dia}
          </motion.button>
        ))}
      </div>

      {/* Botões */}
      <div className="flex gap-4">
        <button
          onClick={stepAnterior}
          className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition"
        >
          Voltar
        </button>
        <button
          disabled={isLoading}
          className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 transition"
        >
          {isLoading ? 'Carregando...' : 'Próximo'}
        </button>
      </div>
    </motion.div>
  );
}
