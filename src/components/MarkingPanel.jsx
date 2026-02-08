import { MARKING } from '../lib/constants';

export default function MarkingPanel({ onMark, onCancel }) {
  return (
    <div style={{
      background: '#FFFFFF',
      borderRadius: '14px',
      padding: '16px',
      boxShadow: '0 1px 8px rgba(44,36,32,0.06)',
      border: '1px solid rgba(196,168,130,0.15)',
    }}>
      <p style={{
        fontSize: '12px', fontWeight: 600, color: '#A89580',
        textTransform: 'uppercase', letterSpacing: '1px',
        margin: '0 0 12px', textAlign: 'center',
      }}>
        How well do you know this?
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
        {Object.entries(MARKING).map(([key, m]) => (
          <button
            key={key}
            onClick={() => onMark(Number(key))}
            style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '12px 14px', borderRadius: '10px',
              border: `2px solid ${m.border}`, background: m.lightBg,
              cursor: 'pointer', transition: 'all 0.15s ease',
            }}
          >
            <span style={{
              width: '28px', height: '28px', borderRadius: '50%',
              background: m.bg, color: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '14px', flexShrink: 0,
            }}>
              {m.icon}
            </span>
            <span style={{
              fontSize: '12px', fontWeight: 600, color: m.text,
              textAlign: 'left', lineHeight: 1.3,
            }}>
              {m.label}
            </span>
          </button>
        ))}
      </div>

      {onCancel && (
        <button
          onClick={onCancel}
          style={{
            width: '100%', marginTop: '8px', padding: '8px',
            border: 'none', background: 'transparent',
            color: '#A89580', fontSize: '13px', cursor: 'pointer',
          }}
        >
          Cancel
        </button>
      )}
    </div>
  );
}
