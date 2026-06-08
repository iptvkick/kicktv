export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          nome: string
          whatsapp: string | null
          role: string | null
          created_at: string | null
        }
        Insert: {
          id: string
          nome: string
          whatsapp?: string | null
          role?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          nome?: string
          whatsapp?: string | null
          role?: string | null
          created_at?: string | null
        }
      }
      iptv_subscriptions: {
        Row: {
          id: string
          user_id: string
          xtream_username: string
          xtream_password: string
          status: string | null
          dispositivo_principal: string | null
          data_vencimento: string
          url_servidor: string
          created_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          xtream_username: string
          xtream_password: string
          status?: string | null
          dispositivo_principal?: string | null
          data_vencimento: string
          url_servidor: string
          created_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          xtream_username?: string
          xtream_password?: string
          status?: string | null
          dispositivo_principal?: string | null
          data_vencimento?: string
          url_servidor?: string
          created_at?: string | null
        }
      }
      payments: {
        Row: {
          id: string
          user_id: string
          valor: number
          status: string | null
          metodo: string | null
          gateway_id: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          valor: number
          status?: string | null
          metodo?: string | null
          gateway_id?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          valor?: number
          status?: string | null
          metodo?: string | null
          gateway_id?: string | null
          created_at?: string | null
        }
      }
      support_tickets: {
        Row: {
          id: string
          user_id: string
          categoria: string | null
          mensagem: string
          status: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          categoria?: string | null
          mensagem: string
          status?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          categoria?: string | null
          mensagem?: string
          status?: string | null
          created_at?: string | null
        }
      }
    }
  }
}
