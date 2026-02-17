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

/** Retourne le premier prof, ou en crée un si aucun n'existe. */
export async function getOrCreateFirstProf(
  supabase: SupabaseClient
): Promise<{ id: string; name: string }> {
  const { data: existing } = await supabase
    .from("profs")
    .select("id, name")
    .limit(1)
    .single();

  if (existing) return existing as { id: string; name: string };

  const { data: created, error } = await supabase
    .from("profs")
    .insert({ name: "Enseignant" })
    .select("id, name")
    .single();

  if (error || !created) throw new Error("Impossible de créer le profil enseignant");
  return created as { id: string; name: string };
}

/** Retourne la première classe du prof, ou en crée une si aucune n'existe. */
export async function getOrCreateFirstClasse(
  supabase: SupabaseClient,
  profId: string
): Promise<{ classe: ClasseRow; classes: ClasseRow[] }> {
  const { classe, classes } = await getActiveClasse(supabase, profId);
  if (classe) return { classe, classes };

  const code = Math.random().toString(36).slice(2, 8).toUpperCase();
  const { data: created, error } = await supabase
    .from("classes")
    .insert({ prof_id: profId, name: "Ma classe", code })
    .select("id, name, code")
    .single();

  if (error || !created) throw new Error("Impossible de créer la classe");
  const newClasse = created as ClasseRow;
  return { classe: newClasse, classes: [newClasse] };
}
