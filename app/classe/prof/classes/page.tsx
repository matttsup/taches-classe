import { createClient } from "@/lib/supabase/server";
import { getActiveClasse, getOrCreateFirstProf } from "@/lib/classe-active";
import { ClasseManager } from "@/components/classe/ClasseManager";

export default async function ClassesPage() {
  const supabase = await createClient();
  const prof = await getOrCreateFirstProf(supabase);
  const { classes } = await getActiveClasse(supabase, prof.id);

  return (
    <div className="animate-fadeIn">
      <div className="rounded-[25px] bg-white p-8 shadow-[0_8px_25px_rgba(0,0,0,0.1)]">
        <div className="mb-6 flex items-center gap-4">
          <span className="text-5xl">🏫</span>
          <div>
            <h1 className="text-4xl font-bold text-classe-purple">Gestion des classes</h1>
            <p className="mt-1 text-lg text-gray-400">
              Crée et gère tes différentes classes
            </p>
          </div>
        </div>

        <ClasseManager profId={prof.id} classes={classes} />
      </div>
    </div>
  );
}
