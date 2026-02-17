import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getActiveClasse } from "@/lib/classe-active";
import { ElevesList } from "@/components/classe/ElevesList";
import { AddEleveForm } from "@/components/classe/AddEleveForm";

export default async function ClasseElevesPage() {
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
    .select("id, name, user_id, display_order")
    .eq("classe_id", classe.id)
    .order("display_order", { ascending: true })
    .order("name", { ascending: true });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-classe-green">Liste des élèves</h1>
      <p className="text-gray-600">
        Les élèves peuvent rejoindre avec le code{" "}
        <strong className="font-mono">{classe.code}</strong> à l&apos;inscription.
      </p>

      <AddEleveForm classeId={classe.id} />

      <div className="rounded-xl border border-teal-200 bg-white p-4 shadow-sm">
        <h2 className="mb-4 font-semibold text-gray-900">
          Élèves ({eleves?.length ?? 0})
        </h2>
        <ElevesList eleves={eleves ?? []} classeId={classe.id} />
      </div>
    </div>
  );
}
