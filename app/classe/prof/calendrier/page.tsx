import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getActiveClasse } from "@/lib/classe-active";
import { CalendrierView } from "@/components/classe/CalendrierView";

export default async function ClasseCalendrierPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: prof } = await supabase
    .from("profs")
    .select("id")
    .eq("user_id", user.id)
    .single();

  if (!prof) redirect("/complete-profile");

  const { classe } = await getActiveClasse(supabase, prof.id);
  if (!classe) redirect("/classe/prof");

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
      <h1 className="text-2xl font-bold text-classe-green">
        Calendrier des tâches
      </h1>
      <p className="text-gray-600">
        Choisissez un jour et assignez les tâches aux élèves.
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
