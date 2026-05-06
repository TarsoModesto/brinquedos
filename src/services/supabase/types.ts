/**
 * Tipos derivados do schema do Supabase. Ajuste conforme novas colunas.
 */
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          nome: string;
          telefone: string | null;
          criado_em: string;
        };
        Insert: {
          id: string;
          nome?: string;
          telefone?: string | null;
          criado_em?: string;
        };
        Update: {
          nome?: string;
          telefone?: string | null;
        };
        Relationships: [];
      };
      admins: {
        Row: {
          id: string;
          user_id: string;
          criado_em: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          criado_em?: string;
        };
        Update: never;
        Relationships: [];
      };
      agendamentos: {
        Row: {
          id: string;
          user_id: string | null;
          nome: string;
          telefone: string;
          data: string;
          status: 'pending' | 'confirmed' | 'cancelled';
          criado_em: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          nome: string;
          telefone: string;
          data: string;
          status?: 'pending' | 'confirmed' | 'cancelled';
          criado_em?: string;
        };
        Update: {
          nome?: string;
          telefone?: string;
          status?: 'pending' | 'confirmed' | 'cancelled';
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      is_admin: {
        Args: { uid: string };
        Returns: boolean;
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
