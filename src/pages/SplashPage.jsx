import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SplashPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => navigate('/login'), 4000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#0a1628',
      gap: '2rem',
      padding: '2rem',
    }}>
      <img
        src="/team.png.png"
        alt="Equipo Lumajira Maquinarias"
        style={{
          width: '100%',
          maxWidth: '480px',
          borderRadius: '16px',
          objectFit: 'cover',
          border: '2px solid #1d4e8f',
        }}
      />
      <div style={{ textAlign: 'center' }}>
        <h1 style={{
          color: '#ffffff',
          fontSize: '2.2rem',
          fontWeight: '700',
          letterSpacing: '-0.02em',
          margin: 0,
        }}>
          Lumajira Maquinarias
        </h1>
        <p style={{ color: '#5a8fc4', margin: '0.5rem 0 0', fontSize: '1rem' }}>
          Sistema de Monitoreo Industrial
        </p>
      </div>
      <div style={{ display: 'flex', gap: '6px' }}>
        {[0, 1, 2].map((i) => (
          <div key={i} style={{
            width: '8px', height: '8px', borderRadius: '50%',
            background: '#1d4e8f',
            animation: `pulse 1.4s ease-in-out ${i * 0.2}s infinite`,
          }} />
        ))}
      </div>
      <style>{`
        @keyframes pulse {
          0%, 80%, 100% { opacity: 0.3; transform: scale(0.8); }
          40% { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}