/**
 * Configuration Supabase hardcodée
 * Ces valeurs sont utilisées si les variables d'environnement ne sont pas définies
 * Cela permet à l'application de fonctionner sur n'importe quel laptop sans configuration
 */

export const SUPABASE_CONFIG = {
  url: "https://yacftsozobeejarcpvxf.supabase.co",
  anonKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlhY2Z0c296b2JlZWphcmNwdnhmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEyODUzNDcsImV4cCI6MjA4Njg2MTM0N30.ANkXD4hNR0V23iZepzsYQUaosNYxLSqE7Km0Mh_azVk",
};

/**
 * Récupère l'URL Supabase (depuis env ou config hardcodée)
 */
export function getSupabaseUrl(): string {
  return process.env.NEXT_PUBLIC_SUPABASE_URL || SUPABASE_CONFIG.url;
}

/**
 * Récupère la clé anon Supabase (depuis env ou config hardcodée)
 */
export function getSupabaseAnonKey(): string {
  return process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || SUPABASE_CONFIG.anonKey;
}
