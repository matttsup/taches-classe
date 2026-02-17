import { createClient } from "@/lib/supabase/server";
import { getOrCreateFirstClasse, getOrCreateFirstProf } from "@/lib/classe-active";
import { CalendrierView } from "@/components/classe/CalendrierView";

export default async function ClasseCalendrierPage() {
  const supabase = await createClient();
  const prof = await getOrCreateFirstProf(supabase);
  const { classe } = await getOrCreateFirstClasse(supabase, prof.id);

  const { data: eleves } = await supabase
    .from("classe_eleves")
    .select("id, name")
    .eq("classe_id", classe.id)
    .order("display_order", { ascending: true })
    .order("name", { ascending: true });

  const { data: taches } = await supabase
    .from("classe_taches")
    .select("id, name")
    .eq("classe_id", classe.id)
    .order("display_order", { ascending: true })
    .order("name", { ascending: true });

  const { data: assignments } = await supabase
    .from("classe_assignments")
    .select("id, assignment_date, eleve_id, tache_id")
    .eq("classe_id", classe.id);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-classe-green">
        Calendrier des tâches
      </h1>
      <p className="text-lg text-gray-600">
        Choisis un jour et assigne les tâches aux élèves.
      </p>

      <CalendrierView
        classeId={classe.id}
        eleves={eleves ?? []}
        taches={taches ?? []}
        assignments={assignments ?? []}
      />
    </div>
  );
}
