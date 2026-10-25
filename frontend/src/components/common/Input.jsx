import React from 'react';

export const Input = ({ label, error, as, multiline, ...props }) => {
  const Component = as === 'textarea' || multiline ? 'textarea' : 'input';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '12px' }}>
      {label && <label style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{label}</label>}
      <Component
        {...props}
        style={{
          padding: '8px 12px',
          borderRadius: 'var(--radius)',
          border: `1px solid ${error ? 'var(--danger-color)' : 'var(--border-color)'}`,
          backgroundColor: 'var(--surface-primary)',
          color: 'var(--text-primary)',
          outline: 'none',
          fontFamily: 'inherit',
          fontSize: '0.95rem',
          resize: as === 'textarea' || multiline ? 'vertical' : undefined,
          ...props.style
        }}
      />
      {error && <span style={{ fontSize: '0.75rem', color: 'var(--danger-color)' }}>{error}</span>}
    </div>
  );
};
