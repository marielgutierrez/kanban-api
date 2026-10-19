import React, { useState } from 'react';
import { useTheme } from './hooks/useTheme';
import { Button } from './components/common/Button';
import { Input } from './components/common/Input';
import { Modal } from './components/common/Modal';
import { Toast } from './components/common/Toast';
import { ColumnCard } from './components/kanban/ColumnCard';
import { TicketCard } from './components/kanban/TicketCard';

export default function App() {
  const { theme, toggleTheme } = useTheme();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Datos ficticios para visualizar los componentes (Mocks)
  const sampleTickets = [
    { id: '1', title: 'Diseñar interfaz', description: 'Crear componentes UI y tokens CSS' },
    { id: '2', title: 'Configurar Axios', description: 'Crear cliente HTTP y servicios' }
  ];

  return (
    <div style={{ padding: '24px', minHeight: '100vh', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
      {/* Encabezado e interruptor de tema */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <h2>Prueba de Componentes UI / Tema: {theme}</h2>
        <Button onClick={toggleTheme}>
          Cambiar a modo {theme === 'dark' ? 'Claro ☀️' : 'Oscuro 🌙'}
        </Button>
      </header>

      {/* Galería de componentes comunes */}
      <section style={{ marginBottom: '32px', display: 'flex', gap: '16px', alignItems: 'flex-end', flexWrap: 'wrap' }}>
        <Button onClick={() => setToastMessage('¡Componentes cargados con éxito!')}>
          Mostrar Toast
        </Button>
        <Button variant="secondary" onClick={() => setIsModalOpen(true)}>
          Abrir Modal
        </Button>
      </section>

      {/* Tablero Kanban de muestra */}
      <section style={{ display: 'flex', gap: '16px', overflowX: 'auto' }}>
        <ColumnCard column={{ id: 'c1', title: 'Por Hacer' }} onAddTicket={() => setIsModalOpen(true)}>
          {sampleTickets.map(ticket => (
            <TicketCard
              key={ticket.id}
              ticket={ticket}
              onDelete={(id) => setToastMessage(`Ticket ${id} eliminado (simulado)`)}
            />
          ))}
        </ColumnCard>

        <ColumnCard column={{ id: 'c2', title: 'En Proceso' }} />
        <ColumnCard column={{ id: 'c3', title: 'Completado' }} />
      </section>

      {/* Componentes emergentes */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Crear nuevo Ticket">
        <Input label="Título del Ticket" placeholder="Ej. Integrar servicios API" />
        <Input label="Descripción" placeholder="Detalles de la tarea..." />
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '16px' }}>
          <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
          <Button onClick={() => { setIsModalOpen(false); setToastMessage('Ticket creado con éxito'); }}>Guardar</Button>
        </div>
      </Modal>

      <Toast message={toastMessage} onClose={() => setToastMessage('')} />
    </div>
  );
}