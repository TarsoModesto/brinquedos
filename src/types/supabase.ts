// ========================================
// TIPOS SUPABASE (gerados do schema)
// ========================================
// Nota: Execute "npx supabase gen types typescript" para gerar tipos completos
// Por enquanto, vamos com tipos básicos

export type Database = {
  public: {
    Tables: {
      servicos: {
        Row: any;
        Insert: any;
        Update: any;
      };
      disponibilidade: {
        Row: any;
        Insert: any;
        Update: any;
      };
      bloqueios: {
        Row: any;
        Insert: any;
        Update: any;
      };
      profiles: {
        Row: any;
        Insert: any;
        Update: any;
      };
      agendamentos: {
        Row: any;
        Insert: any;
        Update: any;
      };
      pagamentos: {
        Row: any;
        Insert: any;
        Update: any;
      };
      notificacoes: {
        Row: any;
        Insert: any;
        Update: any;
      };
      admins: {
        Row: any;
        Insert: any;
        Update: any;
      };
    };
    Views: Record<string, any>;
    Functions: {
      buscar_horarios_disponiveis: {
        Args: {
          p_data: string;
          p_servico_id: string;
        };
        Returns: any[];
      };
      calcular_distancia: {
        Args: {
          lat1: number;
          lng1: number;
          lat2: number;
          lng2: number;
        };
        Returns: number;
      };
    };
  };
};
