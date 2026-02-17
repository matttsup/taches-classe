"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

type ClasseRow = { id: string; name: string };

interface ClasseNavbarProps {
  classes: ClasseRow[];
  activeClasseId: string | null;
}

export function ClasseNavbar({ classes, activeClasseId }: ClasseNavbarProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const selectedClasseId = searchParams.get("classe") || activeClasseId;

  const basePath = "/classe/prof";
  const navItems = [
    { href: `${basePath}`, label: "Tableau de bord", emoji: "🏠" },
    { href: `${basePath}/eleves`, label: "Élèves", emoji: "👥" },
    { href: `${basePath}/taches`, label: "Tâches", emoji: "✓" },
    { href: `${basePath}/calendrier`, label: "Calendrier", emoji: "📅" },
    { href: `${basePath}/stats`, label: "Statistiques", emoji: "📊" },
    { href: `${basePath}/classes`, label: "Classes", emoji: "🏫" },
  ];

  return (
    <nav className="mb-5">
      <div className="mx-auto max-w-[1400px] px-5">
        <div className="rounded-[25px] bg-white p-6 shadow-[0_8px_25px_rgba(0,0,0,0.1)]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="animate-float text-5xl">🏫</div>
              <div>
                <h1 className="text-3xl font-bold text-classe-purple">
                  École Chanoine-Joseph-Théorêt
                </h1>
                <p className="text-base text-gray-400">Gestion des tâches de classe</p>
              </div>
            </div>
            <Link
              href="/"
              className="rounded-[15px] bg-[#FF6B9D] px-5 py-3 text-base font-semibold text-white transition-transform hover:scale-105"
            >
              Déconnexion
            </Link>
          </div>
          <div className="mt-5 flex flex-wrap gap-3 border-t border-gray-100 pt-5">
            {navItems.map((item) => {
              const href =
                selectedClasseId && item.href !== `${basePath}/classes`
                  ? `${item.href}?classe=${selectedClasseId}`
                  : item.href;
              const isActive =
                pathname === item.href ||
                (pathname.startsWith(item.href) && item.href !== basePath);

              return (
                <Link
                  key={item.href}
                  href={href}
                  className={`rounded-[15px] px-5 py-3 text-base font-semibold transition-all ${
                    isActive
                      ? "bg-classe-purple text-white shadow-lg"
                      : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <span className="mr-2">{item.emoji}</span>
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
