import React from 'react';

export const Button = ({ children, onClick, variant = 'primary', disabled = false, loading = false, type = 'button' }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      style={{
        padding: '8px 16px',
        borderRadius: 'var(--radius)',
        border: '1px solid var(--border-color)',
        backgroundColor: variant === 'primary' ? 'var(--accent-color)' : 'transparent',
        color: variant === 'primary' ? '#FFF' : 'var(--text-primary)',
        cursor: disabled || loading ? 'not-allowed' : 'pointer',
        opacity: disabled || loading ? 0.6 : 1,
        fontWeight: '600',
        transition: 'all 0.2s ease'
      }}
    >
      {loading ? 'Cargando...' : children}
    </button>
  );
};