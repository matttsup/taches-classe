import { createClient } from "@/lib/supabase/server";
import { getOrCreateFirstClasse, getOrCreateFirstProf } from "@/lib/classe-active";
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
    <div className="animate-fadeIn space-y-6">
      <div className="rounded-[25px] bg-white p-8 shadow-[0_8px_25px_rgba(0,0,0,0.1)]">
        <div className="mb-6 flex items-center gap-4">
          <span className="text-5xl">👥</span>
          <div>
            <h1 className="text-4xl font-bold text-classe-purple">
              Élèves ({eleves?.length ?? 0})
            </h1>
            <p className="mt-1 text-lg text-gray-400">
              Ajoute les prénoms des élèves de ta classe
            </p>
          </div>
        </div>

        <AddEleveForm classeId={classe.id} />

        <div className="mt-6">
          <ElevesList eleves={eleves ?? []} classeId={classe.id} />
        </div>
      </div>
    </div>
  );
}
