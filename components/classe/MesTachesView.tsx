"use client";

import { useState } from "react";

type Assignment = { id: string; assignment_date: string; tache_id: string };

function formatDate(s: string): string {
  const d = new Date(s + "T12:00:00");
  return d.toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

export function MesTachesView({
  assignments,
  taches,
}: {
  assignments: Assignment[];
  taches: { id: string; name: string }[];
}) {
  const [showPast, setShowPast] = useState(false);
  const today = new Date().toISOString().split("T")[0];
  const tacheMap = new Map(taches.map((t) => [t.id, t.name]));

  const future = assignments.filter((a) => a.assignment_date >= today);
  const past = assignments.filter((a) => a.assignment_date < today);

  const groupedByDate = (list: Assignment[]) => {
    const map = new Map<string, Assignment[]>();
    for (const a of list) {
      const arr = map.get(a.assignment_date) ?? [];
      arr.push(a);
      map.set(a.assignment_date, arr);
    }
    return Array.from(map.entries()).sort(([a], [b]) => a.localeCompare(b));
  };

  if (assignments.length === 0) {
    return (
      <div className="rounded-xl border border-teal-200 bg-white p-6 shadow-sm">
        <p className="text-gray-600">
          Aucune tâche ne t&apos;est assignée pour le moment. Ton enseignant
          remplira le calendrier.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-teal-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 font-semibold text-gray-900">À venir</h2>
        {groupedByDate(future).length === 0 ? (
          <p className="text-gray-500">Aucune tâche à venir.</p>
        ) : (
          <ul className="space-y-4">
            {groupedByDate(future).map(([date, list]) => (
              <li key={date} className="border-l-4 border-classe-green pl-4">
                <div className="font-medium text-gray-900">{formatDate(date)}</div>
                <ul className="mt-1 list-inside list-disc text-gray-600">
                  {list.map((a) => (
                    <li key={a.id}>{tacheMap.get(a.tache_id) ?? "—"}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        )}
      </div>

      {past.length > 0 && (
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <button
            type="button"
            onClick={() => setShowPast(!showPast)}
            className="font-semibold text-gray-700 hover:text-classe-green"
          >
            {showPast ? "Masquer" : "Afficher"} les tâches passées ({past.length})
          </button>
          {showPast && (
            <ul className="mt-4 space-y-3">
              {groupedByDate(past).map(([date, list]) => (
                <li key={date} className="text-sm text-gray-600">
                  <span className="font-medium">{formatDate(date)}</span>
                  {" — "}
                  {list.map((a) => tacheMap.get(a.tache_id) ?? "—").join(", ")}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
