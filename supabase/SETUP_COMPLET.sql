-- ⚠️ SCRIPT COMPLET À EXÉCUTER DANS SUPABASE SQL EDITOR ⚠️
-- Copiez tout ce fichier et exécutez-le dans Supabase Dashboard > SQL Editor

-- ========================================
-- MIGRATION 1 : Schema initial
-- ========================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('prof', 'eleve')),
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

CREATE TABLE IF NOT EXISTS profs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS classes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  prof_id UUID NOT NULL REFERENCES profs(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS classe_eleves (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  classe_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS classe_taches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  classe_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS classe_assignments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  classe_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  assignment_date DATE NOT NULL,
  eleve_id UUID NOT NULL REFERENCES classe_eleves(id) ON DELETE CASCADE,
  tache_id UUID NOT NULL REFERENCES classe_taches(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(classe_id, assignment_date, tache_id)
);

-- ========================================
-- MIGRATION 2 : RLS permissif (NO AUTH)
-- ========================================

-- Rendre user_id optionnel sur profs
ALTER TABLE profs DROP CONSTRAINT IF EXISTS profs_user_id_fkey;
ALTER TABLE profs DROP CONSTRAINT IF EXISTS profs_user_id_key;
ALTER TABLE profs ALTER COLUMN user_id DROP NOT NULL;

-- Activer RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE profs ENABLE ROW LEVEL SECURITY;
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE classe_eleves ENABLE ROW LEVEL SECURITY;
ALTER TABLE classe_taches ENABLE ROW LEVEL SECURITY;
ALTER TABLE classe_assignments ENABLE ROW LEVEL SECURITY;

-- Supprimer les anciennes politiques
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Profs can view own" ON profs;
DROP POLICY IF EXISTS "Profs can update own" ON profs;
DROP POLICY IF EXISTS "Profs can insert own" ON profs;
DROP POLICY IF EXISTS "Profs can manage their classes" ON classes;
DROP POLICY IF EXISTS "Profs can manage classe_eleves" ON classe_eleves;
DROP POLICY IF EXISTS "Eleves can view own row" ON classe_eleves;
DROP POLICY IF EXISTS "Profs can manage classe_taches" ON classe_taches;
DROP POLICY IF EXISTS "Eleves can view taches of their class" ON classe_taches;
DROP POLICY IF EXISTS "Profs can manage classe_assignments" ON classe_assignments;
DROP POLICY IF EXISTS "Eleves can view assignments of their class" ON classe_assignments;

-- Politiques permissives : accès complet
CREATE POLICY "allow_all_profs" ON profs FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "allow_all_classes" ON classes FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "allow_all_classe_eleves" ON classe_eleves FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "allow_all_classe_taches" ON classe_taches FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "allow_all_classe_assignments" ON classe_assignments FOR ALL USING (true) WITH CHECK (true);

-- ========================================
-- MIGRATION 3 : Retrait code classe
-- ========================================

ALTER TABLE classes DROP COLUMN IF EXISTS code;

-- ========================================
-- Index pour performance
-- ========================================

CREATE INDEX IF NOT EXISTS idx_classe_assignments_date ON classe_assignments(classe_id, assignment_date);
CREATE INDEX IF NOT EXISTS idx_classe_eleves_classe ON classe_eleves(classe_id);
CREATE INDEX IF NOT EXISTS idx_classe_taches_classe ON classe_taches(classe_id);

-- ========================================
-- FIN DES MIGRATIONS
-- ========================================
-- Votre base de données est maintenant prête ! ✅
