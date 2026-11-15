import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Environment variables for client-side Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

let clientInstance: SupabaseClient | null = null;

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl.trim().length > 0 &&
  supabaseAnonKey.trim().length > 0 &&
  !supabaseUrl.includes('placeholder')
);

if (isSupabaseConfigured) {
  try {
    clientInstance = createClient(supabaseUrl!, supabaseAnonKey!);
  } catch (err) {
    console.warn('ASTRO COMMAND: Failed to initialize Supabase client:', err);
    clientInstance = null;
  }
}

export const supabase = clientInstance;

/**
 * Returns whether real database persistence is active
 */
export function getDatabaseStatus(): {
  isConfigured: boolean;
  url: string | null;
  mode: 'SUPABASE' | 'LOCAL_CACHE';
} {
  return {
    isConfigured: isSupabaseConfigured && clientInstance !== null,
    url: isSupabaseConfigured ? supabaseUrl! : null,
    mode: isSupabaseConfigured && clientInstance !== null ? 'SUPABASE' : 'LOCAL_CACHE'
  };
}
