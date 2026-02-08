import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const LEVELS = [
  { id: 'N5', label: 'N5', sub: 'Beginner', color: '#10B981', emoji: '🌱' },
  { id: 'N4', label: 'N4', sub: 'Elementary', color: '#3B82F6', emoji: '📘' },
  { id: 'N3', label: 'N3', sub: 'Intermediate', color: '#C4A882', emoji: '📙' },
  { id: 'N2', label: 'N2', sub: 'Upper Intermediate', color: '#F97316', emoji: '📕' },
  { id: 'N1', label: 'N1', sub: 'Advanced', color: '#EF4444', emoji: '🏆' },
];

export default function LevelSelector({ onSelect, onSignOut }) {
  const [counts, setCounts] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCounts() {
      const { data, error } = await supabase
        .from('japanese_grammer_points')
        .select('jlpt_level');

      if (!error && data) {
        const c = {};
        data.forEach(row => {
          const lvl = row.jlpt_level || 'N3';
          c[lvl] = (c[lvl] || 0) + 1;
        });
        setCounts(c);
      }
      setLoading(false);
    }
    fetchCounts();
  }, []);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #2C2420 0%, #3A2D24 40%, #F7F3EE 40%)',
      fontFamily: "'Noto Sans JP', 'Helvetica Neue', sans-serif",
    }}>
      {/* Header */}
      <div style={{ padding: '40px 24px 60px', textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
          <button
            onClick={onSignOut}
            style={{
              background: 'rgba(255,255,255,0.1)', border: 'none',
              color: '#A89580', fontSize: '12px', padding: '6px 12px',
              borderRadius: '8px', cursor: 'pointer',
            }}
          >
            Sign Out
          </button>
        </div>
        <p style={{ fontSize: '32px', fontWeight: 700, color: '#F7F3EE', margin: '0 0 6px', letterSpacing: '1px' }}>
          文法マスター
        </p>
        <p style={{ fontSize: '13px', color: '#C4A882', margin: 0, letterSpacing: '3px', textTransform: 'uppercase' }}>
          JLPT Grammar Study
        </p>
        <p style={{ fontSize: '14px', color: '#A89580', margin: '16px 0 0' }}>
          Choose your level to begin
        </p>
      </div>

      {/* Level Cards */}
      <div style={{ padding: '0 20px 40px', maxWidth: '480px', margin: '0 auto', marginTop: '-30px' }}>
        {LEVELS.map(level => {
          const count = counts[level.id] || 0;
          const hasData = count > 0;

          return (
            <button
              key={level.id}
              onClick={() => onSelect(level.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: '16px',
                width: '100%', padding: '20px 22px',
                marginBottom: '12px', borderRadius: '16px',
                border: hasData ? `2px solid ${level.color}40` : '2px solid rgba(196,168,130,0.15)',
                background: hasData ? '#FFFFFF' : '#FAF7F3',
                cursor: 'pointer',
                fontFamily: "'Noto Sans JP', sans-serif",
                textAlign: 'left',
                boxShadow: hasData ? '0 2px 12px rgba(44,36,32,0.08)' : 'none',
                transition: 'all 0.2s ease',
                opacity: hasData ? 1 : 0.6,
              }}
            >
              {/* Level badge */}
              <div style={{
                width: '56px', height: '56px', borderRadius: '14px',
                background: hasData
                  ? `linear-gradient(135deg, ${level.color}, ${level.color}CC)`
                  : '#E5DDD3',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                <span style={{ fontSize: '20px', fontWeight: 800, color: '#fff' }}>
                  {level.label}
                </span>
              </div>

              {/* Info */}
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <p style={{ fontSize: '18px', fontWeight: 700, color: '#2C2420', margin: 0 }}>
                    {level.emoji} {level.sub}
                  </p>
                </div>
                <p style={{ fontSize: '13px', color: '#8B7355', margin: '4px 0 0' }}>
                  {hasData
                    ? `${count} grammar point${count !== 1 ? 's' : ''} available`
                    : 'No data yet — add via SQL'
                  }
                </p>
              </div>

              {/* Arrow */}
              <span style={{
                fontSize: '20px',
                color: hasData ? level.color : '#D4C9BA',
              }}>→</span>
            </button>
          );
        })}
      </div>

      {/* Footer hint */}
      <div style={{ textAlign: 'center', padding: '0 20px 40px' }}>
        <p style={{ fontSize: '12px', color: '#A89580', lineHeight: 1.6 }}>
          Add grammar data for any level by running INSERT queries in Supabase.
          <br />Set <code style={{ background: '#EDE6DC', padding: '2px 6px', borderRadius: '4px', fontSize: '11px' }}>jlpt_level</code> to N5, N4, N3, N2, or N1.
        </p>
      </div>
    </div>
  );
}
