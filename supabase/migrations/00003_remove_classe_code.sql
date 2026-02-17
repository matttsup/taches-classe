-- Retirer le code d'accès aux classes (inutile)

ALTER TABLE classes DROP COLUMN IF EXISTS code;
