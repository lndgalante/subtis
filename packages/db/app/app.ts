import { createClient } from "@supabase/supabase-js";
import { z } from "zod";

// internals
import type { Database } from "../types";

// utils
export function getSupabaseEnvironmentVariables(): {
  supabaseApiKey: string;
  supabaseBaseUrl: string;
} {
  const [supabaseApiKey, supabaseBaseUrl] = [process.env.SUPABASE_API_KEY, process.env.SUPABASE_BASE_URL];
  const supabaseEnvVars = { supabaseApiKey, supabaseBaseUrl };

  const schema = z.object({
    supabaseApiKey: z.string(),
    supabaseBaseUrl: z.string(),
  });
  return schema.parse(supabaseEnvVars);
}

// core
function getSupabaseClient() {
  const { supabaseApiKey, supabaseBaseUrl } = getSupabaseEnvironmentVariables();

  return createClient<Database>(supabaseBaseUrl, supabaseApiKey, {
    db: {
      schema: "public",
    },
    auth: {
      persistSession: false,
    },
  });
}

// types
export type SupabaseClient = ReturnType<typeof getSupabaseClient>;

// models
export type Title = Database["public"]["Tables"]["Titles"]["Row"];
export type ReleaseGroup = Database["public"]["Tables"]["ReleaseGroups"]["Row"];
export type Subtitle = Database["public"]["Tables"]["Subtitles"]["Row"];
export type SubtitleGroup = Database["public"]["Tables"]["SubtitleGroups"]["Row"];
export type Genre = Database["public"]["Tables"]["Genres"]["Row"];

// constants
export const supabase = getSupabaseClient();
