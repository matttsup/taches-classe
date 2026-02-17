"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Role = "prof" | "eleve";

function randomClassCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export function CompleteProfileForm({ userEmail }: { userEmail: string }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [role, setRole] = useState<Role>("prof");
  const [classCode, setClassCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const { error: profileError } = await supabase.from("profiles").insert({
      user_id: user.id,
      role,
      name,
    });

    if (profileError) {
      setError(profileError.message);
      setLoading(false);
      return;
    }

    if (role === "prof") {
      const { data: prof, error: profError } = await supabase
        .from("profs")
        .insert({ user_id: user.id, name })
        .select("id")
        .single();

      if (profError) {
        setError(profError.message);
        setLoading(false);
        return;
      }

      const code = randomClassCode();
      const { error: classError } = await supabase.from("classes").insert({
        prof_id: prof!.id,
        name: "Ma classe",
        code,
      });

      if (classError) {
        setError(classError.message);
        setLoading(false);
        return;
      }
      setLoading(false);
      router.push("/classe/prof");
      router.refresh();
      return;
    }

    if (role === "eleve") {
      const code = classCode.trim().toUpperCase();
      if (!code) {
        setError("Indiquez le code de la classe fourni par votre enseignant.");
        setLoading(false);
        return;
      }

      const { data: classe, error: classLookupError } = await supabase
        .from("classes")
        .select("id")
        .eq("code", code)
        .single();

      if (classLookupError || !classe) {
        setError("Code de classe invalide. Vérifiez avec votre enseignant.");
        setLoading(false);
        return;
      }

      const { error: eleveError } = await supabase.from("classe_eleves").insert({
        classe_id: classe.id,
        name,
        user_id: user.id,
        display_order: 0,
      });

      if (eleveError) {
        setError(eleveError.message);
        setLoading(false);
        return;
      }
      setLoading(false);
      router.push("/classe/eleve");
      router.refresh();
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Nom complet
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-classe-green focus:outline-none focus:ring-1 focus:ring-classe-green"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Je suis
        </label>
        <div className="mt-2 flex gap-4">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="role"
              value="prof"
              checked={role === "prof"}
              onChange={() => setRole("prof")}
            />
            Enseignant
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="role"
              value="eleve"
              checked={role === "eleve"}
              onChange={() => setRole("eleve")}
            />
            Élève
          </label>
        </div>
      </div>
      {role === "eleve" && (
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Code de la classe
          </label>
          <input
            type="text"
            value={classCode}
            onChange={(e) => setClassCode(e.target.value.toUpperCase())}
            placeholder="Ex: AB12CD"
            maxLength={10}
            className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-classe-green focus:outline-none focus:ring-1 focus:ring-classe-green"
          />
          <p className="mt-1 text-xs text-gray-500">
            Demandez le code à votre enseignant.
          </p>
        </div>
      )}
      {error && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-classe-green px-4 py-2 font-medium text-white transition hover:bg-classe-green/90 disabled:opacity-50"
      >
        {loading ? "Enregistrement..." : "Continuer"}
      </button>
    </form>
  );
}
