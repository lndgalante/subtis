export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      Movies: {
        Row: {
          created_at: string;
          id: string;
          name: string;
          rating: number;
          year: number;
        };
        Insert: {
          created_at?: string;
          id: string;
          name: string;
          rating: number;
          year: number;
        };
        Update: {
          created_at?: string;
          id?: string;
          name?: string;
          rating?: number;
          year?: number;
        };
        Relationships: [];
      };
      ReleaseGroups: {
        Row: {
          created_at: string;
          fileAttribute: string;
          id: number;
          name: string;
          searchableSubDivXName: string;
          website: string;
        };
        Insert: {
          created_at?: string;
          fileAttribute: string;
          id?: number;
          name: string;
          searchableSubDivXName: string;
          website: string;
        };
        Update: {
          created_at?: string;
          fileAttribute?: string;
          id?: number;
          name?: string;
          searchableSubDivXName?: string;
          website?: string;
        };
        Relationships: [];
      };
      SubtitleGroups: {
        Row: {
          created_at: string;
          id: number;
          name: string;
          website: string;
        };
        Insert: {
          created_at?: string;
          id?: number;
          name: string;
          website: string;
        };
        Update: {
          created_at?: string;
          id?: number;
          name?: string;
          website?: string;
        };
        Relationships: [];
      };
      Subtitles: {
        Row: {
          created_at: string;
          fileNameHash: string;
          id: number;
          movieId: string;
          releaseGroupId: number;
          resolution: string;
          subtitleGroupId: number;
          subtitleLink: string;
        };
        Insert: {
          created_at?: string;
          fileNameHash: string;
          id?: number;
          movieId: string;
          releaseGroupId: number;
          resolution: string;
          subtitleGroupId: number;
          subtitleLink: string;
        };
        Update: {
          created_at?: string;
          fileNameHash?: string;
          id?: number;
          movieId?: string;
          releaseGroupId?: number;
          resolution?: string;
          subtitleGroupId?: number;
          subtitleLink?: string;
        };
        Relationships: [
          {
            foreignKeyName: "Subtitles_movieId_fkey";
            columns: ["movieId"];
            referencedRelation: "Movies";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "Subtitles_releaseGroupId_fkey";
            columns: ["releaseGroupId"];
            referencedRelation: "ReleaseGroups";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "Subtitles_subtitleGroupId_fkey";
            columns: ["subtitleGroupId"];
            referencedRelation: "SubtitleGroups";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}