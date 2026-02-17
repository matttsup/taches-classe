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
    <div className="animate-fadeIn">
      <div className="mb-6 rounded-[25px] bg-white p-8 shadow-[0_8px_25px_rgba(0,0,0,0.1)]">
        <div className="flex items-center gap-4">
          <span className="text-5xl">📅</span>
          <div>
            <h1 className="text-4xl font-bold text-classe-purple">
              Calendrier des tâches
            </h1>
            <p className="mt-1 text-lg text-gray-400">
              Choisis un jour et assigne les tâches aux élèves
            </p>
          </div>
        </div>
      </div>

      <CalendrierView
        classeId={classe.id}
        eleves={eleves ?? []}
        taches={taches ?? []}
        assignments={assignments ?? []}
      />
    </div>
  );
}
