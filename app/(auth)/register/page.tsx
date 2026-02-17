"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState<"prof" | "eleve">("prof");
  const [classCode, setClassCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${typeof window !== "undefined" ? window.location.origin : ""}/`,
        data: { role, name, classCode: role === "eleve" ? classCode.trim().toUpperCase() : null },
      },
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    if (!authData.user) {
      setError("Erreur lors de la création du compte");
      setLoading(false);
      return;
    }

    setLoading(false);
    router.push("/");
    router.refresh();
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center text-4xl">📋</div>
        <h1 className="text-2xl font-bold text-classe-green">Inscription</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Nom complet
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-classe-green focus:outline-none focus:ring-1 focus:ring-classe-green"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-classe-green focus:outline-none focus:ring-1 focus:ring-classe-green"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Mot de passe
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-classe-green focus:outline-none focus:ring-1 focus:ring-classe-green"
            />
            <p className="mt-1 text-xs text-gray-500">Minimum 6 caractères</p>
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
              <label htmlFor="classCode" className="block text-sm font-medium text-gray-700">
                Code de la classe
              </label>
              <input
                id="classCode"
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
            {loading ? "Inscription..." : "S&apos;inscrire"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600">
          Déjà un compte ?{" "}
          <Link href="/login" className="text-classe-green hover:underline">
            Se connecter
          </Link>
        </p>

        <Link href="/" className="block text-center text-sm text-gray-500 hover:text-gray-700">
          Retour à l&apos;accueil
        </Link>
      </div>
    </main>
  );
}
