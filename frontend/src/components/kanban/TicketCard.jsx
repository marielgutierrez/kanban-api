import React from 'react';

export const TicketCard = ({ ticket, onClick, onDelete }) => {
  return (
    <div
      onClick={onClick}
      style={{
        backgroundColor: 'var(--surface-primary)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius)',
        padding: '12px',
        marginBottom: '8px',
        boxShadow: 'var(--shadow)',
        cursor: 'pointer'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h4 style={{ margin: 0, color: 'var(--text-primary)' }}>{ticket.title}</h4>
        {onDelete && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(ticket.id);
            }}
            style={{ background: 'none', border: 'none', color: 'var(--danger-color)', cursor: 'pointer' }}
          >
            ✕
          </button>
        )}
      </div>
      {ticket.description && (
        <p style={{ margin: '8px 0 0', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
          {ticket.description}
        </p>
      )}
    </div>
  );
};