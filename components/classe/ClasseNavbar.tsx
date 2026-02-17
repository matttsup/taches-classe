"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

type ClasseRow = { id: string; name: string; code: string };

interface ClasseNavbarProps {
  userName?: string;
  classes: ClasseRow[];
  activeClasseId: string | null;
}

export function ClasseNavbar({
  userName,
  classes,
  activeClasseId,
}: ClasseNavbarProps) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  const basePath = "/classe/prof";
  const navItems = [
    { href: basePath, label: "Tableau de bord" },
    { href: `${basePath}/eleves`, label: "Élèves" },
    { href: `${basePath}/taches`, label: "Tâches" },
    { href: `${basePath}/calendrier`, label: "Calendrier" },
  ];

  return (
    <nav className="border-b border-teal-200 bg-white shadow-sm">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 items-center justify-between">
          <div className="flex items-center gap-6">
            <Link
              href={basePath}
              className="flex items-center gap-2 text-lg font-bold text-classe-green"
            >
              <span className="text-2xl">📋</span>
              <span>Répartition des tâches</span>
            </Link>
            <div className="hidden gap-1 md:flex">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                    pathname === item.href
                      ? "bg-classe-green/15 text-classe-green"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-4">
            {activeClasseId && (
              <span className="hidden text-sm text-gray-500 sm:inline">
                Classe : {classes.find((c) => c.id === activeClasseId)?.name ?? "—"}
              </span>
            )}
            {userName && (
              <span className="text-sm text-gray-600">{userName}</span>
            )}
            <Link href="/" className="text-sm text-gray-500 hover:text-classe-green">
              Accueil
            </Link>
            <button
              onClick={handleLogout}
              className="rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100"
            >
              Déconnexion
            </button>
          </div>
        </div>
        <div className="flex flex-col gap-1 border-t border-gray-100 py-2 md:hidden">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded px-3 py-2 text-sm font-medium ${
                pathname === item.href
                  ? "bg-classe-green/15 text-classe-green"
                  : "text-gray-600"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
