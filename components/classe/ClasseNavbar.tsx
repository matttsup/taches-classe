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
    { href: `${basePath}/taches`, label: "Tâches", emoji: "✓" },
    { href: `${basePath}/calendrier`, label: "Calendrier", emoji: "📅" },
  ];

  return (
    <nav className="mb-5">
      <div className="mx-auto max-w-[1400px] px-5">
        <div className="rounded-[25px] bg-white p-6 shadow-[0_8px_25px_rgba(0,0,0,0.1)]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="animate-float text-4xl">⚙️</div>
              <div>
                <h1 className="text-3xl font-bold text-classe-purple">
                  Gestion des Tâches - Mode Professeur
                </h1>
                <p className="text-base text-gray-400">
                  Organisez les responsabilités de votre classe
                </p>
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
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-[15px] px-5 py-3 text-base font-semibold transition-all ${
                  pathname === item.href
                    ? "bg-classe-purple text-white shadow-lg"
                    : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                }`}
              >
                <span className="mr-2">{item.emoji}</span>
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
