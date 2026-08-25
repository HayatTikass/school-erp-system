import { createClient } from "@supabase/supabase-js";
import { isSupabaseConfigured, supabaseAnonKey, supabaseUrl } from "./env";

export { isSupabaseConfigured };

export const supabase = createClient(
  supabaseUrl || "https://unavailable.supabase.co",
  supabaseAnonKey || "unavailable",
);
