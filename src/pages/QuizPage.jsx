import { useState } from 'react';
import { useQuizQuestions, useGrammarGroups } from '../hooks/useGrammar';
import { useQuizResults } from '../hooks/useProgress';
import LoadingSpinner from '../components/LoadingSpinner';

// TODO: Migrate Quiz component from prototype-v2.jsx
// Replace hardcoded quizQuestions with hook data.
// Wire up saveResult() when quiz finishes.

export default function QuizPage() {
  const { groups: grammarGroups, loading: groupsLoading } = useGrammarGroups();
  const { saveResult } = useQuizResults();

  if (groupsLoading) return <LoadingSpinner message="Loading quiz..." />;

  return (
    <div>
      <p style={{ textAlign: 'center', color: '#8B7355', padding: '40px 20px' }}>
        Quiz Page — migrate Quiz component from prototype
        <br /><br />
        <strong>{grammarGroups.length}</strong> groups available for quizzes
      </p>
    </div>
  );
}
