"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Eleve = { id: string; name: string };
type Tache = { id: string; name: string };
type Assignment = { id: string; assignment_date: string; eleve_id: string; tache_id: string };

const TACHE_COLORS = [
  "#FF6B9D",
  "#4ECDC4",
  "#FFD93D",
  "#95E1D3",
  "#A8E6CF",
  "#FF8B94",
  "#C7CEEA",
];

function formatDate(d: Date): string {
  return d.toISOString().split("T")[0];
}

function toLocalDate(s: string): Date {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function getMonthName(date: Date): string {
  const months = [
    "Janvier",
    "Février",
    "Mars",
    "Avril",
    "Mai",
    "Juin",
    "Juillet",
    "Août",
    "Septembre",
    "Octobre",
    "Novembre",
    "Décembre",
  ];
  return months[date.getMonth()];
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
  const [currentWeekOffset, setCurrentWeekOffset] = useState(0);

  function getWeekDates(offset = 0): Date[] {
    const today = new Date();
    today.setDate(today.getDate() + offset * 7);
    const current = new Date(today);
    current.setDate(current.getDate() - current.getDay() + 1); // Monday

    const week = [];
    for (let i = 0; i < 5; i++) {
      week.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    return week;
  }

  const weekDates = getWeekDates(currentWeekOffset);
  const today = formatDate(new Date());

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

  if (taches.length === 0) {
    return (
      <div className="rounded-[25px] bg-gradient-to-br from-classe-yellow to-classe-coral p-8 text-center text-white">
        <p className="text-xl font-semibold">
          Ajoute d&apos;abord des tâches dans l&apos;onglet Tâches pour pouvoir
          les répartir sur le calendrier.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-[20px] bg-white p-6 shadow-[0_4px_15px_rgba(0,0,0,0.08)]">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b-2 border-gray-100 pb-6">
        <div className="flex items-center gap-3">
          <span className="text-3xl">📅</span>
          <span className="text-3xl font-bold text-classe-purple">
            {getMonthName(weekDates[0])} {weekDates[0].getFullYear()}
          </span>
        </div>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => setCurrentWeekOffset((o) => o - 1)}
            className="rounded-[12px] bg-classe-purple px-5 py-3 text-lg font-semibold text-white transition-transform hover:scale-105"
          >
            ← Précédent
          </button>
          <button
            type="button"
            onClick={() => setCurrentWeekOffset((o) => o + 1)}
            className="rounded-[12px] bg-classe-purple px-5 py-3 text-lg font-semibold text-white transition-transform hover:scale-105"
          >
            Suivant →
          </button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {weekDates.map((date, dayIndex) => {
          const dateKey = formatDate(date);
          const isToday = dateKey === today;

          return (
            <div
              key={dateKey}
              className={`rounded-[15px] p-4 ${
                isToday ? "border-3 bg-[#FFF9E3] border-[#FFD93D]" : "bg-gray-50"
              }`}
            >
              <div className="mb-4 border-b-2 border-gray-200 pb-3 text-center">
                <div className="text-lg font-bold text-classe-purple">
                  {date.toLocaleDateString("fr-FR", { weekday: "short" })}
                </div>
                <div className="text-2xl font-bold text-gray-900">{date.getDate()}</div>
              </div>

              <div className="space-y-3">
                {taches.map((tache, tacheIndex) => {
                  const assign = getAssignment(dateKey, tache.id);
                  const key = `${dateKey}-${tache.id}`;
                  const isBusy = loading === key;
                  const color = TACHE_COLORS[tacheIndex % TACHE_COLORS.length];

                  return (
                    <div key={tache.id} className="space-y-1">
                      <div
                        className="text-xs font-semibold"
                        style={{ color }}
                      >
                        {tache.name}
                      </div>
                      <select
                        value={assign?.eleve_id ?? ""}
                        onChange={(e) => {
                          const v = e.target.value;
                          if (v) setAssignment(dateKey, tache.id, v);
                        }}
                        disabled={isBusy || eleves.length === 0}
                        className={`w-full rounded-[8px] border-2 px-2 py-2 text-xs font-semibold ${
                          assign?.eleve_id
                            ? "text-white"
                            : "bg-white text-gray-700"
                        }`}
                        style={{
                          borderColor: color,
                          background: assign?.eleve_id ? color : "white",
                        }}
                      >
                        <option value="">Choisir...</option>
                        {eleves.map((e) => (
                          <option key={e.id} value={e.id}>
                            {e.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
