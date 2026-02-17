"use client";

import { useRouter } from "next/navigation";
import { DeleteTacheButton } from "./DeleteTacheButton";

type Tache = { id: string; name: string; display_order: number };

const TACHE_COLORS = [
  "#FF6B9D",
  "#4ECDC4",
  "#FFD93D",
  "#95E1D3",
  "#A8E6CF",
  "#FF8B94",
  "#C7CEEA",
];

export function TachesList({ taches }: { taches: Tache[]; classeId: string }) {
  const router = useRouter();

  if (taches.length === 0) {
    return (
      <p className="rounded-[15px] bg-gray-50 p-6 text-center text-lg text-gray-500">
        Aucune tâche. Ajoute-en une ou charge les tâches par défaut !
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {taches.map((tache, index) => (
        <div
          key={tache.id}
          className="flex items-center justify-between rounded-[15px] p-5 text-white shadow-[0_4px_10px_rgba(0,0,0,0.1)]"
          style={{
            background: TACHE_COLORS[index % TACHE_COLORS.length],
            animation: `slideIn 0.5s ease-out ${index * 0.05}s both`,
          }}
        >
          <span className="text-xl font-semibold">{tache.name}</span>
          <DeleteTacheButton
            tacheId={tache.id}
            tacheName={tache.name}
            onDeleted={() => router.refresh()}
          />
        </div>
      ))}
    </div>
  );
}
