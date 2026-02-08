export default function LoadingSpinner({ message = 'Loading...' }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '60px 20px',
    }}>
      <div style={{
        width: '36px', height: '36px',
        border: '3px solid #EDE6DC',
        borderTopColor: '#C4A882',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
      }} />
      <p style={{ fontSize: '14px', color: '#8B7355', marginTop: '16px' }}>
        {message}
      </p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
