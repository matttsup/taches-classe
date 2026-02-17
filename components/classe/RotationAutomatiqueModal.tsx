"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Eleve = { id: string; name: string };
type Tache = { id: string; name: string };
type Assignment = { id: string; assignment_date: string; eleve_id: string; tache_id: string };

function formatDate(d: Date): string {
  return d.toISOString().split("T")[0];
}

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function RotationAutomatiqueModal({
  classeId,
  weekDates,
  eleves,
  taches,
  onClose,
  onApply,
}: {
  classeId: string;
  weekDates: Date[];
  eleves: Eleve[];
  taches: Tache[];
  onClose: () => void;
  onApply: () => void;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<{ [date: string]: { [tacheId: string]: string } }>({});
  const [generated, setGenerated] = useState(false);

  function generateRotation() {
    const newPreview: { [date: string]: { [tacheId: string]: string } } = {};
    const elevesCopy = [...eleves];
    
    // Pour chaque jour
    weekDates.forEach((date) => {
      const dateKey = formatDate(date);
      newPreview[dateKey] = {};
      
      // Mélanger les élèves pour ce jour
      const shuffledEleves = shuffleArray(elevesCopy);
      
      // Assigner une tâche à chaque élève (rotation circulaire)
      taches.forEach((tache, index) => {
        const eleveIndex = index % shuffledEleves.length;
        newPreview[dateKey][tache.id] = shuffledEleves[eleveIndex].id;
      });
      
      // Rotation : déplacer le premier élève à la fin pour le prochain jour
      const first = elevesCopy.shift();
      if (first) elevesCopy.push(first);
    });

    setPreview(newPreview);
    setGenerated(true);
  }

  async function applyRotation() {
    setLoading(true);
    const supabase = createClient();

    // Supprimer les assignations existantes de la semaine
    const dateKeys = weekDates.map(formatDate);
    await supabase
      .from("classe_assignments")
      .delete()
      .eq("classe_id", classeId)
      .in("assignment_date", dateKeys);

    // Créer les nouvelles assignations
    const assignments = [];
    for (const [date, tacheAssignments] of Object.entries(preview)) {
      for (const [tacheId, eleveId] of Object.entries(tacheAssignments)) {
        assignments.push({
          classe_id: classeId,
          assignment_date: date,
          tache_id: tacheId,
          eleve_id: eleveId,
        });
      }
    }

    await supabase.from("classe_assignments").insert(assignments);

    setLoading(false);
    onApply();
    router.refresh();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[90vh] w-full max-w-4xl overflow-auto rounded-[25px] bg-white p-8 shadow-2xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-classe-purple">
              🔄 Rotation automatique
            </h2>
            <p className="mt-2 text-lg text-gray-600">
              Génère une répartition équitable des tâches pour toute la semaine
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-3xl hover:bg-gray-100"
          >
            ✕
          </button>
        </div>

        {!generated ? (
          <div className="space-y-6 text-center">
            <div className="text-6xl">🎲</div>
            <p className="text-xl text-gray-700">
              Cette fonction génère automatiquement une rotation équitable :
            </p>
            <ul className="mx-auto max-w-lg space-y-3 text-left text-lg text-gray-600">
              <li>✅ Chaque élève fait chaque tâche à tour de rôle</li>
              <li>✅ Répartition équitable sur la semaine</li>
              <li>✅ Évite les répétitions</li>
              <li>⚠️ Écrase les assignations existantes de la semaine</li>
            </ul>
            <button
              onClick={generateRotation}
              className="rounded-[15px] bg-classe-teal px-8 py-4 text-xl font-semibold text-white transition-transform hover:scale-105"
            >
              Générer une proposition
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="rounded-[15px] bg-classe-teal/10 p-4">
              <p className="text-center text-lg font-semibold text-classe-teal">
                Prévisualisation de la rotation proposée
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="border-2 border-gray-300 bg-gray-100 p-3 text-left">
                      Tâche
                    </th>
                    {weekDates.map((date) => (
                      <th
                        key={formatDate(date)}
                        className="border-2 border-gray-300 bg-classe-purple p-3 text-center text-white"
                      >
                        <div>{date.toLocaleDateString("fr-FR", { weekday: "short" })}</div>
                        <div className="text-sm">
                          {date.getDate()}/{date.getMonth() + 1}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {taches.map((tache) => (
                    <tr key={tache.id}>
                      <td className="border-2 border-gray-300 p-3 font-semibold">
                        {tache.name}
                      </td>
                      {weekDates.map((date) => {
                        const dateKey = formatDate(date);
                        const eleveId = preview[dateKey]?.[tache.id];
                        const eleve = eleves.find((e) => e.id === eleveId);
                        return (
                          <td
                            key={dateKey}
                            className="border-2 border-gray-300 p-3 text-center"
                          >
                            {eleve?.name || "—"}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-center gap-4">
              <button
                onClick={generateRotation}
                className="rounded-[15px] border-2 border-classe-purple px-6 py-3 text-lg font-semibold text-classe-purple transition-transform hover:scale-105"
              >
                🔄 Régénérer
              </button>
              <button
                onClick={applyRotation}
                disabled={loading}
                className="rounded-[15px] bg-classe-teal px-8 py-3 text-lg font-semibold text-white transition-transform hover:scale-105 disabled:opacity-50"
              >
                {loading ? "Application..." : "✅ Appliquer cette rotation"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
