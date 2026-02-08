import { useState } from 'react';
import { useGrammarPoints, useGrammarGroups, useConjunctions } from '../hooks/useGrammar';
import { useCardMarks } from '../hooks/useCardMarks';
import { useStreak } from '../hooks/useProgress';
import LoadingSpinner from '../components/LoadingSpinner';

// TODO: Migrate Flashcards component from prototype-v2.jsx
// - Replace hardcoded data with hook data
// - Use markCard() from useCardMarks instead of local state
// - Call recordStudy('flashcard') from useStreak when studying

export default function CardsPage() {
  const { data: grammarData, loading: grammarLoading } = useGrammarPoints();
  const { groups: grammarGroups } = useGrammarGroups();
  const { data: conjunctions, loading: conjLoading } = useConjunctions();
  const { marks, markCard, getMarkLevel } = useCardMarks();
  const { recordStudy } = useStreak();

  if (grammarLoading || conjLoading) return <LoadingSpinner message="Loading cards..." />;

  return (
    <div>
      <p style={{ textAlign: 'center', color: '#8B7355', padding: '40px 20px' }}>
        Cards Page — migrate Flashcards component from prototype
        <br /><br />
        <strong>{grammarData.length}</strong> grammar cards
        <br />
        <strong>{conjunctions.length}</strong> conjunction cards
        <br />
        <strong>{Object.keys(marks).length}</strong> cards marked so far
      </p>
    </div>
  );
}
