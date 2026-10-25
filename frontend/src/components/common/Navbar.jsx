import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';
import { Button } from './Button';

export const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isDetailPage = location.pathname.startsWith('/boards/') && location.pathname !== '/boards';

  return (
    <header
      style={{
        backgroundColor: 'var(--surface-primary)',
        borderBottom: '1px solid var(--border-color)',
        padding: '12px 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        boxShadow: 'var(--shadow)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button
          type="button"
          onClick={() => navigate('/boards')}
          style={{
            background: 'none',
            border: 'none',
            padding: 0,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: 'var(--text-primary)',
            fontSize: '1.25rem',
            fontWeight: '700',
          }}
        >
          <span
            style={{
              backgroundColor: 'var(--accent-color)',
              color: '#FFF',
              borderRadius: '6px',
              padding: '2px 8px',
              fontSize: '1rem',
            }}
          >
            KB
          </span>
          Kanban DevBoard
        </button>

        {isDetailPage && (
          <button
            type="button"
            onClick={() => navigate('/boards')}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              fontSize: '0.9rem',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            ← Volver a tableros
          </button>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <Button
          variant="secondary"
          onClick={toggleTheme}
          style={{
            padding: '6px 12px',
            fontSize: '0.85rem',
          }}
        >
          {theme === 'dark' ? '☀️ Claro' : '🌙 Oscuro'}
        </Button>

        {isAuthenticated && user && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span
              style={{
                fontSize: '0.875rem',
                color: 'var(--text-secondary)',
                borderLeft: '1px solid var(--border-color)',
                paddingLeft: '12px',
              }}
            >
              👤 <strong style={{ color: 'var(--text-primary)' }}>{user.username}</strong>
            </span>
            <Button
              variant="secondary"
              onClick={handleLogout}
              style={{
                padding: '6px 12px',
                fontSize: '0.85rem',
              }}
            >
              Cerrar sesión
            </Button>
          </div>
        )}
      </div>
    </header>
  );
};
