import { NAV_TABS } from '../lib/constants';

const LEVEL_COLORS = {
  N5: '#10B981', N4: '#3B82F6', N3: '#C4A882', N2: '#F97316', N1: '#EF4444',
};

export default function Layout({ activeTab, onTabChange, onSignOut, selectedLevel, onBackToLevels, children }) {
  const levelColor = LEVEL_COLORS[selectedLevel] || '#C4A882';

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <header style={{
        background: 'linear-gradient(135deg, var(--dark) 0%, var(--dark-alt) 100%)',
        padding: '16px 24px 16px',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        boxShadow: '0 2px 20px rgba(44,36,32,0.15)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* Back to levels button */}
            <button
              onClick={onBackToLevels}
              style={{
                background: 'rgba(255,255,255,0.1)',
                border: 'none',
                color: '#A89580',
                fontSize: '18px',
                padding: '6px 10px',
                borderRadius: '8px',
                cursor: 'pointer',
                lineHeight: 1,
              }}
            >
              ←
            </button>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <p style={{ fontSize: '20px', fontWeight: 700, color: 'var(--bg)', margin: 0, letterSpacing: '0.5px' }}>
                  文法マスター
                </p>
                {/* Level badge */}
                <span style={{
                  padding: '3px 10px', borderRadius: '6px',
                  background: levelColor, color: '#fff',
                  fontSize: '12px', fontWeight: 800, letterSpacing: '0.5px',
                }}>
                  {selectedLevel}
                </span>
              </div>
              <p style={{ fontSize: '10px', color: 'var(--gold)', margin: '2px 0 0', letterSpacing: '2px', textTransform: 'uppercase' }}>
                JLPT Grammar Study
              </p>
            </div>
          </div>
          {onSignOut && (
            <button
              onClick={onSignOut}
              style={{
                background: 'rgba(255,255,255,0.1)',
                border: 'none',
                color: 'var(--text-muted)',
                fontSize: '12px',
                padding: '6px 12px',
                borderRadius: '8px',
                cursor: 'pointer',
              }}
            >
              Sign Out
            </button>
          )}
        </div>

        <nav style={{
          display: 'flex',
          gap: '2px',
          background: '#3A2D24',
          padding: '4px',
          borderRadius: '12px',
          marginTop: '12px',
        }}>
          {NAV_TABS.map(t => (
            <button
              key={t.id}
              onClick={() => onTabChange(t.id)}
              style={{
                flex: 1,
                padding: '10px 8px',
                border: 'none',
                borderRadius: '10px',
                fontSize: '12px',
                fontWeight: activeTab === t.id ? 600 : 400,
                cursor: 'pointer',
                transition: 'all 0.25s ease',
                background: activeTab === t.id ? levelColor : 'transparent',
                color: activeTab === t.id ? (selectedLevel === 'N3' ? 'var(--dark)' : '#fff') : 'var(--text-muted)',
              }}
            >
              <div style={{ fontSize: '14px' }}>{t.label}</div>
              <div style={{ fontSize: '10px', marginTop: '2px', opacity: 0.8 }}>{t.sub}</div>
            </button>
          ))}
        </nav>
      </header>

      <main style={{ padding: '20px 16px 100px', maxWidth: '640px', margin: '0 auto' }}>
        {children}
      </main>
    </div>
  );
}
