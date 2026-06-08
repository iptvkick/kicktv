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
          email: string
          role: 'admin' | 'client'
          asaas_customer_id: string | null
          created_at: string
        }
        Insert: {
          id: string
          email: string
          role?: 'admin' | 'client'
          asaas_customer_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          role?: 'admin' | 'client'
          asaas_customer_id?: string | null
          created_at?: string
        }
      }
      servers: {
        Row: {
          id: string
          name: string
          m3u_url: string
          dns_url: string
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          m3u_url: string
          dns_url: string
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          m3u_url?: string
          dns_url?: string
          is_active?: boolean
          created_at?: string
        }
      }
      plans: {
        Row: {
          id: string
          name: string
          price_monthly: number
          features: Json
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          price_monthly: number
          features?: Json
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          price_monthly?: number
          features?: Json
          is_active?: boolean
          created_at?: string
        }
      }
      devices: {
        Row: {
          id: string
          name: string
          description: string | null
          instructions: string
          video_url: string | null
          icon: string | null
          created_at: string
        }
        Insert: {
          id: string
          name: string
          description?: string | null
          instructions: string
          video_url?: string | null
          icon?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          instructions?: string
          video_url?: string | null
          icon?: string | null
          created_at?: string
        }
      }
      subscriptions: {
        Row: {
          id: string
          profile_id: string
          plan_id: string | null
          server_id: string
          status: 'trialing' | 'active' | 'past_due' | 'canceled'
          asaas_subscription_id: string | null
          starts_at: string
          expires_at: string
          created_at: string
        }
        Insert: {
          id?: string
          profile_id: string
          plan_id?: string | null
          server_id: string
          status?: 'trialing' | 'active' | 'past_due' | 'canceled'
          asaas_subscription_id?: string | null
          starts_at?: string
          expires_at: string
          created_at?: string
        }
        Update: {
          id?: string
          profile_id?: string
          plan_id?: string | null
          server_id?: string
          status?: 'trialing' | 'active' | 'past_due' | 'canceled'
          asaas_subscription_id?: string | null
          starts_at?: string
          expires_at?: string
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      user_role: 'admin' | 'client'
      subscription_status: 'trialing' | 'active' | 'past_due' | 'canceled'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
