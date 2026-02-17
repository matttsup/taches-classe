"use client";

import { useRouter } from "next/navigation";
import { DeleteTacheButton } from "./DeleteTacheButton";

type Tache = { id: string; name: string; display_order: number };

export function TachesList({ taches }: { taches: Tache[]; classeId: string }) {
  const router = useRouter();

  if (taches.length === 0) {
    return (
      <p className="rounded-lg bg-gray-50 p-4 text-gray-500">
        Aucune tâche. Ajoutez-en une ou chargez les tâches par défaut.
      </p>
    );
  }

  return (
    <ul className="divide-y divide-gray-100">
      {taches.map((tache) => (
        <li
          key={tache.id}
          className="flex items-center justify-between py-3 first:pt-0"
        >
          <span className="font-medium text-gray-900">{tache.name}</span>
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
