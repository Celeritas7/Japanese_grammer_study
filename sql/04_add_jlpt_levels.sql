-- ============================================================
-- FILE: 04_add_jlpt_levels.sql
-- Run this in Supabase SQL Editor
-- Adds jlpt_level column to groups + updates existing data
-- ============================================================

-- Add jlpt_level column to groups table
ALTER TABLE japanese_grammer_groups
ADD COLUMN IF NOT EXISTS jlpt_level TEXT DEFAULT 'N3';

-- Update existing groups to N3
UPDATE japanese_grammer_groups SET jlpt_level = 'N3';
