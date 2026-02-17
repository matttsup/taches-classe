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
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-classe-green">Liste des tâches</h1>
      <p className="text-lg text-gray-600">
        Définis les tâches à répartir (balai, chaises, collation…).
      </p>

      {(!taches || taches.length === 0) && (
        <SeedDefaultTaches classeId={classe.id} />
      )}

      <AddTacheForm classeId={classe.id} />

      <div className="rounded-2xl border-2 border-teal-200 bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-xl font-semibold text-gray-900">
          Tâches ({taches?.length ?? 0})
        </h2>
        <TachesList taches={taches ?? []} classeId={classe.id} />
      </div>
    </div>
  );
}
