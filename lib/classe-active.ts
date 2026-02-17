import { SupabaseClient } from "@supabase/supabase-js";

export type ClasseRow = { id: string; name: string; code: string };

export async function getActiveClasse(
  supabase: SupabaseClient,
  profId: string
): Promise<{ classe: ClasseRow | null; classes: ClasseRow[] }> {
  const { data: classes } = await supabase
    .from("classes")
    .select("id, name, code")
    .eq("prof_id", profId)
    .order("created_at", { ascending: true });

  const list = (classes ?? []) as ClasseRow[];
  return { classe: list[0] ?? null, classes: list };
}
