import React from 'react';

export const ColumnCard = ({ column, children, onAddTicket, onDeleteColumn }) => {
  const colId = column?.id || column?._id;

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
        <h3 style={{ margin: 0, color: 'var(--text-primary)', fontSize: '1.1rem' }}>{column?.title || column?.name}</h3>
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
          {onAddTicket && (
            <button
              type="button"
              onClick={() => onAddTicket(colId)}
              title="Añadir ticket"
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
                justifyContent: 'center',
                fontWeight: 'bold',
                lineHeight: 1
              }}
            >
              +
            </button>
          )}
          {onDeleteColumn && (
            <button
              type="button"
              onClick={() => onDeleteColumn(colId)}
              title="Eliminar columna"
              style={{
                backgroundColor: 'transparent',
                color: 'var(--text-secondary)',
                border: 'none',
                cursor: 'pointer',
                fontSize: '0.9rem',
                padding: '2px 4px'
              }}
            >
              🗑️
            </button>
          )}
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {children}
      </div>
    </div>
  );
};
