import { createClient } from "@/lib/supabase/server";
import { getActiveClasse, getOrCreateFirstProf } from "@/lib/classe-active";
import { StatistiquesView } from "@/components/classe/StatistiquesView";

export default async function ClasseStatistiquesPage({
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
    .select("id, name, points, badges")
    .eq("classe_id", selectedClasse.id)
    .order("points", { ascending: false });

  // Compter les tâches par élève
  const { data: assignments } = await supabase
    .from("classe_assignments")
    .select("eleve_id, tache_id, assignment_date")
    .eq("classe_id", selectedClasse.id);

  const statsParEleve = (eleves ?? []).map((eleve) => {
    const tachesCount = (assignments ?? []).filter((a) => a.eleve_id === eleve.id).length;
    return {
      ...eleve,
      totalTaches: tachesCount,
    };
  });

  return (
    <div className="animate-fadeIn space-y-6">
      <div className="rounded-[25px] bg-white p-8 shadow-[0_8px_25px_rgba(0,0,0,0.1)]">
        <div className="mb-6 flex items-center gap-4">
          <span className="text-5xl">📊</span>
          <div>
            <h1 className="text-4xl font-bold text-classe-purple">
              Statistiques & Récompenses
            </h1>
            <p className="mt-1 text-lg text-gray-400">
              Suivi des performances de {selectedClasse.name}
            </p>
          </div>
        </div>

        <StatistiquesView
          classeId={selectedClasse.id}
          eleves={statsParEleve}
        />
      </div>
    </div>
  );
}
