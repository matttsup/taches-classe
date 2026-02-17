import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient() {
  const cookieStore = await cookies();

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    throw new Error(
      '❌ Variables d\'environnement Supabase manquantes!\n\n' +
      'Créez un fichier .env.local à la racine du projet avec:\n' +
      'NEXT_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co\n' +
      'NEXT_PUBLIC_SUPABASE_ANON_KEY=votre-cle-anon\n\n' +
      'Vous trouverez ces valeurs dans: Supabase Dashboard > Settings > API'
    );
  }

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
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
}
