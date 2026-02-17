import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { getOrCreateFirstClasse, getOrCreateFirstProf } from "@/lib/classe-active";

export default async function ClasseProfDashboardPage() {
  const supabase = await createClient();
  const prof = await getOrCreateFirstProf(supabase);
  const { classe } = await getOrCreateFirstClasse(supabase, prof.id);

  const { count: elevesCount } = await supabase
    .from("classe_eleves")
    .select("*", { count: "exact", head: true })
    .eq("classe_id", classe.id);

  const { count: tachesCount } = await supabase
    .from("classe_taches")
    .select("*", { count: "exact", head: true })
    .eq("classe_id", classe.id);

  const cards = [
    {
      href: "/classe/prof/eleves",
      emoji: "👥",
      title: "Élèves",
      count: elevesCount ?? 0,
      label: "élève",
      gradient: "linear-gradient(135deg, #A8E6CF 0%, #4ECDC4 100%)",
    },
    {
      href: "/classe/prof/taches",
      emoji: "✓",
      title: "Tâches",
      count: tachesCount ?? 0,
      label: "tâche",
      gradient: "linear-gradient(135deg, #FFD93D 0%, #FF8B94 100%)",
    },
    {
      href: "/classe/prof/calendrier",
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
        <div className="animate-float mb-4 text-[80px]">✨📚✨</div>
        <h1 className="mb-3 text-[42px] font-bold text-classe-purple">
          Bienvenue dans {classe.name}
        </h1>
        <p className="text-xl text-gray-600">
          Code de la classe :{" "}
          <strong className="rounded-xl bg-classe-teal/20 px-4 py-2 font-mono text-2xl text-classe-teal">
            {classe.code}
          </strong>
        </p>
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
