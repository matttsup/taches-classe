export type BadgeType = "debutant" | "champion" | "super_responsable" | "equipe" | "regulier" | "star";

export const badges: Record<BadgeType, { emoji: string; name: string; description: string; condition: string }> = {
  debutant: {
    emoji: "🌟",
    name: "Débutant",
    description: "Première tâche accomplie",
    condition: "1 tâche",
  },
  champion: {
    emoji: "🏆",
    name: "Champion",
    description: "10 tâches accomplies",
    condition: "10 tâches",
  },
  super_responsable: {
    emoji: "⭐",
    name: "Super responsable",
    description: "25 tâches accomplies",
    condition: "25 tâches",
  },
  equipe: {
    emoji: "🤝",
    name: "Esprit d'équipe",
    description: "A aidé ses camarades",
    condition: "5 semaines",
  },
  regulier: {
    emoji: "📅",
    name: "Régulier",
    description: "Tâches toute la semaine",
    condition: "1 semaine complète",
  },
  star: {
    emoji: "✨",
    name: "Star de la classe",
    description: "Élu élève de la semaine",
    condition: "Élu par prof",
  },
};

export function calculatePoints(totalTaches: number): number {
  return totalTaches * 10;
}

export function getNextBadge(totalTaches: number): { badge: BadgeType; remaining: number } | null {
  if (totalTaches < 1) return { badge: "debutant", remaining: 1 };
  if (totalTaches < 10) return { badge: "champion", remaining: 10 - totalTaches };
  if (totalTaches < 25) return { badge: "super_responsable", remaining: 25 - totalTaches };
  return null;
}

export function getBadgesForTaches(totalTaches: number): BadgeType[] {
  const earned: BadgeType[] = [];
  if (totalTaches >= 1) earned.push("debutant");
  if (totalTaches >= 10) earned.push("champion");
  if (totalTaches >= 25) earned.push("super_responsable");
  return earned;
}
