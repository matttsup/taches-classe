"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { badges, calculatePoints, getNextBadge, getBadgesForTaches, type BadgeType } from "@/lib/gamification";

type EleveStats = {
  id: string;
  name: string;
  points: number;
  badges: string[] | null;
  totalTaches: number;
};

export function StatistiquesView({
  classeId,
  eleves,
}: {
  classeId: string;
  eleves: EleveStats[];
}) {
  const router = useRouter();
  const [eleveStarId, setEleveStarId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Trier par total tâches
  const sorted = [...eleves].sort((a, b) => b.totalTaches - a.totalTaches);
  const maxTaches = sorted[0]?.totalTaches || 1;

  async function addPoints(eleveId: string, points: number) {
    setLoading(true);
    const supabase = createClient();
    const eleve = eleves.find((e) => e.id === eleveId);
    if (!eleve) return;

    await supabase
      .from("classe_eleves")
      .update({ points: (eleve.points || 0) + points })
      .eq("id", eleveId);

    setLoading(false);
    router.refresh();
  }

  async function addBadge(eleveId: string, badge: BadgeType) {
    setLoading(true);
    const supabase = createClient();
    const eleve = eleves.find((e) => e.id === eleveId);
    if (!eleve) return;

    const currentBadges = eleve.badges || [];
    if (!currentBadges.includes(badge)) {
      await supabase
        .from("classe_eleves")
        .update({ badges: [...currentBadges, badge] })
        .eq("id", eleveId);
    }

    setLoading(false);
    router.refresh();
  }

  async function setEleveveDeLaSemaine(eleveId: string) {
    if (!confirm("Désigner cet élève comme élève de la semaine ?")) return;
    await addBadge(eleveId, "star");
    await addPoints(eleveId, 50);
    setEleveStarId(eleveId);
  }

  return (
    <div className="space-y-8">
      {/* Podium Top 3 */}
      <div className="rounded-[20px] bg-gradient-to-br from-classe-yellow to-classe-coral p-8 text-white">
        <h2 className="mb-6 text-center text-3xl font-bold">🏆 Podium de la classe</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {sorted.slice(0, 3).map((eleve, index) => {
            const medals = ["🥇", "🥈", "🥉"];
            return (
              <div
                key={eleve.id}
                className="rounded-[15px] bg-white/20 p-6 text-center backdrop-blur-sm"
                style={{ animation: `bounceIn ${0.3 + index * 0.1}s ease-out` }}
              >
                <div className="mb-2 text-5xl">{medals[index]}</div>
                <div className="text-2xl font-bold">{eleve.name}</div>
                <div className="mt-2 text-xl">{eleve.totalTaches} tâches</div>
                <div className="text-lg">{eleve.points || 0} points</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Graphique équité */}
      <div className="rounded-[20px] bg-white p-6 shadow-[0_4px_15px_rgba(0,0,0,0.08)]">
        <h2 className="mb-6 text-2xl font-bold text-classe-purple">
          📊 Répartition des tâches
        </h2>
        <div className="space-y-3">
          {sorted.map((eleve) => {
            const percentage = maxTaches > 0 ? (eleve.totalTaches / maxTaches) * 100 : 0;
            return (
              <div key={eleve.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-gray-900">{eleve.name}</span>
                  <span className="text-sm text-gray-600">
                    {eleve.totalTaches} tâche{eleve.totalTaches !== 1 ? "s" : ""}
                  </span>
                </div>
                <div className="h-8 overflow-hidden rounded-full bg-gray-200">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-classe-teal to-classe-lightTeal transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Badges et récompenses */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-[20px] bg-white p-6 shadow-[0_4px_15px_rgba(0,0,0,0.08)]">
          <h2 className="mb-6 text-2xl font-bold text-classe-purple">⭐ Badges</h2>
          <div className="space-y-4">
            {eleves.map((eleve) => {
              const earnedBadges = getBadgesForTaches(eleve.totalTaches);
              const eleveBadges = eleve.badges || [];
              const allBadges = [...new Set([...earnedBadges, ...eleveBadges])];
              const next = getNextBadge(eleve.totalTaches);

              return (
                <div
                  key={eleve.id}
                  className="rounded-[15px] border-2 border-gray-200 p-4"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-lg font-bold text-gray-900">{eleve.name}</span>
                    <div className="flex gap-1">
                      {allBadges.slice(0, 5).map((badgeKey) => (
                        <span
                          key={badgeKey}
                          className="text-2xl"
                          title={badges[badgeKey as BadgeType]?.name}
                        >
                          {badges[badgeKey as BadgeType]?.emoji}
                        </span>
                      ))}
                    </div>
                  </div>
                  {next && (
                    <div className="text-sm text-gray-600">
                      Prochain badge : {badges[next.badge].emoji} {badges[next.badge].name} (
                      {next.remaining} tâche{next.remaining > 1 ? "s" : ""} restante
                      {next.remaining > 1 ? "s" : ""})
                    </div>
                  )}
                  <button
                    onClick={() => addBadge(eleve.id, "star")}
                    disabled={loading || eleveBadges.includes("star")}
                    className="mt-3 w-full rounded-[10px] bg-classe-yellow px-4 py-2 text-sm font-semibold text-white transition-transform hover:scale-105 disabled:opacity-50"
                  >
                    ✨ Nommer élève de la semaine
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Points */}
        <div className="rounded-[20px] bg-white p-6 shadow-[0_4px_15px_rgba(0,0,0,0.08)]">
          <h2 className="mb-6 text-2xl font-bold text-classe-purple">🌟 Points</h2>
          <div className="space-y-4">
            {sorted.map((eleve, index) => {
              const calculatedPoints = calculatePoints(eleve.totalTaches);
              const totalPoints = (eleve.points || 0) + calculatedPoints;

              return (
                <div
                  key={eleve.id}
                  className="rounded-[15px] border-2 border-gray-200 p-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl font-bold text-classe-purple">
                        #{index + 1}
                      </span>
                      <div>
                        <div className="font-bold text-gray-900">{eleve.name}</div>
                        <div className="text-sm text-gray-600">
                          {eleve.totalTaches} tâche{eleve.totalTaches !== 1 ? "s" : ""}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-classe-teal">
                        {totalPoints}
                      </div>
                      <div className="text-xs text-gray-500">points</div>
                    </div>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <button
                      onClick={() => addPoints(eleve.id, 10)}
                      disabled={loading}
                      className="flex-1 rounded-[10px] bg-classe-teal/20 px-3 py-2 text-sm font-semibold text-classe-teal transition-transform hover:scale-105 disabled:opacity-50"
                    >
                      +10 pts
                    </button>
                    <button
                      onClick={() => addPoints(eleve.id, 50)}
                      disabled={loading}
                      className="flex-1 rounded-[10px] bg-classe-yellow/20 px-3 py-2 text-sm font-semibold text-[#e0a800] transition-transform hover:scale-105 disabled:opacity-50"
                    >
                      +50 pts
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Tableau d'honneur */}
      <div className="rounded-[20px] bg-gradient-to-br from-classe-purple to-classe-darkPurple p-8 text-white">
        <h2 className="mb-6 text-center text-3xl font-bold">✨ Tableau d&apos;honneur ✨</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sorted.slice(0, 6).map((eleve, index) => {
            const eleveBadges = eleve.badges || [];
            return (
              <div
                key={eleve.id}
                className="rounded-[15px] bg-white/10 p-5 text-center backdrop-blur-sm"
                style={{ animation: `slideIn 0.5s ease-out ${index * 0.1}s both` }}
              >
                <div className="mb-3 text-4xl">
                  {eleveBadges.includes("star") ? "⭐" : "🌟"}
                </div>
                <div className="text-xl font-bold">{eleve.name}</div>
                <div className="mt-2 text-lg">
                  {(eleve.points || 0) + calculatePoints(eleve.totalTaches)} points
                </div>
                <div className="mt-2 flex justify-center gap-1">
                  {eleveBadges.slice(0, 4).map((badge, i) => (
                    <span key={i} className="text-xl">
                      {badges[badge as BadgeType]?.emoji}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
