export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      cadastros: {
        Row: {
          ativo: boolean | null
          cep: string | null
          cidade: string | null
          cpf_cnpj: string | null
          created_at: string
          email: string | null
          endereco: string | null
          estado: string | null
          id: string
          nome: string
          observacoes: string | null
          pessoa: string | null
          status: string | null
          telefone: string | null
          tipo: string
          updated_at: string
          user_id: string
        }
        Insert: {
          ativo?: boolean | null
          cep?: string | null
          cidade?: string | null
          cpf_cnpj?: string | null
          created_at?: string
          email?: string | null
          endereco?: string | null
          estado?: string | null
          id?: string
          nome: string
          observacoes?: string | null
          pessoa?: string | null
          status?: string | null
          telefone?: string | null
          tipo: string
          updated_at?: string
          user_id: string
        }
        Update: {
          ativo?: boolean | null
          cep?: string | null
          cidade?: string | null
          cpf_cnpj?: string | null
          created_at?: string
          email?: string | null
          endereco?: string | null
          estado?: string | null
          id?: string
          nome?: string
          observacoes?: string | null
          pessoa?: string | null
          status?: string | null
          telefone?: string | null
          tipo?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      estoques: {
        Row: {
          created_at: string | null
          data: string
          id: string
          nome_produto: string
          quantidade: number
          quantidade_bruta: number
          quantidade_liquida: number
          status: string | null
          unidade_medida: string
          updated_at: string | null
          user_id: string
          valor_total: number
          valor_unitario: number
        }
        Insert: {
          created_at?: string | null
          data?: string
          id?: string
          nome_produto: string
          quantidade?: number
          quantidade_bruta?: number
          quantidade_liquida?: number
          status?: string | null
          unidade_medida: string
          updated_at?: string | null
          user_id: string
          valor_total?: number
          valor_unitario?: number
        }
        Update: {
          created_at?: string | null
          data?: string
          id?: string
          nome_produto?: string
          quantidade?: number
          quantidade_bruta?: number
          quantidade_liquida?: number
          status?: string | null
          unidade_medida?: string
          updated_at?: string | null
          user_id?: string
          valor_total?: number
          valor_unitario?: number
        }
        Relationships: []
      }
      lancamentos: {
        Row: {
          categoria: string | null
          cliente_id: string | null
          created_at: string
          data: string
          descricao: string
          fornecedor_id: string | null
          id: string
          lancamento_pai_id: string | null
          meses_recorrencia: number | null
          metodo_pagamento: string | null
          observacoes: string | null
          recorrente: boolean | null
          status: string | null
          subcategoria: string | null
          tipo: string
          updated_at: string
          user_id: string
          valor: number
        }
        Insert: {
          categoria?: string | null
          cliente_id?: string | null
          created_at?: string
          data?: string
          descricao: string
          fornecedor_id?: string | null
          id?: string
          lancamento_pai_id?: string | null
          meses_recorrencia?: number | null
          metodo_pagamento?: string | null
          observacoes?: string | null
          recorrente?: boolean | null
          status?: string | null
          subcategoria?: string | null
          tipo: string
          updated_at?: string
          user_id: string
          valor: number
        }
        Update: {
          categoria?: string | null
          cliente_id?: string | null
          created_at?: string
          data?: string
          descricao?: string
          fornecedor_id?: string | null
          id?: string
          lancamento_pai_id?: string | null
          meses_recorrencia?: number | null
          metodo_pagamento?: string | null
          observacoes?: string | null
          recorrente?: boolean | null
          status?: string | null
          subcategoria?: string | null
          tipo?: string
          updated_at?: string
          user_id?: string
          valor?: number
        }
        Relationships: [
          {
            foreignKeyName: "fk_lancamentos_cliente"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "cadastros"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_lancamentos_fornecedor"
            columns: ["fornecedor_id"]
            isOneToOne: false
            referencedRelation: "cadastros"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lancamentos_lancamento_pai_id_fkey"
            columns: ["lancamento_pai_id"]
            isOneToOne: false
            referencedRelation: "lancamentos"
            referencedColumns: ["id"]
          },
        ]
      }
      lembretes: {
        Row: {
          categoria: string | null
          created_at: string
          data_lembrete: string
          data_vencimento: string | null
          descricao: string | null
          hora_lembrete: string | null
          id: string
          prioridade: string | null
          status: string | null
          titulo: string
          updated_at: string
          user_id: string
        }
        Insert: {
          categoria?: string | null
          created_at?: string
          data_lembrete: string
          data_vencimento?: string | null
          descricao?: string | null
          hora_lembrete?: string | null
          id?: string
          prioridade?: string | null
          status?: string | null
          titulo: string
          updated_at?: string
          user_id: string
        }
        Update: {
          categoria?: string | null
          created_at?: string
          data_lembrete?: string
          data_vencimento?: string | null
          descricao?: string | null
          hora_lembrete?: string | null
          id?: string
          prioridade?: string | null
          status?: string | null
          titulo?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      ponto_equilibrio: {
        Row: {
          created_at: string | null
          custos_variaveis: number
          faturamento_estimado: number
          gastos_fixos: number
          id: string
          margem_contribuicao: number | null
          nome_projecao: string
          ponto_equilibrio_calculado: number | null
          pro_labore: number | null
          saidas_nao_operacionais: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          custos_variaveis?: number
          faturamento_estimado?: number
          gastos_fixos?: number
          id?: string
          margem_contribuicao?: number | null
          nome_projecao: string
          ponto_equilibrio_calculado?: number | null
          pro_labore?: number | null
          saidas_nao_operacionais?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          custos_variaveis?: number
          faturamento_estimado?: number
          gastos_fixos?: number
          id?: string
          margem_contribuicao?: number | null
          nome_projecao?: string
          ponto_equilibrio_calculado?: number | null
          pro_labore?: number | null
          saidas_nao_operacionais?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      precificacao: {
        Row: {
          created_at: string | null
          custo_mao_obra: number | null
          custo_materia_prima: number | null
          despesas_fixas: number | null
          id: string
          margem_lucro: number | null
          nome: string
          observacoes: string | null
          preco_venda: number
          status: string | null
          tipo: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          custo_mao_obra?: number | null
          custo_materia_prima?: number | null
          despesas_fixas?: number | null
          id?: string
          margem_lucro?: number | null
          nome: string
          observacoes?: string | null
          preco_venda: number
          status?: string | null
          tipo: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          custo_mao_obra?: number | null
          custo_materia_prima?: number | null
          despesas_fixas?: number | null
          id?: string
          margem_lucro?: number | null
          nome?: string
          observacoes?: string | null
          preco_venda?: number
          status?: string | null
          tipo?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          empresa: string | null
          id: string
          nome: string | null
          telefone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          empresa?: string | null
          id?: string
          nome?: string | null
          telefone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          empresa?: string | null
          id?: string
          nome?: string | null
          telefone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      saldos_bancarios: {
        Row: {
          ativo: boolean | null
          banco: string
          conta: string
          created_at: string
          data_atualizacao: string
          id: string
          saldo: number | null
          saldo_anterior: number | null
          saldo_atual: number
          updated_at: string
          user_id: string
        }
        Insert: {
          ativo?: boolean | null
          banco: string
          conta: string
          created_at?: string
          data_atualizacao?: string
          id?: string
          saldo?: number | null
          saldo_anterior?: number | null
          saldo_atual?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          ativo?: boolean | null
          banco?: string
          conta?: string
          created_at?: string
          data_atualizacao?: string
          id?: string
          saldo?: number | null
          saldo_anterior?: number | null
          saldo_atual?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      system_videos: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          order_position: number | null
          status: string | null
          title: string
          updated_at: string | null
          youtube_url: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          order_position?: number | null
          status?: string | null
          title: string
          updated_at?: string | null
          youtube_url: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          order_position?: number | null
          status?: string | null
          title?: string
          updated_at?: string | null
          youtube_url?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
