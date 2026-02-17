"use client";

import { useRouter } from "next/navigation";
import { DeleteEleveButton } from "./DeleteEleveButton";

type Eleve = {
  id: string;
  name: string;
  user_id: string | null;
  display_order: number;
  totalTaches?: number;
};

function getMedaille(totalTaches: number): { emoji: string; color: string } | null {
  if (totalTaches >= 25) return { emoji: "🥇", color: "from-yellow-400 to-yellow-600" };
  if (totalTaches >= 10) return { emoji: "🥈", color: "from-gray-300 to-gray-500" };
  if (totalTaches >= 5) return { emoji: "🥉", color: "from-orange-400 to-orange-600" };
  return null;
}

export function ElevesList({ eleves, classeId }: { eleves: Eleve[]; classeId: string }) {
  const router = useRouter();

  if (eleves.length === 0) {
    return (
      <p className="rounded-[15px] bg-gray-50 p-6 text-center text-lg text-gray-500">
        Aucun élève. Ajoute-en un ci-dessus !
      </p>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {eleves.map((eleve, index) => {
        const medaille = getMedaille(eleve.totalTaches || 0);
        return (
          <div
            key={eleve.id}
            className="relative rounded-[15px] bg-gradient-to-br from-classe-mintGreen to-classe-teal p-6 text-white shadow-[0_5px_15px_rgba(78,205,196,0.3)]"
            style={{
              animation: `slideIn 0.5s ease-out ${index * 0.05}s both`,
            }}
          >
            {/* Médaille en haut à droite */}
            {medaille && (
              <div
                className={`absolute -right-2 -top-2 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br ${medaille.color} text-2xl shadow-lg`}
              >
                {medaille.emoji}
              </div>
            )}

            <div className="mb-3 text-2xl font-semibold">{eleve.name}</div>

            {/* Indicateur de tâches */}
            <div className="mb-4 rounded-[10px] bg-white/20 px-3 py-2 backdrop-blur-sm">
              <div className="text-sm font-medium">
                📋 {eleve.totalTaches || 0} tâche{(eleve.totalTaches || 0) !== 1 ? "s" : ""}
              </div>
            </div>

            <DeleteEleveButton
              eleveId={eleve.id}
              eleveName={eleve.name}
              onDeleted={() => router.refresh()}
            />
          </div>
        );
      })}
    </div>
  );
}
