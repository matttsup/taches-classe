// Calendrier scolaire 2025-2026 - École Chanoine-Joseph-Théorêt
// Source: https://stg-cjt.cssmbdev.com/wp-content/uploads/2025/11/Calendrier-2025-2026-JEUNES.pdf

export type JourType = "normal" | "pedago" | "conge" | "relache";

// Journées pédagogiques
const JOURNEES_PEDAGO = [
  "2025-08-25", // Planification
  "2025-08-26", // Planification
  "2025-08-27", // Planification
  "2025-09-10", // 1/2 journée accueil préscolaire (après-midi)
  "2025-10-06", // 1/2 journée pédagogique
  "2025-11-07", // Journée pédagogique
  "2025-12-05", // Journée CSSMB
  "2026-01-05", // Journée pédagogique
  "2026-01-16", // Journée pédagogique
  "2026-02-06", // Journée pédagogique
  "2026-03-13", // Journée pédagogique
  "2026-05-15", // Journée pédagogique
  "2026-06-19", // Journée pédagogique
  "2026-06-22", // Journée pédagogique
  "2026-06-23", // Journée pédagogique (dernier jour)
];

// Congés
const CONGES = [
  "2025-09-01", // Fête du Travail
  "2025-10-13", // Action de grâces
  "2025-11-28", // Congé
  "2025-12-22", // Vacances Noël début
  "2025-12-23",
  "2025-12-24",
  "2025-12-25",
  "2025-12-26",
  "2025-12-29",
  "2025-12-30",
  "2025-12-31",
  "2026-01-01",
  "2026-01-02", // Vacances Noël fin
  "2026-04-03", // Pâques
];

// Semaine de relâche
const RELACHE = [
  "2026-03-02",
  "2026-03-03",
  "2026-03-04",
  "2026-03-05",
  "2026-03-06",
];

export function getJourType(dateString: string): JourType {
  if (RELACHE.includes(dateString)) return "relache";
  if (CONGES.includes(dateString)) return "conge";
  if (JOURNEES_PEDAGO.includes(dateString)) return "pedago";
  return "normal";
}

export function isJourEcole(dateString: string): boolean {
  const type = getJourType(dateString);
  return type === "normal";
}
