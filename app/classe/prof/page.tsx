import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { getActiveClasse, getOrCreateFirstClasse, getOrCreateFirstProf } from "@/lib/classe-active";

export default async function ClasseProfDashboardPage() {
  const supabase = await createClient();
  const prof = await getOrCreateFirstProf(supabase);
  const { classe, classes } = await getOrCreateFirstClasse(supabase, prof.id);

  const { count: elevesCount } = await supabase
    .from("classe_eleves")
    .select("*", { count: "exact", head: true })
    .eq("classe_id", classe.id);

  const { count: tachesCount } = await supabase
    .from("classe_taches")
    .select("*", { count: "exact", head: true })
    .eq("classe_id", classe.id);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-classe-green">
          Tableau de bord — {classe.name}
        </h1>
        <p className="mt-2 text-lg text-gray-600">
          Code à donner aux élèves :{" "}
          <strong className="rounded-xl bg-teal-100 px-3 py-1 font-mono text-xl text-classe-green">
            {classe.code}
          </strong>
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <Link
          href="/classe/prof/eleves"
          className="rounded-2xl border-2 border-teal-200 bg-white p-6 shadow-sm transition hover:border-classe-green hover:shadow-md"
        >
          <span className="text-4xl">👥</span>
          <h2 className="mt-3 text-xl font-semibold text-gray-900">Élèves</h2>
          <p className="mt-2 text-base text-gray-600">
            {elevesCount ?? 0} élève{(elevesCount ?? 0) !== 1 ? "s" : ""}
          </p>
          <span className="mt-3 inline-block text-base font-medium text-classe-green">
            Gérer les élèves →
          </span>
        </Link>

        <Link
          href="/classe/prof/taches"
          className="rounded-2xl border-2 border-teal-200 bg-white p-6 shadow-sm transition hover:border-classe-green hover:shadow-md"
        >
          <span className="text-4xl">✅</span>
          <h2 className="mt-3 text-xl font-semibold text-gray-900">Tâches</h2>
          <p className="mt-2 text-base text-gray-600">
            {tachesCount ?? 0} tâche{(tachesCount ?? 0) !== 1 ? "s" : ""}
          </p>
          <span className="mt-3 inline-block text-base font-medium text-classe-green">
            Gérer les tâches →
          </span>
        </Link>

        <Link
          href="/classe/prof/calendrier"
          className="rounded-2xl border-2 border-teal-200 bg-white p-6 shadow-sm transition hover:border-classe-green hover:shadow-md"
        >
          <span className="text-4xl">📅</span>
          <h2 className="mt-3 text-xl font-semibold text-gray-900">Calendrier</h2>
          <p className="mt-2 text-base text-gray-600">
            Affectations jour par jour
          </p>
          <span className="mt-3 inline-block text-base font-medium text-classe-green">
            Ouvrir le calendrier →
          </span>
        </Link>
      </div>
    </div>
  );
}
