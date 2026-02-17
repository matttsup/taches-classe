-- Répartition des tâches en classe primaire - App dédiée

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('prof', 'eleve')),
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

CREATE TABLE profs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

CREATE TABLE classes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  prof_id UUID NOT NULL REFERENCES profs(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  code TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE classe_eleves (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  classe_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE classe_taches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  classe_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE classe_assignments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  classe_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  assignment_date DATE NOT NULL,
  eleve_id UUID NOT NULL REFERENCES classe_eleves(id) ON DELETE CASCADE,
  tache_id UUID NOT NULL REFERENCES classe_taches(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(classe_id, assignment_date, tache_id)
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE profs ENABLE ROW LEVEL SECURITY;
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE classe_eleves ENABLE ROW LEVEL SECURITY;
ALTER TABLE classe_taches ENABLE ROW LEVEL SECURITY;
ALTER TABLE classe_assignments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Profs can view own" ON profs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Profs can update own" ON profs FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Profs can insert own" ON profs FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Profs can manage their classes" ON classes
  FOR ALL USING (prof_id IN (SELECT id FROM profs WHERE user_id = auth.uid()));

CREATE POLICY "Profs can manage classe_eleves" ON classe_eleves
  FOR ALL USING (
    classe_id IN (SELECT id FROM classes WHERE prof_id IN (SELECT id FROM profs WHERE user_id = auth.uid()))
  );
CREATE POLICY "Eleves can view own row" ON classe_eleves FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Profs can manage classe_taches" ON classe_taches
  FOR ALL USING (
    classe_id IN (SELECT id FROM classes WHERE prof_id IN (SELECT id FROM profs WHERE user_id = auth.uid()))
  );
CREATE POLICY "Eleves can view taches of their class" ON classe_taches
  FOR SELECT USING (
    classe_id IN (SELECT classe_id FROM classe_eleves WHERE user_id = auth.uid())
  );

CREATE POLICY "Profs can manage classe_assignments" ON classe_assignments
  FOR ALL USING (
    classe_id IN (SELECT id FROM classes WHERE prof_id IN (SELECT id FROM profs WHERE user_id = auth.uid()))
  );
CREATE POLICY "Eleves can view assignments of their class" ON classe_assignments
  FOR SELECT USING (
    classe_id IN (SELECT classe_id FROM classe_eleves WHERE user_id = auth.uid())
  );

CREATE INDEX idx_classe_assignments_date ON classe_assignments(classe_id, assignment_date);
CREATE INDEX idx_classe_eleves_classe ON classe_eleves(classe_id);
CREATE INDEX idx_classe_taches_classe ON classe_taches(classe_id);
