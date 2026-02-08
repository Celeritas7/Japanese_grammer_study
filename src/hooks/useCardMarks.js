import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

export function useCardMarks() {
  const [marks, setMarks] = useState({});
  const [loading, setLoading] = useState(true);

  // Fetch all marks for current user
  const fetchMarks = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setLoading(false); return; }

    const { data, error } = await supabase
      .from('japanese_grammer_user_card_marks')
      .select('*')
      .eq('user_id', user.id);

    if (!error && data) {
      const marksMap = {};
      data.forEach(m => {
        const key = m.grammar_point_id
          ? `grammar:${m.grammar_point_id}`
          : `conjunction:${m.conjunction_id}`;
        marksMap[key] = m.mark_level;
      });
      setMarks(marksMap);
    }
    setLoading(false);
  }, []);

  useEffect(() => { fetchMarks(); }, [fetchMarks]);

  // Upsert a mark for a card
  const markCard = async (type, itemId, level) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const payload = {
      user_id: user.id,
      mark_level: level,
      marked_at: new Date().toISOString(),
    };

    if (type === 'grammar') {
      payload.grammar_point_id = itemId;
      payload.conjunction_id = null;
    } else {
      payload.conjunction_id = itemId;
      payload.grammar_point_id = null;
    }

    const conflictColumn = type === 'grammar'
      ? 'user_id,grammar_point_id'
      : 'user_id,conjunction_id';

    const { error } = await supabase
      .from('japanese_grammer_user_card_marks')
      .upsert(payload, { onConflict: conflictColumn });

    if (!error) {
      const key = `${type}:${itemId}`;
      setMarks(prev => ({ ...prev, [key]: level }));
    }

    return !error;
  };

  // Get mark level for a specific item
  const getMarkLevel = (type, itemId) => {
    const key = `${type}:${itemId}`;
    return marks[key] ?? null;
  };

  // Get summary stats
  const getStats = () => {
    const stats = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    Object.values(marks).forEach(level => {
      stats[level] = (stats[level] || 0) + 1;
    });
    return stats;
  };

  return { marks, loading, markCard, getMarkLevel, getStats, fetchMarks };
}
