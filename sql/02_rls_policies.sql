-- ============================================================
-- FILE: 02_rls_policies.sql
-- Run this SECOND in Supabase SQL Editor
-- Enables Row Level Security so users can only access their data
-- Prefix: japanese_grammer_
-- ============================================================

-- ─── User tables: only own data ──────────────────────────────────
ALTER TABLE japanese_grammer_user_card_marks ENABLE ROW LEVEL SECURITY;
ALTER TABLE japanese_grammer_user_quiz_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE japanese_grammer_user_streaks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own marks"
  ON japanese_grammer_user_card_marks FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users manage own quiz results"
  ON japanese_grammer_user_quiz_results FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users manage own streaks"
  ON japanese_grammer_user_streaks FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ─── Content tables: readable by everyone ────────────────────────
ALTER TABLE japanese_grammer_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE japanese_grammer_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE japanese_grammer_conjunctions ENABLE ROW LEVEL SECURITY;
ALTER TABLE japanese_grammer_quiz_questions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Grammar points readable"
  ON japanese_grammer_points FOR SELECT USING (true);

CREATE POLICY "Grammar groups readable"
  ON japanese_grammer_groups FOR SELECT USING (true);

CREATE POLICY "Conjunctions readable"
  ON japanese_grammer_conjunctions FOR SELECT USING (true);

CREATE POLICY "Quiz questions readable"
  ON japanese_grammer_quiz_questions FOR SELECT USING (true);
