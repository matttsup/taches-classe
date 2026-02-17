-- Accès enseignant sans authentification : RLS permissif, prof sans user_id obligatoire

-- Rendre user_id optionnel sur profs et supprimer la FK vers auth.users
ALTER TABLE profs DROP CONSTRAINT IF EXISTS profs_user_id_fkey;
ALTER TABLE profs DROP CONSTRAINT IF EXISTS profs_user_id_key;
ALTER TABLE profs ALTER COLUMN user_id DROP NOT NULL;

-- Supprimer toutes les politiques RLS existantes
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

-- Politiques permissives : accès complet en lecture/écriture pour l'app (anon)
CREATE POLICY "allow_all_profs" ON profs FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "allow_all_classes" ON classes FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "allow_all_classe_eleves" ON classe_eleves FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "allow_all_classe_taches" ON classe_taches FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "allow_all_classe_assignments" ON classe_assignments FOR ALL USING (true) WITH CHECK (true);
