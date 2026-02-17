"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const DEFAULT_TACHES = [
  "🧹 Balai",
  "🪑 Ranger les chaises",
  "🍎 Collation",
  "📚 Bibliothèque",
  "🪴 Arroser les plantes",
  "🖍️ Distribuer le matériel",
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
    <div className="mb-6 rounded-[20px] bg-gradient-to-br from-classe-yellow to-classe-coral p-6 text-white">
      <p className="mb-4 text-lg font-semibold">
        Aucune tâche. Charge une liste par défaut ou ajoute-les une par une !
      </p>
      <button
        type="button"
        onClick={handleSeed}
        disabled={loading}
        className="rounded-[15px] bg-white/30 px-6 py-3 font-semibold backdrop-blur-sm transition-transform hover:scale-105 disabled:opacity-50"
      >
        {loading ? "Chargement..." : "✨ Charger les tâches par défaut"}
      </button>
    </div>
  );
}
