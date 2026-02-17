import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import Link from "next/link";
import { getActiveClasse, getOrCreateFirstProf } from "@/lib/classe-active";
import { ClasseSelector } from "@/components/classe/ClasseSelector";

export default async function ClasseProfDashboardPage({
  searchParams,
}: {
  searchParams: { classe?: string };
}) {
  const supabase = await createClient();
  const prof = await getOrCreateFirstProf(supabase);
  const { classe, classes } = await getActiveClasse(supabase, prof.id);

  // Sélection de classe via URL ou défaut
  const selectedClasseId = searchParams.classe || classe?.id;
  const selectedClasse = classes.find((c) => c.id === selectedClasseId) || classe;

  if (!selectedClasse) {
    return (
      <div className="animate-fadeIn space-y-6">
        <div className="rounded-[30px] bg-white p-8 shadow-[0_20px_60px_rgba(0,0,0,0.3)] text-center">
          <div className="mb-4 text-[60px]">🏫</div>
          <h1 className="mb-3 text-[32px] font-bold text-classe-purple">
            Aucune classe créée
          </h1>
          <p className="mb-6 text-lg text-gray-600">
            Crée ta première classe pour commencer !
          </p>
          <Link
            href="/classe/prof/classes"
            className="inline-block rounded-[15px] bg-classe-teal px-6 py-3 font-semibold text-white transition-transform hover:scale-105"
          >
            Créer une classe
          </Link>
        </div>
      </div>
    );
  }

  const { count: elevesCount } = await supabase
    .from("classe_eleves")
    .select("*", { count: "exact", head: true })
    .eq("classe_id", selectedClasse.id);

  const { count: tachesCount } = await supabase
    .from("classe_taches")
    .select("*", { count: "exact", head: true })
    .eq("classe_id", selectedClasse.id);

  const cards = [
    {
      href: `/classe/prof/eleves?classe=${selectedClasse.id}`,
      emoji: "👥",
      title: "Élèves",
      count: elevesCount ?? 0,
      label: "élève",
      gradient: "linear-gradient(135deg, #A8E6CF 0%, #4ECDC4 100%)",
    },
    {
      href: `/classe/prof/taches?classe=${selectedClasse.id}`,
      emoji: "✓",
      title: "Tâches",
      count: tachesCount ?? 0,
      label: "tâche",
      gradient: "linear-gradient(135deg, #FFD93D 0%, #FF8B94 100%)",
    },
    {
      href: `/classe/prof/calendrier?classe=${selectedClasse.id}`,
      emoji: "📅",
      title: "Calendrier",
      count: null,
      label: "Affectations jour par jour",
      gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    },
  ];

  return (
    <div className="animate-fadeIn space-y-8">
      <div className="rounded-[30px] bg-white p-8 shadow-[0_20px_60px_rgba(0,0,0,0.3)] text-center animate-bounceIn">
        <div className="animate-float mb-4 text-[80px]">🏫</div>
        <h1 className="mb-3 text-[42px] font-bold text-classe-purple">
          École Chanoine-Joseph-Théorêt
        </h1>
        <ClasseSelector classes={classes} selectedClasseId={selectedClasse.id} />
        <p className="mt-4 text-xl text-gray-600">
          Code de la classe :{" "}
          <strong className="rounded-xl bg-classe-teal/20 px-4 py-2 font-mono text-2xl text-classe-teal">
            {selectedClasse.code}
          </strong>
        </p>
        <Link
          href="/classe/prof/classes"
          className="mt-6 inline-block rounded-[15px] bg-classe-purple/10 px-5 py-2 text-sm font-semibold text-classe-purple transition-transform hover:scale-105"
        >
          Gérer les classes
        </Link>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card, index) => (
          <Link
            key={card.href}
            href={card.href}
            className="group rounded-[25px] p-8 text-center text-white shadow-[0_8px_25px_rgba(0,0,0,0.1)] transition-all hover:-translate-y-2 hover:scale-105 hover:shadow-[0_15px_40px_rgba(0,0,0,0.2)]"
            style={{
              background: card.gradient,
              animation: `slideIn 0.5s ease-out ${index * 0.1}s both`,
            }}
          >
            <div className="mb-4 text-6xl animate-float">{card.emoji}</div>
            <h2 className="mb-3 text-3xl font-bold">{card.title}</h2>
            <p className="text-xl">
              {card.count !== null
                ? `${card.count} ${card.label}${card.count !== 1 ? "s" : ""}`
                : card.label}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
