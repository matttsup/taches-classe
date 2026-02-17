import { createClient } from "@/lib/supabase/server";
import { MesTachesView } from "@/components/classe/MesTachesView";

export default async function ClasseElevePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: eleve } = await supabase
    .from("classe_eleves")
    .select("id, name, classe_id")
    .eq("user_id", user.id)
    .single();

  if (!eleve) {
    return (
      <div className="rounded-xl bg-amber-50 p-6 text-amber-800">
        <p>
          Votre compte n&apos;est pas encore associé à une classe. Utilisez
          le code fourni par votre enseignant lors de l&apos;inscription.
        </p>
      </div>
    );
  }

  const { data: assignments } = await supabase
    .from("classe_assignments")
    .select("id, assignment_date, tache_id")
    .eq("eleve_id", eleve.id)
    .order("assignment_date", { ascending: true });

  const tacheIds = [...new Set((assignments ?? []).map((a) => a.tache_id))];
  const { data: taches } =
    tacheIds.length > 0
      ? await supabase
          .from("classe_taches")
          .select("id, name")
          .in("id", tacheIds)
      : { data: [] };

  const tachesList = (taches ?? []) as { id: string; name: string }[];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-classe-green">
        Mes tâches — {eleve.name}
      </h1>
      <p className="text-gray-600">
        Voici les tâches qui te sont assignées.
      </p>

      <MesTachesView assignments={assignments ?? []} taches={tachesList} />
    </div>
  );
}
