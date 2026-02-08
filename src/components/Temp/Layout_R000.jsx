import { NAV_TABS } from '../lib/constants';

export default function Layout({ activeTab, onTabChange, onSignOut, children }) {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <header style={{
        background: 'linear-gradient(135deg, var(--dark) 0%, var(--dark-alt) 100%)',
        padding: '20px 24px 16px',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        boxShadow: '0 2px 20px rgba(44,36,32,0.15)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <p style={{ fontSize: '22px', fontWeight: 700, color: 'var(--bg)', margin: 0, letterSpacing: '0.5px' }}>
              N3 文法マスター
            </p>
            <p style={{ fontSize: '11px', color: 'var(--gold)', margin: '2px 0 0', letterSpacing: '2px', textTransform: 'uppercase' }}>
              JLPT Grammar Study
            </p>
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
          marginTop: '14px',
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
                background: activeTab === t.id ? 'var(--gold)' : 'transparent',
                color: activeTab === t.id ? 'var(--dark)' : 'var(--text-muted)',
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
