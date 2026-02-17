"use client";

import { useRouter } from "next/navigation";
import { DeleteEleveButton } from "./DeleteEleveButton";

type Eleve = { id: string; name: string; user_id: string | null; display_order: number };

export function ElevesList({ eleves, classeId }: { eleves: Eleve[]; classeId: string }) {
  const router = useRouter();

  if (eleves.length === 0) {
    return (
      <p className="rounded-2xl bg-gray-50 p-5 text-base text-gray-500">
        Aucun élève. Ajoute-en un ci-dessus.
      </p>
    );
  }

  return (
    <ul className="divide-y-2 divide-gray-100">
      {eleves.map((eleve) => (
        <li key={eleve.id} className="flex items-center justify-between py-4 first:pt-0">
          <span className="text-lg font-semibold text-gray-900">{eleve.name}</span>
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
