import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { EleveLogoutButton } from "@/components/classe/EleveLogoutButton";

export default async function ClasseEleveLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, name")
    .eq("user_id", user.id)
    .single();

  if (!profile || profile.role !== "eleve") redirect("/");

  return (
    <div className="min-h-screen bg-classe-mint/30">
      <nav className="border-b border-teal-200 bg-white shadow-sm">
        <div className="mx-auto max-w-4xl px-4 py-3 sm:px-6">
          <div className="flex items-center justify-between">
            <Link
              href="/classe/eleve"
              className="flex items-center gap-2 text-lg font-bold text-classe-green"
            >
              <span className="text-2xl">📋</span>
              <span>Mes tâches</span>
            </Link>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">{profile.name}</span>
              <Link
                href="/"
                className="text-sm text-gray-500 hover:text-classe-green"
              >
                Accueil
              </Link>
              <EleveLogoutButton />
            </div>
          </div>
        </div>
      </nav>
      <main className="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}
