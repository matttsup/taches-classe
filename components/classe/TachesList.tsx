"use client";

import { useRouter } from "next/navigation";
import { DeleteTacheButton } from "./DeleteTacheButton";

type Tache = { id: string; name: string; display_order: number };

export function TachesList({ taches }: { taches: Tache[]; classeId: string }) {
  const router = useRouter();

  if (taches.length === 0) {
    return (
      <p className="rounded-2xl bg-gray-50 p-5 text-base text-gray-500">
        Aucune tâche. Ajoute-en une ou charge les tâches par défaut.
      </p>
    );
  }

  return (
    <ul className="divide-y-2 divide-gray-100">
      {taches.map((tache) => (
        <li
          key={tache.id}
          className="flex items-center justify-between py-4 first:pt-0"
        >
          <span className="text-lg font-semibold text-gray-900">{tache.name}</span>
          <DeleteTacheButton
            tacheId={tache.id}
            tacheName={tache.name}
            onDeleted={() => router.refresh()}
          />
        </li>
      ))}
    </ul>
  );
}
