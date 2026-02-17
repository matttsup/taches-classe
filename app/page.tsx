import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

export default async function HomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("user_id", user.id)
      .single();

    if (!profile) redirect("/complete-profile");
    if (profile.role === "prof") redirect("/classe/prof");
    if (profile.role === "eleve") redirect("/classe/eleve");
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6">
      <div className="w-full max-w-md space-y-8 text-center">
        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-classe-green/20 text-5xl">
          📋
        </div>
        <h1 className="text-4xl font-bold text-classe-green">
          Répartition des tâches
        </h1>
        <p className="text-gray-600">
          Classe primaire : balai, chaises, collation… Calendrier jour par jour.
        </p>
        <div className="flex flex-col gap-4">
          <Link
            href="/login"
            className="rounded-lg bg-classe-green px-6 py-3 font-medium text-white transition hover:bg-classe-green/90"
          >
            Connexion
          </Link>
          <Link
            href="/register"
            className="rounded-lg border-2 border-classe-green px-6 py-3 font-medium text-classe-green transition hover:bg-classe-green/5"
          >
            Inscription
          </Link>
        </div>
      </div>
    </main>
  );
}
