"use client";

import { useRouter } from "next/navigation";
import { DeleteEleveButton } from "./DeleteEleveButton";

type Eleve = { id: string; name: string; user_id: string | null; display_order: number };

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
      {eleves.map((eleve, index) => (
        <div
          key={eleve.id}
          className="rounded-[15px] bg-gradient-to-br from-classe-mintGreen to-classe-teal p-6 text-center text-white shadow-[0_5px_15px_rgba(78,205,196,0.3)]"
          style={{
            animation: `slideIn 0.5s ease-out ${index * 0.05}s both`,
          }}
        >
          <div className="mb-3 text-2xl font-semibold">{eleve.name}</div>
          <DeleteEleveButton
            eleveId={eleve.id}
            eleveName={eleve.name}
            onDeleted={() => router.refresh()}
          />
        </div>
      ))}
    </div>
  );
}
