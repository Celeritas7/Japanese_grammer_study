import { useState } from 'react';
import { useGrammarPoints, useGrammarGroups } from '../hooks/useGrammar';
import LoadingSpinner from '../components/LoadingSpinner';

// TODO: Migrate GrammarReference + ComparisonTable from prototype-v2.jsx
// Replace the hardcoded grammarData array with the hook data below.

export default function GrammarPage() {
  const { data: grammarData, loading } = useGrammarPoints();
  const { groups: grammarGroups } = useGrammarGroups();
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState('compare');
  const [selectedDay, setSelectedDay] = useState(null);
  const [expanded, setExpanded] = useState(null);

  if (loading) return <LoadingSpinner message="Loading grammar..." />;

  // Data is now from Supabase! Structure matches prototype.
  // grammarData[].group_id, .formation (JSONB), .formation_list (text[]), .examples (JSONB)
  // grammarGroups[].id, .label, .week, .day

  return (
    <div>
      <p style={{ textAlign: 'center', color: '#8B7355', padding: '40px 20px' }}>
        Grammar Page — migrate ComparisonTable + GrammarReference from prototype
        <br /><br />
        <strong>{grammarData.length}</strong> grammar points loaded from Supabase
        <br />
        <strong>{grammarGroups.length}</strong> grammar groups loaded
      </p>
    </div>
  );
}
