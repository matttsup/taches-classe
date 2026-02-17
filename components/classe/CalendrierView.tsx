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

function toLocalDate(s: string): Date {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function CalendrierView({
  classeId,
  eleves,
  taches,
  assignments,
}: {
  classeId: string;
  eleves: Eleve[];
  taches: Tache[];
  assignments: Assignment[];
}) {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState<string>(() => formatDate(new Date()));

  const start = new Date(selectedDate);
  start.setDate(start.getDate() - start.getDay() + (start.getDay() === 0 ? -6 : 1));
  const weekDays: string[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(start);
    d.setDate(d.getDate() + i);
    weekDays.push(formatDate(d));
  }

  const getAssignment = (date: string, tacheId: string) =>
    assignments.find((a) => a.assignment_date === date && a.tache_id === tacheId);

  const [loading, setLoading] = useState<string | null>(null);

  async function setAssignment(date: string, tacheId: string, eleveId: string | null) {
    if (!eleveId) return;
    setLoading(`${date}-${tacheId}`);
    const supabase = createClient();
    const existing = getAssignment(date, tacheId);
    if (existing) {
      await supabase.from("classe_assignments").update({ eleve_id: eleveId }).eq("id", existing.id);
    } else {
      await supabase.from("classe_assignments").insert({
        classe_id: classeId,
        assignment_date: date,
        tache_id: tacheId,
        eleve_id: eleveId,
      });
    }
    setLoading(null);
    router.refresh();
  }

  async function clearAssignment(date: string, tacheId: string) {
    const existing = getAssignment(date, tacheId);
    if (!existing) return;
    setLoading(`${date}-${tacheId}`);
    const supabase = createClient();
    await supabase.from("classe_assignments").delete().eq("id", existing.id);
    setLoading(null);
    router.refresh();
  }

  const goPrevWeek = () => {
    const d = toLocalDate(selectedDate);
    d.setDate(d.getDate() - 7);
    setSelectedDate(formatDate(d));
  };
  const goNextWeek = () => {
    const d = toLocalDate(selectedDate);
    d.setDate(d.getDate() + 7);
    setSelectedDate(formatDate(d));
  };
  const goToday = () => setSelectedDate(formatDate(new Date()));

  if (taches.length === 0) {
    return (
      <div className="rounded-xl bg-amber-50 p-6 text-amber-800">
        <p>
          Ajoutez d&apos;abord des tâches dans l&apos;onglet Tâches pour pouvoir
          les répartir sur le calendrier.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-teal-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-gray-200 p-3">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={goPrevWeek}
            className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium hover:bg-gray-50"
          >
            Semaine précédente
          </button>
          <button
            type="button"
            onClick={goNextWeek}
            className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium hover:bg-gray-50"
          >
            Semaine suivante
          </button>
          <button
            type="button"
            onClick={goToday}
            className="rounded-lg border border-classe-green px-3 py-1.5 text-sm font-medium text-classe-green hover:bg-classe-green/10"
          >
            Aujourd&apos;hui
          </button>
        </div>
      </div>

      <table className="w-full min-w-[600px] border-collapse">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50">
            <th className="p-2 text-left text-sm font-semibold text-gray-700">
              Tâche
            </th>
            {weekDays.map((day) => {
              const d = toLocalDate(day);
              const isToday = formatDate(new Date()) === day;
              return (
                <th
                  key={day}
                  className={`min-w-[120px] border-l border-gray-200 p-2 text-center text-sm font-semibold ${
                    isToday ? "bg-classe-green/15 text-classe-green" : "text-gray-700"
                  }`}
                >
                  <div>{d.toLocaleDateString("fr-FR", { weekday: "short" })}</div>
                  <div className="text-xs font-normal">
                    {d.getDate()}/{d.getMonth() + 1}
                  </div>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {taches.map((tache) => (
            <tr key={tache.id} className="border-b border-gray-100">
              <td className="border-r border-gray-100 p-2 font-medium text-gray-900">
                {tache.name}
              </td>
              {weekDays.map((day) => {
                const assign = getAssignment(day, tache.id);
                const key = `${day}-${tache.id}`;
                const isBusy = loading === key;
                return (
                  <td key={key} className="border-l border-gray-100 p-2 align-top">
                    <select
                      value={assign?.eleve_id ?? ""}
                      onChange={(e) => {
                        const v = e.target.value;
                        if (v) setAssignment(day, tache.id, v);
                      }}
                      disabled={isBusy || eleves.length === 0}
                      className="w-full rounded border border-gray-300 py-1.5 pl-2 pr-6 text-sm focus:border-classe-green focus:outline-none focus:ring-1 focus:ring-classe-green disabled:opacity-50"
                    >
                      <option value="">—</option>
                      {eleves.map((e) => (
                        <option key={e.id} value={e.id}>
                          {e.name}
                        </option>
                      ))}
                    </select>
                    {assign && (
                      <button
                        type="button"
                        onClick={() => clearAssignment(day, tache.id)}
                        disabled={isBusy}
                        className="mt-1 block w-full text-xs text-red-600 hover:underline disabled:opacity-50"
                      >
                        Effacer
                      </button>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
