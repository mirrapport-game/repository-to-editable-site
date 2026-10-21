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
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      blog_hidden_posts: {
        Row: {
          created_at: string
          post_id: string
        }
        Insert: {
          created_at?: string
          post_id: string
        }
        Update: {
          created_at?: string
          post_id?: string
        }
        Relationships: []
      }
      blogger_applications: {
        Row: {
          audience: string
          blog_url: string
          contact: string
          created_at: string
          id: string
          name: string
          status: string
          topic: string
        }
        Insert: {
          audience?: string
          blog_url: string
          contact: string
          created_at?: string
          id?: string
          name: string
          status?: string
          topic?: string
        }
        Update: {
          audience?: string
          blog_url?: string
          contact?: string
          created_at?: string
          id?: string
          name?: string
          status?: string
          topic?: string
        }
        Relationships: []
      }
      box_orders: {
        Row: {
          address: string
          amount_rub: number
          city: string
          contact: string
          created_at: string
          game_slug: string
          id: string
          paid_at: string | null
          payment_id: string | null
          payment_status: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          address?: string
          amount_rub: number
          city: string
          contact: string
          created_at?: string
          game_slug: string
          id?: string
          paid_at?: string | null
          payment_id?: string | null
          payment_status?: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          address?: string
          amount_rub?: number
          city?: string
          contact?: string
          created_at?: string
          game_slug?: string
          id?: string
          paid_at?: string | null
          payment_id?: string | null
          payment_status?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      channel_posts: {
        Row: {
          message_id: number
          posted_at: string
          text: string
          vk_post_id: number | null
        }
        Insert: {
          message_id: number
          posted_at?: string
          text: string
          vk_post_id?: number | null
        }
        Update: {
          message_id?: number
          posted_at?: string
          text?: string
          vk_post_id?: number | null
        }
        Relationships: []
      }
      course_invites: {
        Row: {
          code: string
          created_at: string
          facilitator_slug: string | null
          id: string
          note: string
          used_at: string | null
          used_by: string | null
        }
        Insert: {
          code?: string
          created_at?: string
          facilitator_slug?: string | null
          id?: string
          note?: string
          used_at?: string | null
          used_by?: string | null
        }
        Update: {
          code?: string
          created_at?: string
          facilitator_slug?: string | null
          id?: string
          note?: string
          used_at?: string | null
          used_by?: string | null
        }
        Relationships: []
      }
      course_lessons: {
        Row: {
          course: string
          cover_url: string | null
          created_at: string
          description: string
          homework_prompt: string
          id: string
          is_published: boolean
          position: number
          title: string
          updated_at: string
          video_path: string | null
          video_url: string | null
        }
        Insert: {
          course?: string
          cover_url?: string | null
          created_at?: string
          description?: string
          homework_prompt?: string
          id?: string
          is_published?: boolean
          position?: number
          title: string
          updated_at?: string
          video_path?: string | null
          video_url?: string | null
        }
        Update: {
          course?: string
          cover_url?: string | null
          created_at?: string
          description?: string
          homework_prompt?: string
          id?: string
          is_published?: boolean
          position?: number
          title?: string
          updated_at?: string
          video_path?: string | null
          video_url?: string | null
        }
        Relationships: []
      }
      course_students: {
        Row: {
          created_at: string
          email: string | null
          facilitator_slug: string | null
          invite_id: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          facilitator_slug?: string | null
          invite_id?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string | null
          facilitator_slug?: string | null
          invite_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "course_students_invite_id_fkey"
            columns: ["invite_id"]
            isOneToOne: false
            referencedRelation: "course_invites"
            referencedColumns: ["id"]
          },
        ]
      }
      course_submissions: {
        Row: {
          answer_text: string
          created_at: string
          feedback: string
          file_name: string | null
          file_path: string | null
          id: string
          lesson_id: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          answer_text?: string
          created_at?: string
          feedback?: string
          file_name?: string | null
          file_path?: string | null
          id?: string
          lesson_id: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          answer_text?: string
          created_at?: string
          feedback?: string
          file_name?: string | null
          file_path?: string | null
          id?: string
          lesson_id?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "course_submissions_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "course_lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      crm_contacts: {
        Row: {
          amount: number
          city: string
          created_at: string
          host_slug: string | null
          host_status: string
          id: string
          marketing_consent: boolean
          name: string
          next_date: string | null
          next_step: string
          notes: string
          paid_at: string | null
          payment_id: string | null
          payment_status: string | null
          phone: string
          source: string
          stage: string
          telegram: string
          updated_at: string
        }
        Insert: {
          amount?: number
          city?: string
          created_at?: string
          host_slug?: string | null
          host_status?: string
          id?: string
          marketing_consent?: boolean
          name: string
          next_date?: string | null
          next_step?: string
          notes?: string
          paid_at?: string | null
          payment_id?: string | null
          payment_status?: string | null
          phone?: string
          source?: string
          stage?: string
          telegram?: string
          updated_at?: string
        }
        Update: {
          amount?: number
          city?: string
          created_at?: string
          host_slug?: string | null
          host_status?: string
          id?: string
          marketing_consent?: boolean
          name?: string
          next_date?: string | null
          next_step?: string
          notes?: string
          paid_at?: string | null
          payment_id?: string | null
          payment_status?: string | null
          phone?: string
          source?: string
          stage?: string
          telegram?: string
          updated_at?: string
        }
        Relationships: []
      }
      event_signups: {
        Row: {
          contact: string
          created_at: string
          event_id: string
          id: string
          name: string
          reminded_at: string | null
          tg_chat_id: number | null
        }
        Insert: {
          contact: string
          created_at?: string
          event_id: string
          id?: string
          name: string
          reminded_at?: string | null
          tg_chat_id?: number | null
        }
        Update: {
          contact?: string
          created_at?: string
          event_id?: string
          id?: string
          name?: string
          reminded_at?: string | null
          tg_chat_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "event_signups_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "facilitator_events"
            referencedColumns: ["id"]
          },
        ]
      }
      facilitator_applications: {
        Row: {
          city: string
          created_at: string
          id: string
          interest: string
          name: string
          phone: string
          status: string
          updated_at: string
        }
        Insert: {
          city: string
          created_at?: string
          id?: string
          interest: string
          name: string
          phone: string
          status?: string
          updated_at?: string
        }
        Update: {
          city?: string
          created_at?: string
          id?: string
          interest?: string
          name?: string
          phone?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      facilitator_events: {
        Row: {
          capacity: number
          created_at: string
          facilitator_slug: string
          game: string
          host_reminded_at: string | null
          id: string
          place: string
          starts_at: string
        }
        Insert: {
          capacity?: number
          created_at?: string
          facilitator_slug: string
          game?: string
          host_reminded_at?: string | null
          id?: string
          place?: string
          starts_at: string
        }
        Update: {
          capacity?: number
          created_at?: string
          facilitator_slug?: string
          game?: string
          host_reminded_at?: string | null
          id?: string
          place?: string
          starts_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "facilitator_events_facilitator_slug_fkey"
            columns: ["facilitator_slug"]
            isOneToOne: false
            referencedRelation: "facilitators"
            referencedColumns: ["slug"]
          },
        ]
      }
      facilitator_reviews: {
        Row: {
          author_name: string
          body: string
          created_at: string
          facilitator_slug: string
          id: string
          order_id: string
          rating: number
          user_id: string
        }
        Insert: {
          author_name: string
          body: string
          created_at?: string
          facilitator_slug: string
          id?: string
          order_id: string
          rating: number
          user_id: string
        }
        Update: {
          author_name?: string
          body?: string
          created_at?: string
          facilitator_slug?: string
          id?: string
          order_id?: string
          rating?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "facilitator_reviews_facilitator_slug_fkey"
            columns: ["facilitator_slug"]
            isOneToOne: false
            referencedRelation: "facilitators"
            referencedColumns: ["slug"]
          },
          {
            foreignKeyName: "facilitator_reviews_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: true
            referencedRelation: "game_orders"
            referencedColumns: ["id"]
          },
        ]
      }
      facilitator_telegram: {
        Row: {
          chat_id: number | null
          created_at: string
          facilitator_slug: string
          first_name: string
          last_asked_at: string | null
          last_reply_at: string | null
          time_zone: string
          username: string
          utc_offset: string
        }
        Insert: {
          chat_id?: number | null
          created_at?: string
          facilitator_slug: string
          first_name?: string
          last_asked_at?: string | null
          last_reply_at?: string | null
          time_zone?: string
          username: string
          utc_offset?: string
        }
        Update: {
          chat_id?: number | null
          created_at?: string
          facilitator_slug?: string
          first_name?: string
          last_asked_at?: string | null
          last_reply_at?: string | null
          time_zone?: string
          username?: string
          utc_offset?: string
        }
        Relationships: [
          {
            foreignKeyName: "facilitator_telegram_facilitator_slug_fkey"
            columns: ["facilitator_slug"]
            isOneToOne: true
            referencedRelation: "facilitators"
            referencedColumns: ["slug"]
          },
        ]
      }
      facilitators: {
        Row: {
          city: string
          city_slug: string
          created_at: string
          name: string
          slug: string
        }
        Insert: {
          city: string
          city_slug: string
          created_at?: string
          name: string
          slug: string
        }
        Update: {
          city?: string
          city_slug?: string
          created_at?: string
          name?: string
          slug?: string
        }
        Relationships: []
      }
      game_orders: {
        Row: {
          amount_rub: number | null
          comment: string
          contact: string
          created_at: string
          event_type: string
          facilitator_slug: string
          game: string
          id: string
          paid_at: string | null
          payment_id: string | null
          payment_status: string
          preferred_date: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          amount_rub?: number | null
          comment?: string
          contact: string
          created_at?: string
          event_type: string
          facilitator_slug: string
          game: string
          id?: string
          paid_at?: string | null
          payment_id?: string | null
          payment_status?: string
          preferred_date?: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          amount_rub?: number | null
          comment?: string
          contact?: string
          created_at?: string
          event_type?: string
          facilitator_slug?: string
          game?: string
          id?: string
          paid_at?: string | null
          payment_id?: string | null
          payment_status?: string
          preferred_date?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "game_orders_facilitator_slug_fkey"
            columns: ["facilitator_slug"]
            isOneToOne: false
            referencedRelation: "facilitators"
            referencedColumns: ["slug"]
          },
        ]
      }
      host_challenge: {
        Row: {
          done: string[]
          updated_at: string
          user_id: string
        }
        Insert: {
          done?: string[]
          updated_at?: string
          user_id?: string
        }
        Update: {
          done?: string[]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      host_reviews: {
        Row: {
          author_name: string
          body: string
          created_at: string
          host_slug: string
          id: string
          image_path: string | null
          status: string
          user_id: string
          video_path: string | null
        }
        Insert: {
          author_name: string
          body?: string
          created_at?: string
          host_slug: string
          id?: string
          image_path?: string | null
          status?: string
          user_id?: string
          video_path?: string | null
        }
        Update: {
          author_name?: string
          body?: string
          created_at?: string
          host_slug?: string
          id?: string
          image_path?: string | null
          status?: string
          user_id?: string
          video_path?: string | null
        }
        Relationships: []
      }
      landing_hosts: {
        Row: {
          host_slug: string
          landing: string
        }
        Insert: {
          host_slug: string
          landing: string
        }
        Update: {
          host_slug?: string
          landing?: string
        }
        Relationships: []
      }
      landing_visits: {
        Row: {
          created_at: string
          id: string
          landing: string
          referrer: string
          utm_campaign: string
          utm_source: string
        }
        Insert: {
          created_at?: string
          id?: string
          landing: string
          referrer?: string
          utm_campaign?: string
          utm_source?: string
        }
        Update: {
          created_at?: string
          id?: string
          landing?: string
          referrer?: string
          utm_campaign?: string
          utm_source?: string
        }
        Relationships: []
      }
      lead_notify_recipients: {
        Row: {
          chat_id: number
          created_at: string
          username: string
        }
        Insert: {
          chat_id: number
          created_at?: string
          username: string
        }
        Update: {
          chat_id?: number
          created_at?: string
          username?: string
        }
        Relationships: []
      }
      marathon_signups: {
        Row: {
          contact: string
          created_at: string
          id: string
          name: string
          reminded_at: string | null
          slot_id: string
          tg_chat_id: number | null
        }
        Insert: {
          contact: string
          created_at?: string
          id?: string
          name: string
          reminded_at?: string | null
          slot_id: string
          tg_chat_id?: number | null
        }
        Update: {
          contact?: string
          created_at?: string
          id?: string
          name?: string
          reminded_at?: string | null
          slot_id?: string
          tg_chat_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "marathon_signups_slot_id_fkey"
            columns: ["slot_id"]
            isOneToOne: false
            referencedRelation: "marathon_slots"
            referencedColumns: ["id"]
          },
        ]
      }
      marathon_slots: {
        Row: {
          announced_at: string | null
          capacity: number
          created_at: string
          game: string
          host_name: string
          id: string
          phase: string
          published: boolean
          starts_at: string
          theme: string
        }
        Insert: {
          announced_at?: string | null
          capacity?: number
          created_at?: string
          game: string
          host_name?: string
          id?: string
          phase?: string
          published?: boolean
          starts_at: string
          theme?: string
        }
        Update: {
          announced_at?: string | null
          capacity?: number
          created_at?: string
          game?: string
          host_name?: string
          id?: string
          phase?: string
          published?: boolean
          starts_at?: string
          theme?: string
        }
        Relationships: []
      }
      member_blocks: {
        Row: {
          blocked: string
          blocker: string
          created_at: string
        }
        Insert: {
          blocked: string
          blocker: string
          created_at?: string
        }
        Update: {
          blocked?: string
          blocker?: string
          created_at?: string
        }
        Relationships: []
      }
      member_contacts: {
        Row: {
          contact: string
          updated_at: string
          user_id: string
        }
        Insert: {
          contact?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          contact?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      member_invites: {
        Row: {
          amount_rub: number | null
          created_at: string
          from_answers: number[]
          from_user: string
          id: string
          kind: string
          paid_at: string | null
          payment_id: string | null
          payment_status: string
          questions: string[]
          status: string
          to_answers: number[] | null
          to_user: string
          updated_at: string
        }
        Insert: {
          amount_rub?: number | null
          created_at?: string
          from_answers: number[]
          from_user: string
          id?: string
          kind?: string
          paid_at?: string | null
          payment_id?: string | null
          payment_status?: string
          questions: string[]
          status?: string
          to_answers?: number[] | null
          to_user: string
          updated_at?: string
        }
        Update: {
          amount_rub?: number | null
          created_at?: string
          from_answers?: number[]
          from_user?: string
          id?: string
          kind?: string
          paid_at?: string | null
          payment_id?: string | null
          payment_status?: string
          questions?: string[]
          status?: string
          to_answers?: number[] | null
          to_user?: string
          updated_at?: string
        }
        Relationships: []
      }
      member_likes: {
        Row: {
          created_at: string
          from_user: string
          to_user: string
        }
        Insert: {
          created_at?: string
          from_user: string
          to_user: string
        }
        Update: {
          created_at?: string
          from_user?: string
          to_user?: string
        }
        Relationships: []
      }
      member_messages: {
        Row: {
          body: string
          created_at: string
          id: string
          recipient: string
          sender: string
        }
        Insert: {
          body: string
          created_at?: string
          id?: string
          recipient: string
          sender: string
        }
        Update: {
          body?: string
          created_at?: string
          id?: string
          recipient?: string
          sender?: string
        }
        Relationships: []
      }
      member_profiles: {
        Row: {
          about: string
          account_type: string
          city: string
          created_at: string
          display_name: string
          gender: string
          is_adult: boolean
          is_blocked: boolean
          photo_path: string | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          about?: string
          account_type?: string
          city?: string
          created_at?: string
          display_name: string
          gender?: string
          is_adult: boolean
          is_blocked?: boolean
          photo_path?: string | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          about?: string
          account_type?: string
          city?: string
          created_at?: string
          display_name?: string
          gender?: string
          is_adult?: boolean
          is_blocked?: boolean
          photo_path?: string | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      member_reports: {
        Row: {
          created_at: string
          id: string
          reason: string
          reported: string
          reporter: string
          resolved: boolean
        }
        Insert: {
          created_at?: string
          id?: string
          reason: string
          reported: string
          reporter: string
          resolved?: boolean
        }
        Update: {
          created_at?: string
          id?: string
          reason?: string
          reported?: string
          reporter?: string
          resolved?: boolean
        }
        Relationships: []
      }
      minigame_cards: {
        Row: {
          created_at: string
          gender: string
          id: string
          image_path: string
          stage: string
        }
        Insert: {
          created_at?: string
          gender: string
          id?: string
          image_path: string
          stage: string
        }
        Update: {
          created_at?: string
          gender?: string
          id?: string
          image_path?: string
          stage?: string
        }
        Relationships: []
      }
      minigame_purchases: {
        Row: {
          amount_rub: number
          created_at: string
          id: string
          paid_at: string | null
          payment_id: string | null
          payment_status: string
          used_at: string | null
          user_id: string
        }
        Insert: {
          amount_rub?: number
          created_at?: string
          id?: string
          paid_at?: string | null
          payment_id?: string | null
          payment_status?: string
          used_at?: string | null
          user_id: string
        }
        Update: {
          amount_rub?: number
          created_at?: string
          id?: string
          paid_at?: string | null
          payment_id?: string | null
          payment_status?: string
          used_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      minigame_sessions: {
        Row: {
          created_at: string
          free: boolean
          id: string
          purchase_id: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          free?: boolean
          id?: string
          purchase_id?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          free?: boolean
          id?: string
          purchase_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "minigame_sessions_purchase_id_fkey"
            columns: ["purchase_id"]
            isOneToOne: false
            referencedRelation: "minigame_purchases"
            referencedColumns: ["id"]
          },
        ]
      }
      quest_progress: {
        Row: {
          levels: string[]
          updated_at: string
          user_id: string
        }
        Insert: {
          levels?: string[]
          updated_at?: string
          user_id: string
        }
        Update: {
          levels?: string[]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      site_articles: {
        Row: {
          author: string
          author_bio: string
          author_channel: string | null
          author_telegram: string | null
          category: string
          created_at: string
          date: string
          description: string
          id: string
          intro: string
          is_published: boolean
          published_at: string | null
          read_time: string
          sections: Json
          slug: string
          title: string
          updated_at: string
        }
        Insert: {
          author?: string
          author_bio?: string
          author_channel?: string | null
          author_telegram?: string | null
          category?: string
          created_at?: string
          date?: string
          description?: string
          id?: string
          intro?: string
          is_published?: boolean
          published_at?: string | null
          read_time?: string
          sections?: Json
          slug: string
          title: string
          updated_at?: string
        }
        Update: {
          author?: string
          author_bio?: string
          author_channel?: string | null
          author_telegram?: string | null
          category?: string
          created_at?: string
          date?: string
          description?: string
          id?: string
          intro?: string
          is_published?: boolean
          published_at?: string | null
          read_time?: string
          sections?: Json
          slug?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      telegram_updates: {
        Row: {
          chat_id: number | null
          created_at: string
          raw_update: Json
          text: string | null
          update_id: number
        }
        Insert: {
          chat_id?: number | null
          created_at?: string
          raw_update: Json
          text?: string | null
          update_id: number
        }
        Update: {
          chat_id?: number | null
          created_at?: string
          raw_update?: Json
          text?: string | null
          update_id?: number
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      video_reviews: {
        Row: {
          created_at: string
          id: string
          is_published: boolean
          participant: string
          sort_order: number
          thumbnail_url: string | null
          title: string
          updated_at: string
          video_url: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_published?: boolean
          participant?: string
          sort_order?: number
          thumbnail_url?: string | null
          title: string
          updated_at?: string
          video_url: string
        }
        Update: {
          created_at?: string
          id?: string
          is_published?: boolean
          participant?: string
          sort_order?: number
          thumbnail_url?: string | null
          title?: string
          updated_at?: string
          video_url?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      claim_first_admin: { Args: never; Returns: boolean }
      course_lesson_unlocked: {
        Args: { _lesson_id: string; _user_id: string }
        Returns: boolean
      }
      course_outline: {
        Args: never
        Returns: {
          id: string
          lesson_position: number
          title: string
          unlocked: boolean
        }[]
      }
      course_outline_by_game: {
        Args: never
        Returns: {
          course: string
          id: string
          lesson_position: number
          title: string
          unlocked: boolean
        }[]
      }
      event_seats_taken: {
        Args: { _event_ids: string[] }
        Returns: {
          event_id: string
          taken: number
        }[]
      }
      event_signup: {
        Args: { _contact: string; _event_id: string; _name: string }
        Returns: string
      }
      focus_group_feed: {
        Args: never
        Returns: {
          created_at: string
          first_name: string
          project: string
          stage: string
        }[]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      invite_matched: { Args: { _a: string; _b: string }; Returns: boolean }
      is_course_student: { Args: { _user_id: string }; Returns: boolean }
      marathon_signup: {
        Args: { _contact: string; _name: string; _slot_id: string }
        Returns: string
      }
      marathon_slot_counts: {
        Args: never
        Returns: {
          slot_id: string
          taken: number
        }[]
      }
      member_can_see: {
        Args: { _target: string; _viewer: string }
        Returns: boolean
      }
      members_blocked: { Args: { _a: string; _b: string }; Returns: boolean }
      members_matched: { Args: { _a: string; _b: string }; Returns: boolean }
      my_host_leads: {
        Args: never
        Returns: {
          contact: string
          created_at: string
          host_status: string
          id: string
          name: string
          notes: string
          source: string
        }[]
      }
      my_host_slug: { Args: never; Returns: string }
      my_host_stats: {
        Args: { _days: number }
        Returns: {
          leads: number
          visits: number
        }[]
      }
      redeem_course_invite: { Args: { _code: string }; Returns: boolean }
      set_my_lead_status: {
        Args: { _id: string; _status: string }
        Returns: boolean
      }
      submit_blogger_application: {
        Args: {
          _audience: string
          _blog_url: string
          _contact: string
          _name: string
          _topic: string
        }
        Returns: string
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const
