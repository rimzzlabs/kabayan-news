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
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      aspirasi: {
        Row: {
          admin_id: string | null
          deskripsi: string | null
          foto_url: string | null
          id: string
          judul: string
          kategori_id: string | null
          lokasi: string | null
          status: string | null
          tanggal_kirim: string | null
          user_id: string | null
        }
        Insert: {
          admin_id?: string | null
          deskripsi?: string | null
          foto_url?: string | null
          id?: string
          judul: string
          kategori_id?: string | null
          lokasi?: string | null
          status?: string | null
          tanggal_kirim?: string | null
          user_id?: string | null
        }
        Update: {
          admin_id?: string | null
          deskripsi?: string | null
          foto_url?: string | null
          id?: string
          judul?: string
          kategori_id?: string | null
          lokasi?: string | null
          status?: string | null
          tanggal_kirim?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "aspirasi_admin_id_fkey"
            columns: ["admin_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "aspirasi_kategori_id_fkey"
            columns: ["kategori_id"]
            isOneToOne: false
            referencedRelation: "kategori"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "aspirasi_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      berita: {
        Row: {
          foto_url: string | null
          id: string
          isi: string | null
          judul: string
          kategori_id: string | null
          slug: string
          status: string | null
          tanggal_dibuat: string
          tanggal_publikasi: string | null
          tanggal_update: string | null
          user_id: string | null
        }
        Insert: {
          foto_url?: string | null
          id?: string
          isi?: string | null
          judul: string
          kategori_id?: string | null
          slug: string
          status?: string | null
          tanggal_dibuat?: string
          tanggal_publikasi?: string | null
          tanggal_update?: string | null
          user_id?: string | null
        }
        Update: {
          foto_url?: string | null
          id?: string
          isi?: string | null
          judul?: string
          kategori_id?: string | null
          slug?: string
          status?: string | null
          tanggal_dibuat?: string
          tanggal_publikasi?: string | null
          tanggal_update?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "berita_kategori_id_fkey"
            columns: ["kategori_id"]
            isOneToOne: false
            referencedRelation: "kategori"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "berita_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      kategori: {
        Row: {
          deskripsi: string | null
          id: string
          jenis: string
          nama: string
        }
        Insert: {
          deskripsi?: string | null
          id?: string
          jenis: string
          nama: string
        }
        Update: {
          deskripsi?: string | null
          id?: string
          jenis?: string
          nama?: string
        }
        Relationships: []
      }
      komentar: {
        Row: {
          aspirasi_id: string | null
          berita_id: string | null
          id: string
          isi: string | null
          tanggal_komentar: string | null
          user_id: string | null
        }
        Insert: {
          aspirasi_id?: string | null
          berita_id?: string | null
          id?: string
          isi?: string | null
          tanggal_komentar?: string | null
          user_id?: string | null
        }
        Update: {
          aspirasi_id?: string | null
          berita_id?: string | null
          id?: string
          isi?: string | null
          tanggal_komentar?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "komentar_aspirasi_id_fkey"
            columns: ["aspirasi_id"]
            isOneToOne: false
            referencedRelation: "aspirasi"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "komentar_berita_id_fkey"
            columns: ["berita_id"]
            isOneToOne: false
            referencedRelation: "berita"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "komentar_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          alamat: string | null
          foto_profil: string | null
          id: string
          nama: string | null
          nik: string | null
          no_hp: string | null
          role: string
          status_aktif: boolean | null
          tanggal_daftar: string | null
        }
        Insert: {
          alamat?: string | null
          foto_profil?: string | null
          id: string
          nama?: string | null
          nik?: string | null
          no_hp?: string | null
          role?: string
          status_aktif?: boolean | null
          tanggal_daftar?: string | null
        }
        Update: {
          alamat?: string | null
          foto_profil?: string | null
          id?: string
          nama?: string | null
          nik?: string | null
          no_hp?: string | null
          role?: string
          status_aktif?: boolean | null
          tanggal_daftar?: string | null
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
