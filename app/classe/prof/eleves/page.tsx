import { createClient } from "@/lib/supabase/server";
import { getActiveClasse, getOrCreateFirstClasse, getOrCreateFirstProf } from "@/lib/classe-active";
import { ElevesList } from "@/components/classe/ElevesList";
import { AddEleveForm } from "@/components/classe/AddEleveForm";

export default async function ClasseElevesPage() {
  const supabase = await createClient();
  const prof = await getOrCreateFirstProf(supabase);
  const { classe } = await getOrCreateFirstClasse(supabase, prof.id);

  const { data: eleves } = await supabase
    .from("classe_eleves")
    .select("id, name, user_id, display_order")
    .eq("classe_id", classe.id)
    .order("display_order", { ascending: true })
    .order("name", { ascending: true });

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-classe-green">Liste des élèves</h1>
      <p className="text-lg text-gray-600">
        Ajoute les prénoms des élèves. Le code de la classe est{" "}
        <strong className="rounded-xl bg-teal-100 px-2 py-0.5 font-mono text-classe-green">
          {classe.code}
        </strong>
      </p>

      <AddEleveForm classeId={classe.id} />

      <div className="rounded-2xl border-2 border-teal-200 bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-xl font-semibold text-gray-900">
          Élèves ({eleves?.length ?? 0})
        </h2>
        <ElevesList eleves={eleves ?? []} classeId={classe.id} />
      </div>
    </div>
  );
}
