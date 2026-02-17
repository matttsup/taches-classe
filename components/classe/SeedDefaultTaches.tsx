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
    <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
      <p className="text-sm text-amber-800">
        Aucune tâche. Chargez une liste par défaut ou ajoutez-les une par une.
      </p>
      <button
        type="button"
        onClick={handleSeed}
        disabled={loading}
        className="mt-3 rounded-lg bg-amber-600 px-4 py-2 text-sm font-medium text-white hover:bg-amber-700 disabled:opacity-50"
      >
        {loading ? "Chargement..." : "Charger les tâches par défaut"}
      </button>
    </div>
  );
}
