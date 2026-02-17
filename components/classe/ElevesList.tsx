"use client";

import { useRouter } from "next/navigation";
import { DeleteEleveButton } from "./DeleteEleveButton";

type Eleve = { id: string; name: string; user_id: string | null; display_order: number };

export function ElevesList({ eleves, classeId }: { eleves: Eleve[]; classeId: string }) {
  const router = useRouter();

  if (eleves.length === 0) {
    return (
      <p className="rounded-lg bg-gray-50 p-4 text-gray-500">
        Aucun élève. Ajoutez-en un ci-dessus ou partagez le code aux élèves.
      </p>
    );
  }

  return (
    <ul className="divide-y divide-gray-100">
      {eleves.map((eleve) => (
        <li key={eleve.id} className="flex items-center justify-between py-3 first:pt-0">
          <span className="font-medium text-gray-900">
            {eleve.name}
            {eleve.user_id ? (
              <span className="ml-2 text-xs text-gray-400">(compte connecté)</span>
            ) : null}
          </span>
          <DeleteEleveButton
            eleveId={eleve.id}
            eleveName={eleve.name}
            onDeleted={() => router.refresh()}
          />
        </li>
      ))}
    </ul>
  );
}
