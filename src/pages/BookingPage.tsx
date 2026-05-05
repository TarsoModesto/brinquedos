import { useEffect } from 'react';
import { useBookingStore } from '@/store/bookingStore';
import { PassoServico } from '@/components/booking/PassoServico';
import { PassoData } from '@/components/booking/PassoData';
import { PassoHorario } from '@/components/booking/PassoHorario';
import { PassoConfirmacao } from '@/components/booking/PassoConfirmacao';
import { motion } from 'framer-motion';

export function BookingPage() {
  const { current, carregarServicos, error } = useBookingStore();

  useEffect(() => {
    carregarServicos();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-2">🎉 Agende sua Festa!</h1>
          <p className="text-lg text-gray-600">
            Diversão garantida para as crianças
          </p>
        </motion.div>

        {/* Progresso */}
        <div className="mb-8 flex justify-between items-center">
          {['Serviço', 'Data', 'Horário', 'Confirmação'].map((step, idx) => (
            <div key={step} className="flex-1 flex items-center">
              <motion.div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition ${
                  current.step === ['servico', 'data', 'horario', 'confirmacao'][idx]
                    ? 'bg-blue-600 text-white'
                    : ['servico', 'data', 'horario', 'confirmacao'].indexOf(current.step) > idx
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-300 text-gray-700'
                }`}
              >
                {idx + 1}
              </motion.div>
              <span className="ml-2 text-sm text-gray-700">{step}</span>
              {idx < 3 && <div className="flex-1 h-1 bg-gray-300 mx-2" />}
            </div>
          ))}
        </div>

        {/* Conteúdo */}
        <motion.div
          key={current.step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="bg-white rounded-lg shadow-xl p-8"
        >
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
              {error}
            </div>
          )}

          {current.step === 'servico' && <PassoServico />}
          {current.step === 'data' && <PassoData />}
          {current.step === 'horario' && <PassoHorario />}
          {current.step === 'confirmacao' && <PassoConfirmacao />}
        </motion.div>
      </div>
    </div>
  );
}
