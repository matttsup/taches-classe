import { SupabaseClient } from "@supabase/supabase-js";

export type ClasseRow = { id: string; name: string };

export async function getActiveClasse(
  supabase: SupabaseClient,
  profId: string
): Promise<{ classe: ClasseRow | null; classes: ClasseRow[] }> {
  const { data: classes } = await supabase
    .from("classes")
    .select("id, name")
    .eq("prof_id", profId)
    .order("created_at", { ascending: true });

  const list = (classes ?? []) as ClasseRow[];
  return { classe: list[0] ?? null, classes: list };
}

/** Retourne le premier prof, ou en crée un si aucun n'existe. */
export async function getOrCreateFirstProf(
  supabase: SupabaseClient
): Promise<{ id: string; name: string }> {
  try {
    console.error('[DEBUG] getOrCreateFirstProf START');
    
    const { data: existing, error: selectError } = await supabase
      .from("profs")
      .select("id, name")
      .limit(1)
      .single();

    console.error('[DEBUG] Select existing prof:', { 
      found: !!existing, 
      error: selectError?.message,
      errorCode: selectError?.code
    });

    if (existing) {
      console.error('[DEBUG] Using existing prof:', existing.id);
      return existing as { id: string; name: string };
    }

    console.error('[DEBUG] No existing prof, creating new one');
    const { data: created, error } = await supabase
      .from("profs")
      .insert({ name: "Enseignant" })
      .select("id, name")
      .single();

    console.error('[DEBUG] Create prof result:', { 
      created: !!created, 
      error: error?.message,
      errorCode: error?.code,
      errorDetails: error?.details
    });

    if (error || !created) {
      console.error('[DEBUG] FAILED to create prof, throwing error');
      throw new Error("Impossible de créer le profil enseignant: " + (error?.message || 'Unknown error'));
    }
    
    console.error('[DEBUG] Prof created successfully:', created.id);
    return created as { id: string; name: string };
  } catch (error) {
    console.error('[DEBUG] EXCEPTION in getOrCreateFirstProf:', error);
    throw error;
  }
}

/** Retourne la première classe du prof, ou en crée une si aucune n'existe. */
export async function getOrCreateFirstClasse(
  supabase: SupabaseClient,
  profId: string
): Promise<{ classe: ClasseRow; classes: ClasseRow[] }> {
  try {
    console.error('[DEBUG] getOrCreateFirstClasse START, profId:', profId);
    
    const { classe, classes } = await getActiveClasse(supabase, profId);
    
    console.error('[DEBUG] getActiveClasse result:', { 
      hasClasse: !!classe, 
      classesCount: classes.length 
    });

    if (classe) {
      console.error('[DEBUG] Using existing classe:', classe.id);
      return { classe, classes };
    }

    console.error('[DEBUG] No existing classe, creating new one');
    const { data: created, error } = await supabase
      .from("classes")
      .insert({ prof_id: profId, name: "501" })
      .select("id, name")
      .single();

    console.error('[DEBUG] Create classe result:', { 
      created: !!created, 
      error: error?.message,
      errorCode: error?.code,
      errorDetails: error?.details
    });

    if (error || !created) {
      console.error('[DEBUG] FAILED to create classe, throwing error');
      throw new Error("Impossible de créer la classe: " + (error?.message || 'Unknown error'));
    }
    
    const newClasse = created as ClasseRow;
    console.error('[DEBUG] Classe created successfully:', newClasse.id);
    return { classe: newClasse, classes: [newClasse] };
  } catch (error) {
    console.error('[DEBUG] EXCEPTION in getOrCreateFirstClasse:', error);
    throw error;
  }
}
