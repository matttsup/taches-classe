import { createClient } from "@/lib/supabase/server";
import { getActiveClasse, getOrCreateFirstProf } from "@/lib/classe-active";
import { CalendrierView } from "@/components/classe/CalendrierView";

export default async function ClasseCalendrierPage({
  searchParams,
}: {
  searchParams: { classe?: string };
}) {
  const supabase = await createClient();
  const prof = await getOrCreateFirstProf(supabase);
  const { classe, classes } = await getActiveClasse(supabase, prof.id);

  const selectedClasseId = searchParams.classe || classe?.id;
  const selectedClasse = classes.find((c) => c.id === selectedClasseId) || classe;

  if (!selectedClasse) {
    return <div>Aucune classe trouvée</div>;
  }

  const { data: eleves } = await supabase
    .from("classe_eleves")
    .select("id, name")
    .eq("classe_id", selectedClasse.id)
    .order("display_order", { ascending: true })
    .order("name", { ascending: true });

  const { data: taches } = await supabase
    .from("classe_taches")
    .select("id, name")
    .eq("classe_id", selectedClasse.id)
    .order("display_order", { ascending: true })
    .order("name", { ascending: true });

  const { data: assignments } = await supabase
    .from("classe_assignments")
    .select("id, assignment_date, eleve_id, tache_id")
    .eq("classe_id", selectedClasse.id);

  return (
    <div className="animate-fadeIn">
      <CalendrierView
        classeId={selectedClasse.id}
        eleves={eleves ?? []}
        taches={taches ?? []}
        assignments={assignments ?? []}
      />
    </div>
  );
}
