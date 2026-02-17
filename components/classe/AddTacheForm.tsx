"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function AddTacheForm({ classeId }: { classeId: string }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { data: existing } = await supabase
      .from("classe_taches")
      .select("display_order")
      .eq("classe_id", classeId)
      .order("display_order", { ascending: false })
      .limit(1)
      .single();

    const nextOrder = (existing as { display_order?: number } | null)?.display_order ?? -1;

    const { error: err } = await supabase.from("classe_taches").insert({
      classe_id: classeId,
      name: name.trim(),
      display_order: nextOrder + 1,
    });

    if (err) {
      setError(err.message);
      setLoading(false);
      return;
    }

    setName("");
    setLoading(false);
    router.refresh();
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-wrap items-end gap-4 rounded-2xl border-2 border-teal-200 bg-white p-5 shadow-sm"
    >
      <div className="min-w-[200px] flex-1">
        <label htmlFor="tache-name" className="block text-base font-semibold text-gray-700">
          Ajouter une tâche
        </label>
        <input
          id="tache-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ex: Ramasser les crayons"
          required
          className="mt-2 block w-full rounded-xl border-2 border-gray-300 px-4 py-3 text-base focus:border-classe-green focus:outline-none focus:ring-2 focus:ring-classe-green/30"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="rounded-xl bg-classe-green px-5 py-3 text-base font-semibold text-white hover:bg-classe-green/90 disabled:opacity-50"
      >
        {loading ? "Ajout..." : "➕ Ajouter"}
      </button>
      {error && <p className="w-full text-base text-red-600">{error}</p>}
    </form>
  );
}
