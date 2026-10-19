import React from 'react';

export const ColumnCard = ({ column, children, onAddTicket }) => {
  return (
    <div style={{
      backgroundColor: 'var(--bg-primary)',
      border: '1px solid var(--border-color)',
      borderRadius: 'var(--radius)',
      padding: '16px',
      minWidth: '280px',
      maxWidth: '320px',
      display: 'flex',
      flexDirection: 'column',
      gap: '12px'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ margin: 0, color: 'var(--text-primary)', fontSize: '1.1rem' }}>{column.title || column.name}</h3>
        {onAddTicket && (
          <button
            onClick={() => onAddTicket(column.id)}
            style={{
              backgroundColor: 'var(--accent-color)',
              color: '#FFF',
              border: 'none',
              borderRadius: '50%',
              width: '24px',
              height: '24px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            +
          </button>
        )}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {children}
      </div>
    </div>
  );
};