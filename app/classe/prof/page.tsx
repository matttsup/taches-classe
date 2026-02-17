import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getActiveClasse } from "@/lib/classe-active";

export default async function ClasseProfDashboardPage() {
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

  const { classe, classes } = await getActiveClasse(supabase, prof.id);

  if (!classe) {
    return (
      <div className="rounded-xl bg-white p-8 shadow">
        <h1 className="text-xl font-bold text-classe-green">
          Aucune classe créée
        </h1>
        <p className="mt-2 text-gray-600">
          Complétez votre profil pour créer votre première classe.
        </p>
        <Link
          href="/complete-profile"
          className="mt-4 inline-block rounded-lg bg-classe-green px-4 py-2 text-white hover:bg-classe-green/90"
        >
          Compléter le profil
        </Link>
      </div>
    );
  }

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
        <h1 className="text-2xl font-bold text-classe-green">
          Tableau de bord — {classe.name}
        </h1>
        <p className="mt-1 text-gray-600">
          Code à donner aux élèves :{" "}
          <strong className="rounded bg-teal-100 px-2 py-0.5 font-mono text-classe-green">
            {classe.code}
          </strong>
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Link
          href="/classe/prof/eleves"
          className="rounded-xl border border-teal-200 bg-white p-6 shadow-sm transition hover:border-classe-green hover:shadow"
        >
          <span className="text-3xl">👥</span>
          <h2 className="mt-2 font-semibold text-gray-900">Élèves</h2>
          <p className="mt-1 text-sm text-gray-600">
            {elevesCount ?? 0} élève{(elevesCount ?? 0) !== 1 ? "s" : ""}
          </p>
          <span className="mt-2 inline-block text-sm font-medium text-classe-green">
            Gérer les élèves →
          </span>
        </Link>

        <Link
          href="/classe/prof/taches"
          className="rounded-xl border border-teal-200 bg-white p-6 shadow-sm transition hover:border-classe-green hover:shadow"
        >
          <span className="text-3xl">✅</span>
          <h2 className="mt-2 font-semibold text-gray-900">Tâches</h2>
          <p className="mt-1 text-sm text-gray-600">
            {tachesCount ?? 0} tâche{(tachesCount ?? 0) !== 1 ? "s" : ""}
          </p>
          <span className="mt-2 inline-block text-sm font-medium text-classe-green">
            Gérer les tâches →
          </span>
        </Link>

        <Link
          href="/classe/prof/calendrier"
          className="rounded-xl border border-teal-200 bg-white p-6 shadow-sm transition hover:border-classe-green hover:shadow"
        >
          <span className="text-3xl">📅</span>
          <h2 className="mt-2 font-semibold text-gray-900">Calendrier</h2>
          <p className="mt-1 text-sm text-gray-600">
            Affectations jour par jour
          </p>
          <span className="mt-2 inline-block text-sm font-medium text-classe-green">
            Ouvrir le calendrier →
          </span>
        </Link>
      </div>
    </div>
  );
}
