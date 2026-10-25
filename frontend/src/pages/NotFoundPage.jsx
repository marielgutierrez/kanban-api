import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/common/Button';
import { Navbar } from '../components/common/Navbar';

export const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-primary)' }}>
      <Navbar />
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '80px 24px',
          textAlign: 'center',
        }}
      >
        <span
          style={{
            fontSize: '5rem',
            fontWeight: '800',
            color: 'var(--accent-color)',
            lineHeight: 1,
            marginBottom: '16px',
          }}
        >
          404
        </span>
        <h1
          style={{
            fontSize: '1.8rem',
            margin: '0 0 8px',
            color: 'var(--text-primary)',
          }}
        >
          Página No Encontrada
        </h1>
        <p
          style={{
            fontSize: '1rem',
            color: 'var(--text-secondary)',
            maxWidth: '420px',
            margin: '0 0 24px',
          }}
        >
          La ruta a la que intentas acceder no existe o fue movida.
        </p>
        <Button variant="primary" onClick={() => navigate('/boards')}>
          Volver al Inicio
        </Button>
      </div>
    </div>
  );
};
