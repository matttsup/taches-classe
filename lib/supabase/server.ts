import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { getSupabaseUrl, getSupabaseAnonKey } from "./config";

export async function createClient() {
  try {
    console.error('[DEBUG] createClient START');
    const cookieStore = await cookies();
    const supabaseUrl = getSupabaseUrl();
    const supabaseAnonKey = getSupabaseAnonKey();

    console.error('[DEBUG] Supabase config:', { 
      hasUrl: !!supabaseUrl, 
      hasKey: !!supabaseAnonKey,
      urlPrefix: supabaseUrl?.substring(0, 30)
    });

    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error(
        '❌ Configuration Supabase manquante!\n\n' +
        'Les credentials Supabase doivent être définis dans lib/supabase/config.ts'
      );
    }

    const client = createServerClient(
      supabaseUrl,
      supabaseAnonKey,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet: { name: string; value: string; options?: object }[]) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              );
            } catch {
              // Called from Server Component
            }
          },
        },
      }
    );

    console.error('[DEBUG] Supabase client created successfully');
    return client;
  } catch (error) {
    console.error('[DEBUG] ERROR in createClient:', error);
    throw error;
  }
}
