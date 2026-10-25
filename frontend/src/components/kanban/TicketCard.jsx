import React from 'react';

export const TicketCard = ({ ticket, onClick, onDelete, onMoveLeft, onMoveRight }) => {
  const ticketId = ticket?.id || ticket?._id;

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
        cursor: 'pointer',
        transition: 'transform 0.15s ease, box-shadow 0.15s ease'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
        <h4 style={{ margin: 0, color: 'var(--text-primary)', wordBreak: 'break-word' }}>{ticket.title}</h4>
        {onDelete && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(ticketId);
            }}
            title="Eliminar ticket"
            style={{ background: 'none', border: 'none', color: 'var(--danger-color)', cursor: 'pointer', fontSize: '1rem', padding: '0 4px' }}
          >
            ✕
          </button>
        )}
      </div>
      {ticket.description && (
        <p style={{ margin: '8px 0 0', color: 'var(--text-secondary)', fontSize: '0.875rem', wordBreak: 'break-word' }}>
          {ticket.description}
        </p>
      )}
      {(onMoveLeft || onMoveRight) && (
        <div
          style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '10px' }}
          onClick={(e) => e.stopPropagation()}
        >
          {onMoveLeft && (
            <button
              type="button"
              onClick={() => onMoveLeft(ticket)}
              title="Mover a columna anterior"
              style={{
                backgroundColor: 'transparent',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius)',
                color: 'var(--text-secondary)',
                cursor: 'pointer',
                padding: '2px 8px',
                fontSize: '0.75rem'
              }}
            >
              ←
            </button>
          )}
          {onMoveRight && (
            <button
              type="button"
              onClick={() => onMoveRight(ticket)}
              title="Mover a columna siguiente"
              style={{
                backgroundColor: 'transparent',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius)',
                color: 'var(--text-secondary)',
                cursor: 'pointer',
                padding: '2px 8px',
                fontSize: '0.75rem'
              }}
            >
              →
            </button>
          )}
        </div>
      )}
    </div>
  );
};
