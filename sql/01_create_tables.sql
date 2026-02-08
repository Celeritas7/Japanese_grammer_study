-- ============================================================
-- FILE: 01_create_tables.sql
-- Run this FIRST in Supabase SQL Editor
-- Creates all tables for the N3 Grammar Master app
-- Prefix: japanese_grammer_
-- ============================================================

-- ─── Grammar Groups ──────────────────────────────────────────────
CREATE TABLE japanese_grammer_groups (
  id TEXT PRIMARY KEY,
  label TEXT NOT NULL,
  week INTEGER NOT NULL,
  day INTEGER NOT NULL,
  custom BOOLEAN DEFAULT FALSE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Grammar Points ──────────────────────────────────────────────
CREATE TABLE japanese_grammer_points (
  id SERIAL PRIMARY KEY,
  group_id TEXT REFERENCES japanese_grammer_groups(id),
  week INTEGER NOT NULL,
  day INTEGER NOT NULL,
  title TEXT NOT NULL,
  meaning TEXT NOT NULL,
  nuance TEXT,
  notes TEXT,
  formation JSONB,           -- { verb: "...", iAdj: "...", naAdj: "...", noun: "..." }
  formation_list TEXT[],     -- Array of formation rules as strings
  examples JSONB,            -- [{ jp: "...", en: "..." }, ...]
  jlpt_level TEXT DEFAULT 'N3',
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Conjunctions ────────────────────────────────────────────────
CREATE TABLE japanese_grammer_conjunctions (
  id SERIAL PRIMARY KEY,
  kanji TEXT DEFAULT '',
  kana TEXT NOT NULL,
  meaning TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Quiz Questions ──────────────────────────────────────────────
CREATE TABLE japanese_grammer_quiz_questions (
  id SERIAL PRIMARY KEY,
  grammar_point_id INTEGER REFERENCES japanese_grammer_points(id),
  group_id TEXT REFERENCES japanese_grammer_groups(id),
  question TEXT NOT NULL,
  options TEXT[] NOT NULL,
  correct_index INTEGER NOT NULL,
  question_type TEXT DEFAULT 'fill_blank',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── User Card Marks (6 categories) ─────────────────────────────
CREATE TABLE japanese_grammer_user_card_marks (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  grammar_point_id INTEGER REFERENCES japanese_grammer_points(id),
  conjunction_id INTEGER REFERENCES japanese_grammer_conjunctions(id),
  mark_level INTEGER NOT NULL CHECK (mark_level BETWEEN 0 AND 5),
  -- 0 = Not Marked
  -- 1 = Monthly Review
  -- 2 = Can't Converse
  -- 3 = Can't Write
  -- 4 = Can't Use
  -- 5 = Don't Know
  marked_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, grammar_point_id),
  UNIQUE(user_id, conjunction_id)
);

-- ─── User Quiz Results ───────────────────────────────────────────
CREATE TABLE japanese_grammer_user_quiz_results (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  quiz_mode TEXT NOT NULL,
  group_id TEXT REFERENCES japanese_grammer_groups(id),
  total_questions INTEGER NOT NULL,
  correct_answers INTEGER NOT NULL,
  answers JSONB,
  completed_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── User Study Streak ───────────────────────────────────────────
CREATE TABLE japanese_grammer_user_streaks (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  study_date DATE NOT NULL,
  activities JSONB DEFAULT '[]',
  UNIQUE(user_id, study_date)
);

-- ─── Indexes ─────────────────────────────────────────────────────
CREATE INDEX idx_jp_grammer_points_group ON japanese_grammer_points(group_id);
CREATE INDEX idx_jp_grammer_points_week ON japanese_grammer_points(week, day);
CREATE INDEX idx_jp_grammer_card_marks_user ON japanese_grammer_user_card_marks(user_id);
CREATE INDEX idx_jp_grammer_quiz_results_user ON japanese_grammer_user_quiz_results(user_id);
CREATE INDEX idx_jp_grammer_streaks_user ON japanese_grammer_user_streaks(user_id, study_date);
