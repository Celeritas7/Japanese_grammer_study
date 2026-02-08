import { useEffect } from 'react';
import { useCardMarks } from '../hooks/useCardMarks';
import { useQuizResults, useStreak } from '../hooks/useProgress';
import { useGrammarGroups } from '../hooks/useGrammar';
import LoadingSpinner from '../components/LoadingSpinner';

// TODO: Migrate Progress component from prototype-v2.jsx
// - Use getStats() from useCardMarks for marking breakdown
// - Use fetchHistory() from useQuizResults for quiz accuracy
// - Use fetchStreak() / weekDays from useStreak for streak display

export default function ProgressPage() {
  const { getStats, loading: marksLoading } = useCardMarks();
  const { history, fetchHistory, loading: historyLoading } = useQuizResults();
  const { streak, weekDays, fetchStreak } = useStreak();
  const { groups: grammarGroups } = useGrammarGroups();

  useEffect(() => {
    fetchHistory();
    fetchStreak();
  }, [fetchHistory, fetchStreak]);

  if (marksLoading || historyLoading) return <LoadingSpinner message="Loading stats..." />;

  const stats = getStats();

  return (
    <div>
      <p style={{ textAlign: 'center', color: '#8B7355', padding: '40px 20px' }}>
        Progress Page — migrate Progress component from prototype
        <br /><br />
        Streak: <strong>{streak} days</strong>
        <br />
        Quiz history: <strong>{history.length} sessions</strong>
        <br />
        Cards marked: <strong>{Object.values(stats).reduce((a, b) => a + b, 0)}</strong>
      </p>
    </div>
  );
}
