"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type ClasseRow = { id: string; name: string; code: string };

export function ClasseManager({
  profId,
  classes,
}: {
  profId: string;
  classes: ClasseRow[];
}) {
  const router = useRouter();
  const [newClassName, setNewClassName] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleCreate() {
    if (!newClassName.trim()) return;
    setLoading(true);

    const supabase = createClient();
    const code = Math.random().toString(36).slice(2, 8).toUpperCase();
    await supabase.from("classes").insert({
      prof_id: profId,
      name: newClassName.trim(),
      code,
    });

    setNewClassName("");
    setLoading(false);
    router.refresh();
  }

  async function handleDelete(classeId: string) {
    if (!confirm("Supprimer cette classe ? Toutes les données seront perdues.")) return;

    const supabase = createClient();
    await supabase.from("classes").delete().eq("id", classeId);
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <div className="flex gap-3">
        <input
          type="text"
          value={newClassName}
          onChange={(e) => setNewClassName(e.target.value)}
          placeholder="Nom de la nouvelle classe"
          onKeyPress={(e) => e.key === "Enter" && handleCreate()}
          className="flex-1 rounded-[10px] border-2 border-gray-200 px-4 py-3 text-base focus:border-classe-purple focus:outline-none"
        />
        <button
          onClick={handleCreate}
          disabled={loading}
          className="rounded-[10px] bg-classe-teal px-6 py-3 font-semibold text-white transition-transform hover:scale-105 disabled:opacity-50"
        >
          + Créer
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {classes.map((classe) => (
          <div
            key={classe.id}
            className="rounded-[20px] bg-gradient-to-br from-classe-purple to-classe-darkPurple p-6 text-white shadow-lg"
          >
            <div className="mb-3 text-3xl font-bold">{classe.name}</div>
            <div className="mb-4 rounded-lg bg-white/20 px-3 py-2 font-mono text-sm backdrop-blur-sm">
              Code : {classe.code}
            </div>
            <button
              onClick={() => handleDelete(classe.id)}
              className="w-full rounded-lg bg-white/20 px-4 py-2 text-sm font-semibold backdrop-blur-sm transition-transform hover:scale-105"
            >
              🗑️ Supprimer
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
