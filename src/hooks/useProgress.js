import { useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';

// ─── Save and fetch quiz results ─────────────────────────────────
export function useQuizResults() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  const saveResult = async ({ quizMode, groupId, totalQuestions, correctAnswers, answers }) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const { error } = await supabase.from('japanese_grammer_user_quiz_results').insert({
      user_id: user.id,
      quiz_mode: quizMode,
      group_id: groupId || null,
      total_questions: totalQuestions,
      correct_answers: correctAnswers,
      answers,
    });

    return !error;
  };

  const fetchHistory = useCallback(async (limit = 20) => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setLoading(false); return; }

    const { data, error } = await supabase
      .from('japanese_grammer_user_quiz_results')
      .select('*')
      .eq('user_id', user.id)
      .order('completed_at', { ascending: false })
      .limit(limit);

    if (!error) setHistory(data || []);
    setLoading(false);
  }, []);

  return { history, loading, saveResult, fetchHistory };
}

// ─── Track daily study streak ────────────────────────────────────
export function useStreak() {
  const [streak, setStreak] = useState(0);
  const [weekDays, setWeekDays] = useState([]);

  const recordStudy = async (activity = 'study') => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const today = new Date().toISOString().split('T')[0];

    // Upsert today's entry
    const { data: existing } = await supabase
      .from('japanese_grammer_user_streaks')
      .select('*')
      .eq('user_id', user.id)
      .eq('study_date', today)
      .single();

    if (existing) {
      const activities = existing.activities || [];
      if (!activities.includes(activity)) {
        await supabase.from('japanese_grammer_user_streaks')
          .update({ activities: [...activities, activity] })
          .eq('id', existing.id);
      }
    } else {
      await supabase.from('japanese_grammer_user_streaks').insert({
        user_id: user.id,
        study_date: today,
        activities: [activity],
      });
    }
  };

  const fetchStreak = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Fetch last 30 days of study data
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const { data, error } = await supabase
      .from('japanese_grammer_user_streaks')
      .select('study_date')
      .eq('user_id', user.id)
      .gte('study_date', thirtyDaysAgo.toISOString().split('T')[0])
      .order('study_date', { ascending: false });

    if (error || !data) return;

    // Calculate current streak
    const dates = data.map(d => d.study_date);
    let count = 0;
    const today = new Date();

    for (let i = 0; i < 30; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(checkDate.getDate() - i);
      const dateStr = checkDate.toISOString().split('T')[0];

      if (dates.includes(dateStr)) {
        count++;
      } else if (i > 0) {
        break; // Streak broken
      }
    }

    setStreak(count);

    // Build this week's data (Mon-Sun)
    const weekStart = new Date(today);
    weekStart.setDate(weekStart.getDate() - weekStart.getDay() + 1); // Monday

    const week = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(weekStart);
      d.setDate(d.getDate() + i);
      const dateStr = d.toISOString().split('T')[0];
      week.push({
        day: ['M', 'T', 'W', 'T', 'F', 'S', 'S'][i],
        date: dateStr,
        studied: dates.includes(dateStr),
      });
    }
    setWeekDays(week);
  }, []);

  return { streak, weekDays, recordStudy, fetchStreak };
}
