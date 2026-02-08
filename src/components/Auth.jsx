import { useState } from 'react';

export default function Auth({ onSignIn }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const result = await onSignIn(email, password);
    if (result?.error) {
      setError(result.error.message);
    }
    setLoading(false);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #2C2420 0%, #4A3728 50%, #2C2420 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
    }}>
      <div style={{
        background: '#FFFFFF',
        borderRadius: '18px',
        padding: '40px 32px',
        maxWidth: '380px',
        width: '100%',
        boxShadow: '0 8px 40px rgba(0,0,0,0.2)',
      }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <p style={{ fontSize: '28px', fontWeight: 700, color: '#2C2420', margin: '0 0 4px' }}>
            N3 文法マスター
          </p>
          <p style={{ fontSize: '13px', color: '#8B7355', letterSpacing: '2px', textTransform: 'uppercase', margin: 0 }}>
            JLPT Grammar Study
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ fontSize: '12px', fontWeight: 600, color: '#8B7355', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: '6px' }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '14px 16px',
                border: '2px solid rgba(196,168,130,0.3)',
                borderRadius: '10px',
                fontSize: '15px',
                background: '#FAF7F3',
                color: '#2C2420',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ fontSize: '12px', fontWeight: 600, color: '#8B7355', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: '6px' }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '14px 16px',
                border: '2px solid rgba(196,168,130,0.3)',
                borderRadius: '10px',
                fontSize: '15px',
                background: '#FAF7F3',
                color: '#2C2420',
                boxSizing: 'border-box',
              }}
            />
          </div>

          {error && (
            <p style={{
              fontSize: '13px',
              color: '#C25B4E',
              background: '#FAEAE8',
              padding: '10px 14px',
              borderRadius: '8px',
              marginBottom: '16px',
            }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '14px',
              borderRadius: '10px',
              border: 'none',
              background: loading ? '#A89580' : '#2C2420',
              color: '#F7F3EE',
              fontSize: '15px',
              fontWeight: 600,
              cursor: loading ? 'default' : 'pointer',
            }}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
