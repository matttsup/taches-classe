"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const DEFAULT_TACHES = [
  "Balai",
  "Ranger les chaises",
  "Collation",
  "Tableau",
  "Distribuer les cahiers",
  "Arroser les plantes",
  "Effacer le tableau",
  "Porte / Lumières",
];

export function SeedDefaultTaches({ classeId }: { classeId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSeed() {
    setLoading(true);
    const supabase = createClient();
    for (let i = 0; i < DEFAULT_TACHES.length; i++) {
      await supabase.from("classe_taches").insert({
        classe_id: classeId,
        name: DEFAULT_TACHES[i],
        display_order: i,
      });
    }
    setLoading(false);
    router.refresh();
  }

  return (
    <div className="rounded-2xl border-2 border-amber-200 bg-amber-50 p-5">
      <p className="text-base text-amber-800">
        Aucune tâche. Charge une liste par défaut ou ajoute-les une par une.
      </p>
      <button
        type="button"
        onClick={handleSeed}
        disabled={loading}
        className="mt-4 rounded-xl bg-amber-500 px-5 py-3 text-base font-semibold text-white hover:bg-amber-600 disabled:opacity-50"
      >
        {loading ? "Chargement..." : "✨ Charger les tâches par défaut"}
      </button>
    </div>
  );
}
