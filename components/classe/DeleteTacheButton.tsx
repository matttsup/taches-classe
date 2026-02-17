"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function DeleteTacheButton({
  tacheId,
  tacheName,
  onDeleted,
}: {
  tacheId: string;
  tacheName: string;
  onDeleted: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [confirm, setConfirm] = useState(false);

  async function handleDelete() {
    setLoading(true);
    const supabase = createClient();
    await supabase.from("classe_taches").delete().eq("id", tacheId);
    setLoading(false);
    setConfirm(false);
    onDeleted();
  }

  if (confirm) {
    return (
      <span className="flex items-center gap-2 text-sm">
        <span className="text-gray-600">Supprimer &quot;{tacheName}&quot; ?</span>
        <button
          onClick={handleDelete}
          disabled={loading}
          className="rounded bg-red-600 px-2 py-1 text-white hover:bg-red-700 disabled:opacity-50"
        >
          Oui
        </button>
        <button
          onClick={() => setConfirm(false)}
          className="rounded bg-gray-200 px-2 py-1 text-gray-700 hover:bg-gray-300"
        >
          Non
        </button>
      </span>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setConfirm(true)}
      className="rounded text-sm text-red-600 hover:underline"
    >
      Supprimer
    </button>
  );
}
