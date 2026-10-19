import React from 'react';

export const Toast = ({ message, type = 'info', onClose }) => {
  if (!message) return null;

  const bg = type === 'error' ? 'var(--danger-color)' : 'var(--accent-color)';

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      backgroundColor: bg,
      color: '#FFF',
      padding: '12px 20px',
      borderRadius: 'var(--radius)',
      boxShadow: 'var(--shadow)',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      zIndex: 2000
    }}>
      <span>{message}</span>
      {onClose && <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#FFF', cursor: 'pointer' }}>✕</button>}
    </div>
  );
};