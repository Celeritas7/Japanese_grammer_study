import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

// ─── Fetch grammar points with optional filters ─────────────────
export function useGrammarPoints(filters = {}) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetch() {
      setLoading(true);
      let query = supabase
        .from('japanese_grammer_points')
        .select('*, japanese_grammer_groups(label, id)')
        .order('week', { ascending: true })
        .order('day', { ascending: true })
        .order('sort_order', { ascending: true });

      if (filters.week) query = query.eq('week', filters.week);
      if (filters.day) query = query.eq('day', filters.day);
      if (filters.groupId) query = query.eq('group_id', filters.groupId);
      if (filters.jlptLevel) query = query.eq('jlpt_level', filters.jlptLevel);

      const { data: result, error: err } = await query;
      if (err) setError(err);
      else setData(result || []);
      setLoading(false);
    }
    fetch();
  }, [filters.week, filters.day, filters.groupId, filters.jlptLevel]);

  return { data, loading, error };
}

// ─── Fetch grammar groups ────────────────────────────────────────
export function useGrammarGroups() {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetch() {
      const { data, error } = await supabase
        .from('japanese_grammer_groups')
        .select('*')
        .order('week', { ascending: true })
        .order('day', { ascending: true })
        .order('sort_order', { ascending: true });

      if (!error) setGroups(data || []);
      setLoading(false);
    }
    fetch();
  }, []);

  return { groups, loading };
}

// ─── Fetch conjunctions ──────────────────────────────────────────
export function useConjunctions() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetch() {
      const { data: result, error } = await supabase
        .from('japanese_grammer_conjunctions')
        .select('*')
        .order('sort_order', { ascending: true });

      if (!error) setData(result || []);
      setLoading(false);
    }
    fetch();
  }, []);

  return { data, loading };
}

// ─── Fetch quiz questions ────────────────────────────────────────
export function useQuizQuestions(groupId = null) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetch() {
      setLoading(true);
      let query = supabase
        .from('japanese_grammer_quiz_questions')
        .select('*')
        .order('id', { ascending: true });

      if (groupId) query = query.eq('group_id', groupId);

      const { data: result, error } = await query;
      if (!error) setData(result || []);
      setLoading(false);
    }
    fetch();
  }, [groupId]);

  return { data, loading };
}
