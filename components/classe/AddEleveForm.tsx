"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function AddEleveForm({ classeId }: { classeId: string }) {
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
      .from("classe_eleves")
      .select("display_order")
      .eq("classe_id", classeId)
      .order("display_order", { ascending: false })
      .limit(1)
      .single();

    const nextOrder = (existing as { display_order?: number } | null)?.display_order ?? -1;

    const { error: err } = await supabase.from("classe_eleves").insert({
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
    <form onSubmit={handleSubmit} className="flex flex-wrap items-center gap-3">
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Nouveau prénom"
        onKeyPress={(e) => e.key === "Enter" && handleSubmit(e)}
        className="flex-1 rounded-[10px] border-2 border-gray-200 px-4 py-3 text-base font-normal focus:border-classe-teal focus:outline-none"
      />
      <button
        type="submit"
        disabled={loading}
        className="rounded-[10px] bg-classe-teal px-5 py-3 font-semibold text-white hover:scale-105 disabled:opacity-50"
      >
        +
      </button>
      {error && <p className="w-full text-base text-red-600">{error}</p>}
    </form>
  );
}
