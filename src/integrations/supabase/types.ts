export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      devices: {
        Row: {
          created_at: string
          description: string | null
          icon: string | null
          id: string
          instructions: string
          name: string
          video_url: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          icon?: string | null
          id: string
          instructions: string
          name: string
          video_url?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          instructions?: string
          name?: string
          video_url?: string | null
        }
        Relationships: []
      }
      iptv_subscriptions: {
        Row: {
          created_at: string
          data_vencimento: string
          dispositivo_principal: string | null
          id: string
          status: string
          updated_at: string
          url_servidor: string
          user_id: string
          xtream_password: string
          xtream_username: string
        }
        Insert: {
          created_at?: string
          data_vencimento: string
          dispositivo_principal?: string | null
          id?: string
          status?: string
          updated_at?: string
          url_servidor: string
          user_id: string
          xtream_password: string
          xtream_username: string
        }
        Update: {
          created_at?: string
          data_vencimento?: string
          dispositivo_principal?: string | null
          id?: string
          status?: string
          updated_at?: string
          url_servidor?: string
          user_id?: string
          xtream_password?: string
          xtream_username?: string
        }
        Relationships: []
      }
      integrations: {
        Row: {
          id: string
          provider: string
          api_key: string | null
          is_active: boolean
          credentials: Json | null
        }
        Insert: {
          id?: string
          provider: string
          api_key?: string | null
          is_active?: boolean
          credentials?: Json | null
        }
        Update: {
          id?: string
          provider?: string
          api_key?: string | null
          is_active?: boolean
          credentials?: Json | null
        }
        Relationships: []
      }
      onboarding_devices: {
        Row: {
          created_at: string | null
          icon_name: string
          id: string
          is_active: boolean | null
          name: string
          order_index: number | null
        }
        Insert: {
          created_at?: string | null
          icon_name: string
          id?: string
          is_active?: boolean | null
          name: string
          order_index?: number | null
        }
        Update: {
          created_at?: string | null
          icon_name?: string
          id?: string
          is_active?: boolean | null
          name?: string
          order_index?: number | null
        }
        Relationships: []
      }
      onboarding_steps: {
        Row: {
          created_at: string | null
          description: string
          device_id: string
          id: string
          youtube_id: string | null
          order_index: number | null
          title: string
        }
        Insert: {
          created_at?: string | null
          description: string
          device_id: string
          id?: string
          youtube_id?: string | null
          order_index?: number | null
          title: string
        }
        Update: {
          created_at?: string | null
          description?: string
          device_id?: string
          id?: string
          youtube_id?: string | null
          order_index?: number | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "onboarding_steps_device_id_fkey"
            columns: ["device_id"]
            isOneToOne: false
            referencedRelation: "onboarding_devices"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          created_at: string
          gateway_id: string | null
          id: string
          metodo: string | null
          status: string
          user_id: string
          valor: number
        }
        Insert: {
          created_at?: string
          gateway_id?: string | null
          id?: string
          metodo?: string | null
          status?: string
          user_id: string
          valor: number
        }
        Update: {
          created_at?: string
          gateway_id?: string | null
          id?: string
          metodo?: string | null
          status?: string
          user_id?: string
          valor?: number
        }
        Relationships: []
      }
      plans: {
        Row: {
          created_at: string
          features: Json
          id: string
          is_active: boolean
          name: string
          price_monthly: number
        }
        Insert: {
          created_at?: string
          features?: Json
          id?: string
          is_active?: boolean
          name: string
          price_monthly: number
        }
        Update: {
          created_at?: string
          features?: Json
          id?: string
          is_active?: boolean
          name?: string
          price_monthly?: number
        }
        Relationships: []
      }
      profiles: {
        Row: {
          asaas_customer_id: string | null
          cpf: string | null
          created_at: string
          email: string
          full_name: string | null
          id: string
          role: Database["public"]["Enums"]["user_role"]
        }
        Insert: {
          asaas_customer_id?: string | null
          cpf?: string | null
          created_at?: string
          email: string
          full_name?: string | null
          id: string
          role?: Database["public"]["Enums"]["user_role"]
        }
        Update: {
          asaas_customer_id?: string | null
          cpf?: string | null
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
        }
        Relationships: []
      }
      servers: {
        Row: {
          created_at: string
          dns_url: string
          id: string
          is_active: boolean
          m3u_url: string
          name: string
        }
        Insert: {
          created_at?: string
          dns_url: string
          id?: string
          is_active?: boolean
          m3u_url: string
          name: string
        }
        Update: {
          created_at?: string
          dns_url?: string
          id?: string
          is_active?: boolean
          m3u_url?: string
          name?: string
        }
        Relationships: []
      }
      subscription_plans: {
        Row: {
          asaas_id: string | null
          base_price: number
          created_at: string | null
          duration_months: number
          extra_screen_price: number
          id: string
          is_active: boolean | null
          name: string
        }
        Insert: {
          asaas_id?: string | null
          base_price: number
          created_at?: string | null
          duration_months: number
          extra_screen_price: number
          id?: string
          is_active?: boolean | null
          name: string
        }
        Update: {
          asaas_id?: string | null
          base_price?: number
          created_at?: string | null
          duration_months?: number
          extra_screen_price?: number
          id?: string
          is_active?: boolean | null
          name?: string
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          asaas_subscription_id: string | null
          created_at: string
          dispositivo_principal: string | null
          expires_at: string
          id: string
          plan_id: string | null
          profile_id: string
          server_id: string
          starts_at: string
          status: Database["public"]["Enums"]["subscription_status"]
        }
        Insert: {
          asaas_subscription_id?: string | null
          created_at?: string
          dispositivo_principal?: string | null
          expires_at: string
          id?: string
          plan_id?: string | null
          profile_id: string
          server_id: string
          starts_at?: string
          status?: Database["public"]["Enums"]["subscription_status"]
        }
        Update: {
          asaas_subscription_id?: string | null
          created_at?: string
          dispositivo_principal?: string | null
          expires_at?: string
          id?: string
          plan_id?: string | null
          profile_id?: string
          server_id?: string
          starts_at?: string
          status?: Database["public"]["Enums"]["subscription_status"]
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "plans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subscriptions_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subscriptions_server_id_fkey"
            columns: ["server_id"]
            isOneToOne: false
            referencedRelation: "servers"
            referencedColumns: ["id"]
          },
        ]
      }
      support_tickets: {
        Row: {
          categoria: string | null
          created_at: string
          id: string
          mensagem: string
          status: string
          user_id: string
        }
        Insert: {
          categoria?: string | null
          created_at?: string
          id?: string
          mensagem: string
          status?: string
          user_id: string
        }
        Update: {
          categoria?: string | null
          created_at?: string
          id?: string
          mensagem?: string
          status?: string
          user_id?: string
        }
        Relationships: []
      }
      system_settings: {
        Row: {
          created_at: string | null
          key: string
          updated_at: string | null
          value: Json
        }
        Insert: {
          created_at?: string | null
          key: string
          updated_at?: string | null
          value: Json
        }
        Update: {
          created_at?: string | null
          key?: string
          updated_at?: string | null
          value?: Json
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      xtream_servers: {
        Row: {
          created_at: string | null
          id: string
          is_active: boolean | null
          name: string
          password: string
          priority: number
          url: string
          username: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          password: string
          priority?: number
          url: string
          username: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          password?: string
          priority?: number
          url?: string
          username?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_admin: { Args: never; Returns: boolean }
    }
    Enums: {
      app_role: "admin" | "client"
      subscription_status: "trialing" | "active" | "past_due" | "canceled"
      user_role: "admin" | "client"
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
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      app_role: ["admin", "client"],
      subscription_status: ["trialing", "active", "past_due", "canceled"],
      user_role: ["admin", "client"],
    },
  },
} as const
