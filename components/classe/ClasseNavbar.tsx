"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type ClasseRow = { id: string; name: string; code: string };

interface ClasseNavbarProps {
  classes: ClasseRow[];
  activeClasseId: string | null;
}

export function ClasseNavbar({
  classes,
  activeClasseId,
}: ClasseNavbarProps) {
  const pathname = usePathname();
  const basePath = "/classe/prof";
  const navItems = [
    { href: basePath, label: "Tableau de bord", emoji: "🏠" },
    { href: `${basePath}/eleves`, label: "Élèves", emoji: "👥" },
    { href: `${basePath}/taches`, label: "Tâches", emoji: "✅" },
    { href: `${basePath}/calendrier`, label: "Calendrier", emoji: "📅" },
  ];

  return (
    <nav className="border-b-2 border-teal-200 bg-white shadow-sm">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-6">
            <Link
              href={basePath}
              className="flex items-center gap-2 text-xl font-bold text-classe-green"
            >
              <span className="text-3xl">📋</span>
              <span>Répartition des tâches</span>
            </Link>
            <div className="hidden gap-1 md:flex">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-xl px-4 py-2.5 text-base font-medium transition ${
                    pathname === item.href
                      ? "bg-classe-green/20 text-classe-green"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  <span className="mr-1.5">{item.emoji}</span>
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-4">
            {activeClasseId && (
              <span className="hidden text-base text-gray-500 sm:inline">
                Classe : {classes.find((c) => c.id === activeClasseId)?.name ?? "—"}
              </span>
            )}
            <Link
              href="/"
              className="rounded-xl px-3 py-2 text-base font-medium text-gray-600 hover:bg-gray-100 hover:text-classe-green"
            >
              Accueil
            </Link>
          </div>
        </div>
        <div className="flex flex-col gap-1 border-t border-gray-100 py-3 md:hidden">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-xl px-4 py-2.5 text-base font-medium ${
                pathname === item.href
                  ? "bg-classe-green/20 text-classe-green"
                  : "text-gray-600"
              }`}
            >
              <span className="mr-1.5">{item.emoji}</span>
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
