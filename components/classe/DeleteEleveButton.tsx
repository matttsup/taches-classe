"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function DeleteEleveButton({
  eleveId,
  eleveName,
  onDeleted,
}: {
  eleveId: string;
  eleveName: string;
  onDeleted: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [confirm, setConfirm] = useState(false);

  async function handleDelete() {
    setLoading(true);
    const supabase = createClient();
    await supabase.from("classe_eleves").delete().eq("id", eleveId);
    setLoading(false);
    setConfirm(false);
    onDeleted();
  }

  if (confirm) {
    return (
      <div className="flex items-center justify-center gap-2">
        <button
          onClick={handleDelete}
          disabled={loading}
          className="rounded-lg bg-white/30 px-3 py-1.5 text-sm font-semibold backdrop-blur-sm hover:bg-white/50 disabled:opacity-50"
        >
          Oui
        </button>
        <button
          onClick={() => setConfirm(false)}
          className="rounded-lg bg-white/30 px-3 py-1.5 text-sm font-semibold backdrop-blur-sm hover:bg-white/50"
        >
          Non
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setConfirm(true)}
      className="rounded-lg bg-white/30 px-3 py-1.5 text-sm font-semibold backdrop-blur-sm hover:bg-white/50"
    >
      🗑️ Supprimer
    </button>
  );
}
