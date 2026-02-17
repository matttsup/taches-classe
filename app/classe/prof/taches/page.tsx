import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getActiveClasse } from "@/lib/classe-active";
import { TachesList } from "@/components/classe/TachesList";
import { AddTacheForm } from "@/components/classe/AddTacheForm";
import { SeedDefaultTaches } from "@/components/classe/SeedDefaultTaches";

export default async function ClasseTachesPage() {
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

  const { data: taches } = await supabase
    .from("classe_taches")
    .select("id, name, display_order")
    .eq("classe_id", classe.id)
    .order("display_order", { ascending: true })
    .order("name", { ascending: true });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-classe-green">Liste des tâches</h1>
      <p className="text-gray-600">
        Définissez les tâches à répartir (balai, chaises, collation…).
      </p>

      {(!taches || taches.length === 0) && (
        <SeedDefaultTaches classeId={classe.id} />
      )}

      <AddTacheForm classeId={classe.id} />

      <div className="rounded-xl border border-teal-200 bg-white p-4 shadow-sm">
        <h2 className="mb-4 font-semibold text-gray-900">
          Tâches ({taches?.length ?? 0})
        </h2>
        <TachesList taches={taches ?? []} classeId={classe.id} />
      </div>
    </div>
  );
}
