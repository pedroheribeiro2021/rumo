// Gerado via `mcp__claude_ai_Supabase__generate_typescript_types` a partir do projeto
// Supabase compartilhado (grsqjzrgngpyckcfkxon). Inclui tabelas de outros apps que
// vivem no mesmo projeto (fi_*, rooms, participants, items...) — as do Rumo usam o
// prefixo `rumo_`. Não editar à mão: regenerar após mudanças em supabase/schema.sql.
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
  public: {
    Tables: {
      fi_bans: {
        Row: {
          banido_por: string | null
          created_at: string
          id: string
          motivo: string | null
          whatsapp: string
        }
        Insert: {
          banido_por?: string | null
          created_at?: string
          id?: string
          motivo?: string | null
          whatsapp: string
        }
        Update: {
          banido_por?: string | null
          created_at?: string
          id?: string
          motivo?: string | null
          whatsapp?: string
        }
        Relationships: [
          {
            foreignKeyName: "fi_bans_banido_por_fkey"
            columns: ["banido_por"]
            isOneToOne: false
            referencedRelation: "fi_players"
            referencedColumns: ["id"]
          },
        ]
      }
      fi_caixa_despesas: {
        Row: {
          amount: number
          created_at: string
          created_by: string | null
          description: string
          expense_date: string | null
          id: string
        }
        Insert: {
          amount: number
          created_at?: string
          created_by?: string | null
          description: string
          expense_date?: string | null
          id?: string
        }
        Update: {
          amount?: number
          created_at?: string
          created_by?: string | null
          description?: string
          expense_date?: string | null
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fi_caixa_despesas_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "fi_players"
            referencedColumns: ["id"]
          },
        ]
      }
      fi_caixa_saldo: {
        Row: {
          created_at: string
          created_by: string | null
          id: string
          saldo_anterior: number
          saldo_atual: number
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          id?: string
          saldo_anterior: number
          saldo_atual: number
        }
        Update: {
          created_at?: string
          created_by?: string | null
          id?: string
          saldo_anterior?: number
          saldo_atual?: number
        }
        Relationships: [
          {
            foreignKeyName: "fi_caixa_saldo_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "fi_players"
            referencedColumns: ["id"]
          },
        ]
      }
      fi_finance_payments: {
        Row: {
          amount_paid: number
          created_at: string
          id: string
          player_id: string
          session_id: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          amount_paid?: number
          created_at?: string
          id?: string
          player_id: string
          session_id: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          amount_paid?: number
          created_at?: string
          id?: string
          player_id?: string
          session_id?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fi_finance_payments_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "fi_players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fi_finance_payments_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "fi_pelada_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fi_finance_payments_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "fi_players"
            referencedColumns: ["id"]
          },
        ]
      }
      fi_gallery: {
        Row: {
          created_at: string
          id: string
          path: string
          player_id: string
          session_id: string | null
          type: string
        }
        Insert: {
          created_at?: string
          id?: string
          path: string
          player_id: string
          session_id?: string | null
          type: string
        }
        Update: {
          created_at?: string
          id?: string
          path?: string
          player_id?: string
          session_id?: string | null
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "fi_gallery_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "fi_players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fi_gallery_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "fi_pelada_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      fi_goals: {
        Row: {
          created_at: string
          id: string
          match_id: string
          player_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          match_id: string
          player_id: string
        }
        Update: {
          created_at?: string
          id?: string
          match_id?: string
          player_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fi_goals_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "fi_matches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fi_goals_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "fi_players"
            referencedColumns: ["id"]
          },
        ]
      }
      fi_matches: {
        Row: {
          clock_elapsed_seconds: number
          clock_started_at: string | null
          clock_status: string
          created_at: string
          duration_seconds: number
          finished_at: string | null
          id: string
          score_a: number | null
          score_b: number | null
          sequence_order: number
          session_id: string
          started_at: string | null
          team_a_players: string[]
          team_b_players: string[]
          winner: string | null
        }
        Insert: {
          clock_elapsed_seconds?: number
          clock_started_at?: string | null
          clock_status?: string
          created_at?: string
          duration_seconds?: number
          finished_at?: string | null
          id?: string
          score_a?: number | null
          score_b?: number | null
          sequence_order: number
          session_id: string
          started_at?: string | null
          team_a_players?: string[]
          team_b_players?: string[]
          winner?: string | null
        }
        Update: {
          clock_elapsed_seconds?: number
          clock_started_at?: string | null
          clock_status?: string
          created_at?: string
          duration_seconds?: number
          finished_at?: string | null
          id?: string
          score_a?: number | null
          score_b?: number | null
          sequence_order?: number
          session_id?: string
          started_at?: string | null
          team_a_players?: string[]
          team_b_players?: string[]
          winner?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fi_matches_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "fi_pelada_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      fi_payment_receipts: {
        Row: {
          created_at: string
          id: string
          path: string
          player_id: string
          session_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          path: string
          player_id: string
          session_id: string
        }
        Update: {
          created_at?: string
          id?: string
          path?: string
          player_id?: string
          session_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fi_payment_receipts_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "fi_players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fi_payment_receipts_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "fi_pelada_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      fi_pelada_sessions: {
        Row: {
          auto_close_minutes: number | null
          checkin_deadline_minutes: number
          checkin_radius_meters: number
          created_at: string
          created_by: string | null
          id: string
          latitude: number | null
          list_close_at: string | null
          location_name: string | null
          location_url: string | null
          longitude: number | null
          max_confirmados: number
          notes: string | null
          scheduled_date: string
          scheduled_time: string
          status: string
          team_size: number
        }
        Insert: {
          auto_close_minutes?: number | null
          checkin_deadline_minutes?: number
          checkin_radius_meters?: number
          created_at?: string
          created_by?: string | null
          id?: string
          latitude?: number | null
          list_close_at?: string | null
          location_name?: string | null
          location_url?: string | null
          longitude?: number | null
          max_confirmados?: number
          notes?: string | null
          scheduled_date: string
          scheduled_time?: string
          status?: string
          team_size?: number
        }
        Update: {
          auto_close_minutes?: number | null
          checkin_deadline_minutes?: number
          checkin_radius_meters?: number
          created_at?: string
          created_by?: string | null
          id?: string
          latitude?: number | null
          list_close_at?: string | null
          location_name?: string | null
          location_url?: string | null
          longitude?: number | null
          max_confirmados?: number
          notes?: string | null
          scheduled_date?: string
          scheduled_time?: string
          status?: string
          team_size?: number
        }
        Relationships: [
          {
            foreignKeyName: "fi_pelada_sessions_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "fi_players"
            referencedColumns: ["id"]
          },
        ]
      }
      fi_players: {
        Row: {
          apelido: string | null
          avatar_color: string | null
          avatar_url: string | null
          created_at: string
          device_token: string
          faltas_count: number
          id: string
          is_admin: boolean
          is_admin_financeiro: boolean
          is_admin_partidas: boolean
          nome: string
          pin_attempts: number
          pin_hash: string | null
          pin_locked_until: string | null
          status: string
          whatsapp: string
        }
        Insert: {
          apelido?: string | null
          avatar_color?: string | null
          avatar_url?: string | null
          created_at?: string
          device_token?: string
          faltas_count?: number
          id?: string
          is_admin?: boolean
          is_admin_financeiro?: boolean
          is_admin_partidas?: boolean
          nome: string
          pin_attempts?: number
          pin_hash?: string | null
          pin_locked_until?: string | null
          status?: string
          whatsapp: string
        }
        Update: {
          apelido?: string | null
          avatar_color?: string | null
          avatar_url?: string | null
          created_at?: string
          device_token?: string
          faltas_count?: number
          id?: string
          is_admin?: boolean
          is_admin_financeiro?: boolean
          is_admin_partidas?: boolean
          nome?: string
          pin_attempts?: number
          pin_hash?: string | null
          pin_locked_until?: string | null
          status?: string
          whatsapp?: string
        }
        Relationships: []
      }
      fi_presences: {
        Row: {
          checked_in_at: string | null
          confirmed_at: string
          falta: boolean
          falta_overridden_by: string | null
          id: string
          player_id: string
          session_id: string
        }
        Insert: {
          checked_in_at?: string | null
          confirmed_at?: string
          falta?: boolean
          falta_overridden_by?: string | null
          id?: string
          player_id: string
          session_id: string
        }
        Update: {
          checked_in_at?: string | null
          confirmed_at?: string
          falta?: boolean
          falta_overridden_by?: string | null
          id?: string
          player_id?: string
          session_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fi_presences_falta_overridden_by_fkey"
            columns: ["falta_overridden_by"]
            isOneToOne: false
            referencedRelation: "fi_players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fi_presences_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "fi_players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fi_presences_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "fi_pelada_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      fi_regulamento: {
        Row: {
          content: string
          id: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          content?: string
          id?: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          content?: string
          id?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fi_regulamento_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "fi_players"
            referencedColumns: ["id"]
          },
        ]
      }
      fi_session_finance: {
        Row: {
          rent_amount: number
          session_id: string
          settled_at: string | null
          settled_debtors: Json
          status: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          rent_amount?: number
          session_id: string
          settled_at?: string | null
          settled_debtors?: Json
          status?: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          rent_amount?: number
          session_id?: string
          settled_at?: string | null
          settled_debtors?: Json
          status?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fi_session_finance_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: true
            referencedRelation: "fi_pelada_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fi_session_finance_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "fi_players"
            referencedColumns: ["id"]
          },
        ]
      }
      fi_session_state: {
        Row: {
          current_match_id: string | null
          games_played: Json
          on_field_a: string[]
          on_field_b: string[]
          queue: string[]
          session_id: string
          team_size: number
          updated_at: string
        }
        Insert: {
          current_match_id?: string | null
          games_played?: Json
          on_field_a?: string[]
          on_field_b?: string[]
          queue?: string[]
          session_id: string
          team_size?: number
          updated_at?: string
        }
        Update: {
          current_match_id?: string | null
          games_played?: Json
          on_field_a?: string[]
          on_field_b?: string[]
          queue?: string[]
          session_id?: string
          team_size?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fi_session_state_current_match_id_fkey"
            columns: ["current_match_id"]
            isOneToOne: false
            referencedRelation: "fi_matches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fi_session_state_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: true
            referencedRelation: "fi_pelada_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      item_consumers: {
        Row: {
          item_id: string
          participant_id: string
        }
        Insert: {
          item_id: string
          participant_id: string
        }
        Update: {
          item_id?: string
          participant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "item_consumers_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "item_consumers_participant_id_fkey"
            columns: ["participant_id"]
            isOneToOne: false
            referencedRelation: "participants"
            referencedColumns: ["id"]
          },
        ]
      }
      items: {
        Row: {
          created_at: string
          id: string
          name: string
          price_cents: number
          room_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          price_cents: number
          room_id: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          price_cents?: number
          room_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "items_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      participants: {
        Row: {
          auth_id: string
          created_at: string
          id: string
          nickname: string
          room_id: string
        }
        Insert: {
          auth_id: string
          created_at?: string
          id?: string
          nickname: string
          room_id: string
        }
        Update: {
          auth_id?: string
          created_at?: string
          id?: string
          nickname?: string
          room_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "participants_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      rooms: {
        Row: {
          code: string
          created_at: string
          host_auth_id: string
          id: string
          service_fee_percent: number
        }
        Insert: {
          code: string
          created_at?: string
          host_auth_id: string
          id?: string
          service_fee_percent?: number
        }
        Update: {
          code?: string
          created_at?: string
          host_auth_id?: string
          id?: string
          service_fee_percent?: number
        }
        Relationships: []
      }
      rumo_budget_items: {
        Row: {
          category: string
          currency: string
          id: string
          planned_amount: number
          trip_id: string
        }
        Insert: {
          category: string
          currency?: string
          id?: string
          planned_amount?: number
          trip_id: string
        }
        Update: {
          category?: string
          currency?: string
          id?: string
          planned_amount?: number
          trip_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "rumo_budget_items_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "rumo_trips"
            referencedColumns: ["id"]
          },
        ]
      }
      rumo_expense_splits: {
        Row: {
          expense_id: string
          id: string
          member_id: string
          share: number
        }
        Insert: {
          expense_id: string
          id?: string
          member_id: string
          share: number
        }
        Update: {
          expense_id?: string
          id?: string
          member_id?: string
          share?: number
        }
        Relationships: [
          {
            foreignKeyName: "rumo_expense_splits_expense_id_fkey"
            columns: ["expense_id"]
            isOneToOne: false
            referencedRelation: "rumo_expenses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rumo_expense_splits_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "rumo_trip_members"
            referencedColumns: ["id"]
          },
        ]
      }
      rumo_expenses: {
        Row: {
          amount: number
          category: string | null
          created_at: string | null
          created_by: string | null
          currency: string
          description: string | null
          fx_to_base: number
          id: string
          paid_by: string | null
          spent_on: string
          trip_id: string
        }
        Insert: {
          amount: number
          category?: string | null
          created_at?: string | null
          created_by?: string | null
          currency?: string
          description?: string | null
          fx_to_base?: number
          id?: string
          paid_by?: string | null
          spent_on?: string
          trip_id: string
        }
        Update: {
          amount?: number
          category?: string | null
          created_at?: string | null
          created_by?: string | null
          currency?: string
          description?: string | null
          fx_to_base?: number
          id?: string
          paid_by?: string | null
          spent_on?: string
          trip_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "rumo_expenses_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "rumo_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rumo_expenses_paid_by_fkey"
            columns: ["paid_by"]
            isOneToOne: false
            referencedRelation: "rumo_trip_members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rumo_expenses_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "rumo_trips"
            referencedColumns: ["id"]
          },
        ]
      }
      rumo_itinerary_days: {
        Row: {
          base_city: string | null
          country: string | null
          day_date: string | null
          id: string
          notes: string | null
          sort_order: number | null
          title: string | null
          trip_id: string
        }
        Insert: {
          base_city?: string | null
          country?: string | null
          day_date?: string | null
          id?: string
          notes?: string | null
          sort_order?: number | null
          title?: string | null
          trip_id: string
        }
        Update: {
          base_city?: string | null
          country?: string | null
          day_date?: string | null
          id?: string
          notes?: string | null
          sort_order?: number | null
          title?: string | null
          trip_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "rumo_itinerary_days_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "rumo_trips"
            referencedColumns: ["id"]
          },
        ]
      }
      rumo_price_observations: {
        Row: {
          id: string
          note: string | null
          observed_at: string
          price: number
          source: string | null
          watch_id: string
        }
        Insert: {
          id?: string
          note?: string | null
          observed_at?: string
          price: number
          source?: string | null
          watch_id: string
        }
        Update: {
          id?: string
          note?: string | null
          observed_at?: string
          price?: number
          source?: string | null
          watch_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "rumo_price_observations_watch_id_fkey"
            columns: ["watch_id"]
            isOneToOne: false
            referencedRelation: "rumo_price_watches"
            referencedColumns: ["id"]
          },
        ]
      }
      rumo_price_watches: {
        Row: {
          created_at: string | null
          currency: string
          depart_date: string | null
          destination: string
          id: string
          notes: string | null
          origin: string
          return_date: string | null
          target_price: number | null
          trip_id: string | null
        }
        Insert: {
          created_at?: string | null
          currency?: string
          depart_date?: string | null
          destination: string
          id?: string
          notes?: string | null
          origin: string
          return_date?: string | null
          target_price?: number | null
          trip_id?: string | null
        }
        Update: {
          created_at?: string | null
          currency?: string
          depart_date?: string | null
          destination?: string
          id?: string
          notes?: string | null
          origin?: string
          return_date?: string | null
          target_price?: number | null
          trip_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "rumo_price_watches_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "rumo_trips"
            referencedColumns: ["id"]
          },
        ]
      }
      rumo_profiles: {
        Row: {
          created_at: string | null
          email: string | null
          id: string
          name: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          id: string
          name?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          id?: string
          name?: string | null
        }
        Relationships: []
      }
      rumo_trip_members: {
        Row: {
          display_name: string
          email: string | null
          id: string
          profile_id: string | null
          role: string
          trip_id: string
        }
        Insert: {
          display_name: string
          email?: string | null
          id?: string
          profile_id?: string | null
          role?: string
          trip_id: string
        }
        Update: {
          display_name?: string
          email?: string | null
          id?: string
          profile_id?: string | null
          role?: string
          trip_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "rumo_trip_members_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "rumo_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rumo_trip_members_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "rumo_trips"
            referencedColumns: ["id"]
          },
        ]
      }
      rumo_trips: {
        Row: {
          base_currency: string
          created_at: string | null
          destination: string | null
          end_date: string | null
          id: string
          name: string
          owner: string
          start_date: string | null
        }
        Insert: {
          base_currency?: string
          created_at?: string | null
          destination?: string | null
          end_date?: string | null
          id?: string
          name: string
          owner: string
          start_date?: string | null
        }
        Update: {
          base_currency?: string
          created_at?: string | null
          destination?: string | null
          end_date?: string | null
          id?: string
          name?: string
          owner?: string
          start_date?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "rumo_trips_owner_fkey"
            columns: ["owner"]
            isOneToOne: false
            referencedRelation: "rumo_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      earth: { Args: never; Returns: number }
      fi_add_caixa_despesa: {
        Args: {
          p_admin_id: string
          p_amount: number
          p_description: string
          p_expense_date?: string
        }
        Returns: undefined
      }
      fi_admin_adjust_goal: {
        Args: {
          p_action: string
          p_admin_id: string
          p_match_id: string
          p_player_id: string
        }
        Returns: undefined
      }
      fi_admin_check_in: {
        Args: { p_admin_id: string; p_at?: string; p_presence_id: string }
        Returns: undefined
      }
      fi_admin_reset_pin: {
        Args: { p_admin_id: string; p_player_id: string }
        Returns: undefined
      }
      fi_apply_auto_faltas: { Args: never; Returns: undefined }
      fi_auto_close_sessions: { Args: never; Returns: undefined }
      fi_ban_player: {
        Args: { p_admin_id: string; p_motivo?: string; p_player_id: string }
        Returns: undefined
      }
      fi_cancel_presence: {
        Args: { p_actor_id: string; p_player_id: string; p_session_id: string }
        Returns: undefined
      }
      fi_cancel_session: {
        Args: { p_admin_id: string; p_session_id: string }
        Returns: undefined
      }
      fi_check_in: {
        Args: {
          p_lat?: number
          p_lng?: number
          p_player_id: string
          p_session_id: string
        }
        Returns: undefined
      }
      fi_checkout_player: {
        Args: { p_actor_id: string; p_player_id: string; p_session_id: string }
        Returns: undefined
      }
      fi_confirm_presence: {
        Args: { p_player_id: string; p_session_id: string }
        Returns: undefined
      }
      fi_delete_caixa_despesa: {
        Args: { p_admin_id: string; p_entry_id: string }
        Returns: undefined
      }
      fi_delete_caixa_saldo: {
        Args: { p_admin_id: string; p_entry_id: string }
        Returns: undefined
      }
      fi_delete_player: {
        Args: { p_admin_id: string; p_player_id: string }
        Returns: undefined
      }
      fi_finish_session: {
        Args: { p_admin_id: string; p_session_id: string }
        Returns: undefined
      }
      fi_override_falta: {
        Args: { p_admin_id: string; p_presence_id: string }
        Returns: undefined
      }
      fi_pin_auth: {
        Args: {
          p_apelido?: string
          p_nome?: string
          p_pin: string
          p_whatsapp: string
        }
        Returns: Json
      }
      fi_resolve_maps_coords: {
        Args: { p_url: string }
        Returns: {
          lat: number
          lng: number
        }[]
      }
      fi_set_caixa_saldo: {
        Args: { p_admin_id: string; p_saldo_atual: number }
        Returns: undefined
      }
      fi_set_finance_payment: {
        Args: {
          p_admin_id: string
          p_amount_paid: number
          p_player_id: string
          p_session_id: string
        }
        Returns: undefined
      }
      fi_set_session_finance_status: {
        Args: {
          p_admin_id: string
          p_force?: boolean
          p_session_id: string
          p_status: string
        }
        Returns: Json
      }
      fi_set_session_rent: {
        Args: {
          p_admin_id: string
          p_rent_amount: number
          p_session_id: string
        }
        Returns: undefined
      }
      fi_swap_players: {
        Args: {
          p_actor_id: string
          p_player_in: string
          p_player_out: string
          p_session_id: string
        }
        Returns: undefined
      }
      fi_unban: {
        Args: { p_admin_id: string; p_whatsapp: string }
        Returns: undefined
      }
      is_own_participant: {
        Args: { p_participant_id: string }
        Returns: boolean
      }
      is_room_participant: { Args: { p_room_id: string }; Returns: boolean }
      rumo_invite_trip_member: {
        Args: { p_display_name: string; p_email: string; p_trip_id: string }
        Returns: {
          display_name: string
          email: string | null
          id: string
          profile_id: string | null
          role: string
          trip_id: string
        }
      }
      rumo_is_trip_member: { Args: { t: string }; Returns: boolean }
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
