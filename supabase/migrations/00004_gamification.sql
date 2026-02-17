-- Ajouter colonnes pour gamification

ALTER TABLE classe_eleves ADD COLUMN IF NOT EXISTS points INTEGER DEFAULT 0;
ALTER TABLE classe_eleves ADD COLUMN IF NOT EXISTS badges TEXT[] DEFAULT '{}';

-- Table pour historique des tâches accomplies
CREATE TABLE IF NOT EXISTS classe_historique (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  classe_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  eleve_id UUID NOT NULL REFERENCES classe_eleves(id) ON DELETE CASCADE,
  tache_id UUID NOT NULL REFERENCES classe_taches(id) ON DELETE CASCADE,
  assignment_date DATE NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  quality_rating INTEGER CHECK (quality_rating >= 1 AND quality_rating <= 3),
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE classe_historique ENABLE ROW LEVEL SECURITY;
CREATE POLICY "allow_all_classe_historique" ON classe_historique FOR ALL USING (true) WITH CHECK (true);

CREATE INDEX idx_classe_historique_eleve ON classe_historique(eleve_id, assignment_date);
CREATE INDEX idx_classe_historique_date ON classe_historique(classe_id, assignment_date);
