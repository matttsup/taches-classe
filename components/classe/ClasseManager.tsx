"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type ClasseRow = { id: string; name: string };

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
    await supabase.from("classes").insert({
      prof_id: profId,
      name: newClassName.trim(),
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

  async function handleRename(classeId: string, currentName: string) {
    const newName = prompt("Nouveau nom de classe :", currentName);
    if (!newName || !newName.trim()) return;

    const supabase = createClient();
    await supabase.from("classes").update({ name: newName.trim() }).eq("id", classeId);
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <div className="flex gap-3">
        <input
          type="text"
          value={newClassName}
          onChange={(e) => setNewClassName(e.target.value)}
          placeholder="Nom de la nouvelle classe (ex: 502)"
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
            <div className="mb-4 text-3xl font-bold">{classe.name}</div>
            <div className="flex gap-2">
              <button
                onClick={() => handleRename(classe.id, classe.name)}
                className="flex-1 rounded-lg bg-white/20 px-4 py-2 text-sm font-semibold backdrop-blur-sm transition-transform hover:scale-105"
              >
                ✏️ Renommer
              </button>
              <button
                onClick={() => handleDelete(classe.id)}
                className="flex-1 rounded-lg bg-white/20 px-4 py-2 text-sm font-semibold backdrop-blur-sm transition-transform hover:scale-105"
              >
                🗑️ Supprimer
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
