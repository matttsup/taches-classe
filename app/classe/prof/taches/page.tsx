import { createClient } from "@/lib/supabase/server";
import { getOrCreateFirstClasse, getOrCreateFirstProf } from "@/lib/classe-active";
import { TachesList } from "@/components/classe/TachesList";
import { AddTacheForm } from "@/components/classe/AddTacheForm";
import { SeedDefaultTaches } from "@/components/classe/SeedDefaultTaches";

export default async function ClasseTachesPage() {
  const supabase = await createClient();
  const prof = await getOrCreateFirstProf(supabase);
  const { classe } = await getOrCreateFirstClasse(supabase, prof.id);

  const { data: taches } = await supabase
    .from("classe_taches")
    .select("id, name, display_order")
    .eq("classe_id", classe.id)
    .order("display_order", { ascending: true })
    .order("name", { ascending: true });

  return (
    <div className="animate-fadeIn space-y-6">
      <div className="rounded-[25px] bg-white p-8 shadow-[0_8px_25px_rgba(0,0,0,0.1)]">
        <div className="mb-6 flex items-center gap-4">
          <span className="text-5xl">✓</span>
          <div>
            <h1 className="text-4xl font-bold text-classe-purple">
              Tâches ({taches?.length ?? 0})
            </h1>
            <p className="mt-1 text-lg text-gray-400">
              Définis les tâches à répartir (balai, chaises, collation…)
            </p>
          </div>
        </div>

        {(!taches || taches.length === 0) && (
          <SeedDefaultTaches classeId={classe.id} />
        )}

        <AddTacheForm classeId={classe.id} />

        <div className="mt-6">
          <TachesList taches={taches ?? []} classeId={classe.id} />
        </div>
      </div>
    </div>
  );
}
