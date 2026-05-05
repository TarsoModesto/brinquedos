import { create } from 'zustand';
import type { Servico, HorarioDisponivel } from '@/types/database';
import { horariosService, servicosService } from '@/services/supabase';

interface BookingStep {
  step: 'servico' | 'data' | 'horario' | 'confirmacao';
  servico?: Servico;
  data?: Date;
  horario?: string;
  zona?: string;
  lat?: number;
  lng?: number;
  observacoes?: string;
}

interface BookingStoreState {
  current: BookingStep;
  isLoading: boolean;
  error: string | null;
  servicos: Servico[];
  horariosDisponiveis: HorarioDisponivel[];

  setServico: (servico: Servico) => void;
  setData: (data: Date) => Promise<void>;
  setHorario: (horario: string) => void;
  setZona: (zona: string) => void;
  setLocalizacao: (lat: number, lng: number) => void;
  setObservacoes: (obs: string) => void;
  proximoStep: () => void;
  stepAnterior: () => void;
  resetarFluxo: () => void;
  carregarServicos: () => Promise<void>;
}

const initialStep: BookingStep = { step: 'servico' };

export const useBookingStore = create<BookingStoreState>((set, get) => ({
  current: initialStep,
  isLoading: false,
  error: null,
  servicos: [],
  horariosDisponiveis: [],

  setServico: (servico) => {
    set((state) => ({
      current: { ...state.current, servico },
    }));
  },

  setData: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const { current } = get();
      const horarios = await horariosService.buscarDisponiveis(
        data,
        current.servico?.id || ''
      );
      set((state) => ({
        current: { ...state.current, data },
        horariosDisponiveis: horarios.filter((h) => h.disponivel),
        isLoading: false,
      }));
    } catch (err) {
      set({
        error: 'Erro ao carregar horários disponíveis',
        isLoading: false,
      });
    }
  },

  setHorario: (horario) => {
    set((state) => ({
      current: { ...state.current, horario },
    }));
  },

  setZona: (zona) => {
    set((state) => ({
      current: { ...state.current, zona },
    }));
  },

  setLocalizacao: (lat, lng) => {
    set((state) => ({
      current: { ...state.current, lat, lng },
    }));
  },

  setObservacoes: (observacoes) => {
    set((state) => ({
      current: { ...state.current, observacoes },
    }));
  },

  proximoStep: () => {
    const { current } = get();
    const steps: BookingStep['step'][] = [
      'servico',
      'data',
      'horario',
      'confirmacao',
    ];
    const nextIndex = steps.indexOf(current.step) + 1;
    if (nextIndex < steps.length) {
      set((state) => ({
        current: { ...state.current, step: steps[nextIndex] },
      }));
    }
  },

  stepAnterior: () => {
    const { current } = get();
    const steps: BookingStep['step'][] = [
      'servico',
      'data',
      'horario',
      'confirmacao',
    ];
    const prevIndex = steps.indexOf(current.step) - 1;
    if (prevIndex >= 0) {
      set((state) => ({
        current: { ...state.current, step: steps[prevIndex] },
      }));
    }
  },

  resetarFluxo: () => {
    set({ current: initialStep, horariosDisponiveis: [], error: null });
  },

  carregarServicos: async () => {
    set({ isLoading: true });
    try {
      const servicos = await servicosService.listar();
      set({ servicos, isLoading: false });
    } catch (err) {
      set({
        error: 'Erro ao carregar serviços',
        isLoading: false,
      });
    }
  },
}));
