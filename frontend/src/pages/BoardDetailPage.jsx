import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { boardService } from '../api/boardService';
import { columnService } from '../api/columnService';
import { ticketService } from '../api/ticketService';
import { mockBoardDetail, mockTickets } from '../api/mockData';
import { useToast } from '../hooks/useToast';
import { Navbar } from '../components/common/Navbar';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Modal } from '../components/common/Modal';
import { ColumnCard } from '../components/kanban/ColumnCard';
import { TicketCard } from '../components/kanban/TicketCard';

export const BoardDetailPage = () => {
  const { boardId } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  // Estados principales
  const [board, setBoard] = useState(null);
  const [columns, setColumns] = useState([]);
  const [ticketsByColumn, setTicketsByColumn] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isUsingMocks, setIsUsingMocks] = useState(false);

  // Referencia para revertir estado en movimiento optimista
  const ticketsRef = useRef(ticketsByColumn);
  useEffect(() => {
    ticketsRef.current = ticketsByColumn;
  }, [ticketsByColumn]);

  // Estado del Modal de Nueva Columna
  const [isAddColumnOpen, setIsAddColumnOpen] = useState(false);
  const [newColumnName, setNewColumnName] = useState('');
  const [columnError, setColumnError] = useState(null);
  const [isSubmittingColumn, setIsSubmittingColumn] = useState(false);

  // Estado del Modal de Nuevo Ticket
  const [isAddTicketOpen, setIsAddTicketOpen] = useState(false);
  const [targetColumnId, setTargetColumnId] = useState(null);
  const [ticketFormData, setTicketFormData] = useState({ title: '', description: '' });
  const [ticketFormErrors, setTicketFormErrors] = useState({});
  const [isSubmittingTicket, setIsSubmittingTicket] = useState(false);

  // Estado del Modal de Detalle / Edición / Movimiento de Ticket
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [selectedTicketColumnId, setSelectedTicketColumnId] = useState(null);
  const [editTicketData, setEditTicketData] = useState({ title: '', description: '', targetColumnId: '' });
  const [editTicketErrors, setEditTicketErrors] = useState({});
  const [isUpdatingTicket, setIsUpdatingTicket] = useState(false);

  // Carga de datos del Tablero y sus Columnas/Tickets
  const loadBoardData = useCallback(async () => {
    if (!boardId) return;

    setLoading(true);
    setError(null);

    try {
      const boardData = await boardService.getById(boardId);
      setBoard(boardData);
      const cols = boardData.columns || [];
      setColumns(cols);

      // Cargar tickets para cada columna en paralelo
      const ticketsMap = {};
      await Promise.all(
        cols.map(async (col) => {
          const colId = col._id || col.id;
          try {
            const colTickets = await ticketService.getByColumn(boardId, colId);
            ticketsMap[colId] = Array.isArray(colTickets) ? colTickets : [];
          } catch (colErr) {
            console.warn(`No se pudieron cargar tickets para columna ${colId}:`, colErr);
            ticketsMap[colId] = [];
          }
        })
      );

      setTicketsByColumn(ticketsMap);
      setIsUsingMocks(false);
    } catch (err) {
      console.warn('Error al cargar tablero desde API:', err);
      // Fallback a mockData
      if (err.status === null || err.message?.includes('conexión') || err.message?.includes('Network')) {
        setIsUsingMocks(true);
        setBoard({
          ...mockBoardDetail,
          _id: boardId,
          name: mockBoardDetail.name || 'Tablero de Demostración',
        });
        setColumns(mockBoardDetail.columns || []);
        setTicketsByColumn(mockTickets || {});
        showToast('Servidor no disponible. Usando datos de prueba (mocks).', 'info');
      } else {
        setError(err.message || 'Error al cargar los detalles del tablero');
      }
    } finally {
      setLoading(false);
    }
  }, [boardId, showToast]);

  useEffect(() => {
    let isMounted = true;

    async function initialLoad() {
      if (!boardId) return;
      try {
        const boardData = await boardService.getById(boardId);
        if (!isMounted) return;
        setBoard(boardData);
        const cols = boardData.columns || [];
        setColumns(cols);

        const ticketsMap = {};
        await Promise.all(
          cols.map(async (col) => {
            const colId = col._id || col.id;
            try {
              const colTickets = await ticketService.getByColumn(boardId, colId);
              ticketsMap[colId] = Array.isArray(colTickets) ? colTickets : [];
            } catch {
              ticketsMap[colId] = [];
            }
          })
        );

        if (!isMounted) return;
        setTicketsByColumn(ticketsMap);
        setIsUsingMocks(false);
      } catch (err) {
        if (!isMounted) return;
        console.warn('Error al cargar tablero desde API:', err);
        if (err.status === null || err.message?.includes('conexión') || err.message?.includes('Network')) {
          setIsUsingMocks(true);
          setBoard({
            ...mockBoardDetail,
            _id: boardId,
            name: mockBoardDetail.name || 'Tablero de Demostración',
          });
          setColumns(mockBoardDetail.columns || []);
          setTicketsByColumn(mockTickets || {});
          showToast('Servidor no disponible. Usando datos de prueba (mocks).', 'info');
        } else {
          setError(err.message || 'Error al cargar los detalles del tablero');
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    initialLoad();

    return () => {
      isMounted = false;
    };
  }, [boardId, showToast]);

  // ==========================================
  // Manejadores de Columnas
  // ==========================================

  const handleOpenAddColumn = () => {
    setNewColumnName('');
    setColumnError(null);
    setIsAddColumnOpen(true);
  };

  const handleCreateColumn = async (e) => {
    e.preventDefault();
    if (isSubmittingColumn) return;

    const trimmed = newColumnName.trim();
    if (!trimmed) {
      setColumnError('El nombre de la columna es obligatorio');
      return;
    }

    setIsSubmittingColumn(true);
    setColumnError(null);

    try {
      let created;
      if (isUsingMocks) {
        await new Promise((r) => setTimeout(r, 350));
        created = {
          _id: 'col_mock_' + Date.now(),
          name: trimmed,
          board: boardId,
          position: columns.length,
          createdAt: new Date().toISOString(),
        };
      } else {
        created = await columnService.create(boardId, { name: trimmed });
      }

      const colId = created._id || created.id;
      setColumns((prev) => [...prev, created]);
      setTicketsByColumn((prev) => ({ ...prev, [colId]: [] }));
      showToast('Columna creada con éxito', 'info');
      setIsAddColumnOpen(false);
    } catch (err) {
      const msg = err.message || 'Error al crear la columna';
      setColumnError(msg);
      showToast(msg, 'error');
    } finally {
      setIsSubmittingColumn(false);
    }
  };

  const handleDeleteColumn = async (colId) => {
    const colToDelete = columns.find((c) => (c._id || c.id) === colId);
    const colName = colToDelete ? (colToDelete.name || colToDelete.title) : 'esta columna';

    if (!window.confirm(`¿Estás seguro de eliminar "${colName}" y todos sus tickets asociados?`)) {
      return;
    }

    try {
      if (isUsingMocks) {
        await new Promise((r) => setTimeout(r, 300));
      } else {
        await columnService.delete(boardId, colId);
      }

      setColumns((prev) => prev.filter((c) => (c._id || c.id) !== colId));
      setTicketsByColumn((prev) => {
        const copy = { ...prev };
        delete copy[colId];
        return copy;
      });
      showToast(`Columna "${colName}" eliminada`, 'info');
    } catch (err) {
      showToast(err.message || 'Error al eliminar la columna', 'error');
    }
  };

  // ==========================================
  // Manejadores de Tickets: Crear
  // ==========================================

  const handleOpenAddTicket = (colId) => {
    setTargetColumnId(colId);
    setTicketFormData({ title: '', description: '' });
    setTicketFormErrors({});
    setIsAddTicketOpen(true);
  };

  const handleCreateTicket = async (e) => {
    e.preventDefault();
    if (isSubmittingTicket) return;

    const trimmedTitle = ticketFormData.title.trim();
    if (!trimmedTitle) {
      setTicketFormErrors({ title: 'El título del ticket es obligatorio' });
      return;
    }

    setIsSubmittingTicket(true);
    setTicketFormErrors({});

    try {
      let created;
      const colTickets = ticketsByColumn[targetColumnId] || [];
      const nextPosition = colTickets.length;

      if (isUsingMocks) {
        await new Promise((r) => setTimeout(r, 350));
        created = {
          _id: 'tkt_mock_' + Date.now(),
          title: trimmedTitle,
          description: ticketFormData.description.trim(),
          column: targetColumnId,
          board: boardId,
          position: nextPosition,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
      } else {
        created = await ticketService.create(boardId, targetColumnId, {
          title: trimmedTitle,
          description: ticketFormData.description.trim(),
          position: nextPosition,
        });
      }

      setTicketsByColumn((prev) => ({
        ...prev,
        [targetColumnId]: [...(prev[targetColumnId] || []), created],
      }));

      showToast('Ticket creado exitosamente', 'info');
      setIsAddTicketOpen(false);
    } catch (err) {
      const msg = err.message || 'Error al crear el ticket';
      setTicketFormErrors({ general: msg });
      showToast(msg, 'error');
    } finally {
      setIsSubmittingTicket(false);
    }
  };

  // ==========================================
  // Manejadores de Tickets: Ver / Editar / Mover
  // ==========================================

  const handleOpenTicketDetail = (ticket, column) => {
    const colId = column._id || column.id;
    setSelectedTicket(ticket);
    setSelectedTicketColumnId(colId);
    setEditTicketData({
      title: ticket.title || '',
      description: ticket.description || '',
      targetColumnId: colId,
    });
    setEditTicketErrors({});
  };

  const handleCloseTicketDetail = () => {
    if (isUpdatingTicket) return;
    setSelectedTicket(null);
    setSelectedTicketColumnId(null);
  };

  // ==========================================
  // MOVIMIENTO OPTIMISTA DE TICKETS (Pasos 44 - 48)
  // ==========================================
  const moveTicketOptimistic = async (ticket, fromColId, toColId) => {
    if (!ticket || !fromColId || !toColId || fromColId === toColId) return;

    const ticketId = ticket._id || ticket.id;

    // 44. Guardar en memoria el estado actual antes de mutar
    const previousTicketsState = ticketsRef.current;

    const sourceList = previousTicketsState[fromColId] || [];
    const destList = previousTicketsState[toColId] || [];

    // Validar existencia en origen
    const movingItem = sourceList.find((t) => (t._id || t.id) === ticketId) || ticket;

    // 45. Mover visualmente el ticket a la columna destino de inmediato (Optimistic UI)
    const updatedSource = sourceList.filter((t) => (t._id || t.id) !== ticketId);
    const updatedTicket = {
      ...movingItem,
      column: toColId,
      position: destList.length,
    };
    const updatedDest = [...destList, updatedTicket];

    setTicketsByColumn((prev) => ({
      ...prev,
      [fromColId]: updatedSource,
      [toColId]: updatedDest,
    }));

    showToast('Moviendo ticket...', 'info', 1500);

    // 46. Enviar la petición PATCH al backend usando el contrato real
    try {
      if (isUsingMocks) {
        await new Promise((r) => setTimeout(r, 400));
      } else {
        await ticketService.move(
          boardId,
          fromColId,
          ticketId,
          toColId,
          destList.length
        );
      }

      // 47. Si responde correctamente: confirmar nuevo estado
      showToast('Ticket movido correctamente', 'info');
    } catch (err) {
      // 48. Si responde con error o falla la red: RESTAURAR estado anterior y mostrar Toast
      console.error('Fallo al mover ticket, revirtiendo estado:', err);
      setTicketsByColumn(previousTicketsState);
      const errorMsg =
        err.message || 'Error al mover el ticket. Se restauró a su columna original.';
      showToast(errorMsg, 'error');
    }
  };

  // Guardar cambios de edición (título, descripción, y opcionalmente mover de columna)
  const handleSaveTicketChanges = async (e) => {
    e.preventDefault();
    if (isUpdatingTicket || !selectedTicket) return;

    const trimmedTitle = editTicketData.title.trim();
    if (!trimmedTitle) {
      setEditTicketErrors({ title: 'El título no puede estar vacío' });
      return;
    }

    const ticketId = selectedTicket._id || selectedTicket.id;
    const currentColumnId = selectedTicketColumnId;
    const targetColId = editTicketData.targetColumnId;

    setIsUpdatingTicket(true);
    setEditTicketErrors({});

    try {
      // 1. Si cambió de columna, aplicamos el movimiento optimista
      if (targetColId && targetColId !== currentColumnId) {
        await moveTicketOptimistic(selectedTicket, currentColumnId, targetColId);
      }

      // 2. Si cambió título o descripción, actualizamos
      if (
        trimmedTitle !== selectedTicket.title ||
        editTicketData.description !== selectedTicket.description
      ) {
        if (isUsingMocks) {
          await new Promise((r) => setTimeout(r, 300));
        } else {
          await ticketService.update(boardId, targetColId || currentColumnId, ticketId, {
            title: trimmedTitle,
            description: editTicketData.description,
          });
        }

        // Actualizar en el estado local
        const finalCol = targetColId || currentColumnId;
        setTicketsByColumn((prev) => ({
          ...prev,
          [finalCol]: (prev[finalCol] || []).map((t) =>
            (t._id || t.id) === ticketId
              ? { ...t, title: trimmedTitle, description: editTicketData.description }
              : t
          ),
        }));

        showToast('Ticket actualizado con éxito', 'info');
      }

      handleCloseTicketDetail();
    } catch (err) {
      const msg = err.message || 'Error al guardar cambios del ticket';
      setEditTicketErrors({ general: msg });
      showToast(msg, 'error');
    } finally {
      setIsUpdatingTicket(false);
    }
  };

  // Movimiento rápido con flechas entre columnas contiguas
  const handleQuickMove = (ticket, currentColId, direction) => {
    const currentIndex = columns.findIndex((c) => (c._id || c.id) === currentColId);
    if (currentIndex === -1) return;

    const targetIndex = direction === 'left' ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= columns.length) return;

    const targetCol = columns[targetIndex];
    const targetColId = targetCol._id || targetCol.id;

    moveTicketOptimistic(ticket, currentColId, targetColId);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: 'var(--bg-primary)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Navbar />

      <main style={{ flex: 1, padding: '24px 32px', display: 'flex', flexDirection: 'column' }}>
        {/* Banner Mock si aplica */}
        {isUsingMocks && (
          <div
            style={{
              backgroundColor: 'var(--surface-primary)',
              border: '1px solid var(--accent-color)',
              color: 'var(--text-primary)',
              padding: '8px 16px',
              borderRadius: 'var(--radius)',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '0.85rem',
            }}
          >
            <span>
              ℹ️ <strong>Modo Mock Activo:</strong> Los movimientos y ediciones se simulan de manera local optimista.
            </span>
            <Button
              variant="secondary"
              onClick={loadBoardData}
              style={{ padding: '2px 8px', fontSize: '0.75rem' }}
            >
              Reconectar API
            </Button>
          </div>
        )}

        {/* Encabezado del Tablero */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '24px',
            flexWrap: 'wrap',
            gap: '16px',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
              <button
                type="button"
                onClick={() => navigate('/boards')}
                title="Volver al listado de tableros"
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--accent-color)',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  fontWeight: '600',
                  padding: 0,
                }}
              >
                ← Tableros
              </button>
              <span style={{ color: 'var(--text-secondary)' }}>/</span>
              <h1
                style={{
                  margin: 0,
                  color: 'var(--text-primary)',
                  fontSize: '1.6rem',
                  fontWeight: '700',
                }}
              >
                {board ? board.name : 'Cargando tablero...'}
              </h1>
            </div>

            {board?.description && (
              <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                {board.description}
              </p>
            )}
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <Button variant="primary" onClick={handleOpenAddColumn}>
              ➕ Nueva Columna
            </Button>
          </div>
        </div>

        {/* Estado: Loading */}
        {loading && (
          <div
            style={{
              textAlign: 'center',
              padding: '80px 20px',
              color: 'var(--text-secondary)',
              flex: 1,
            }}
          >
            <div
              style={{
                display: 'inline-block',
                width: '40px',
                height: '40px',
                border: '3px solid var(--border-color)',
                borderTopColor: 'var(--accent-color)',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
                marginBottom: '16px',
              }}
            />
            <p style={{ margin: 0, fontSize: '1rem' }}>Cargando tablero y tickets...</p>
            <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
          </div>
        )}

        {/* Estado: Error */}
        {!loading && error && (
          <div
            style={{
              backgroundColor: 'rgba(229, 62, 62, 0.08)',
              border: '1px solid var(--danger-color)',
              borderRadius: 'var(--radius)',
              padding: '32px',
              textAlign: 'center',
              color: 'var(--danger-color)',
              maxWidth: '500px',
              margin: '60px auto',
            }}
          >
            <h3 style={{ margin: '0 0 8px' }}>No se pudo cargar el tablero</h3>
            <p style={{ margin: '0 0 20px', fontSize: '0.9rem' }}>{error}</p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
              <Button variant="secondary" onClick={() => navigate('/boards')}>
                Volver a Tableros
              </Button>
              <Button variant="primary" onClick={loadBoardData}>
                Reintentar
              </Button>
            </div>
          </div>
        )}

        {/* Estado: Empty (sin columnas) */}
        {!loading && !error && columns.length === 0 && (
          <div
            style={{
              backgroundColor: 'var(--surface-primary)',
              border: '2px dashed var(--border-color)',
              borderRadius: 'var(--radius)',
              padding: '60px 20px',
              textAlign: 'center',
              maxWidth: '500px',
              margin: '60px auto',
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div style={{ fontSize: '3rem', marginBottom: '16px' }}>📊</div>
            <h3 style={{ margin: '0 0 8px', color: 'var(--text-primary)' }}>
              Este tablero no tiene columnas
            </h3>
            <p
              style={{
                margin: '0 0 24px',
                color: 'var(--text-secondary)',
                fontSize: '0.95rem',
              }}
            >
              Crea tu primera columna (ej. "Por hacer", "En progreso", "Hecho") para comenzar a organizar tickets.
            </p>
            <Button variant="primary" onClick={handleOpenAddColumn}>
              Añadir Primera Columna
            </Button>
          </div>
        )}

        {/* Estado: Data (Columnas y Tickets) */}
        {!loading && !error && columns.length > 0 && (
          <div
            style={{
              display: 'flex',
              gap: '20px',
              overflowX: 'auto',
              paddingBottom: '24px',
              alignItems: 'flex-start',
              flex: 1,
            }}
          >
            {columns.map((col, index) => {
              const colId = col._id || col.id;
              const tickets = ticketsByColumn[colId] || [];
              const canMoveLeft = index > 0;
              const canMoveRight = index < columns.length - 1;

              return (
                <ColumnCard
                  key={colId}
                  column={{
                    id: colId,
                    _id: colId,
                    name: col.name || col.title,
                    title: col.name || col.title,
                  }}
                  onAddTicket={() => handleOpenAddTicket(colId)}
                  onDeleteColumn={() => handleDeleteColumn(colId)}
                >
                  {tickets.length === 0 ? (
                    <div
                      style={{
                        padding: '24px 12px',
                        textAlign: 'center',
                        color: 'var(--text-secondary)',
                        fontSize: '0.85rem',
                        border: '1px dashed var(--border-color)',
                        borderRadius: 'var(--radius)',
                      }}
                    >
                      Sin tickets aún
                    </div>
                  ) : (
                    tickets.map((ticket) => {
                      const tId = ticket._id || ticket.id;
                      return (
                        <TicketCard
                          key={tId}
                          ticket={{
                            ...ticket,
                            id: tId,
                          }}
                          onClick={() => handleOpenTicketDetail(ticket, col)}
                          onMoveLeft={canMoveLeft ? () => handleQuickMove(ticket, colId, 'left') : undefined}
                          onMoveRight={canMoveRight ? () => handleQuickMove(ticket, colId, 'right') : undefined}
                        />
                      );
                    })
                  )}
                </ColumnCard>
              );
            })}
          </div>
        )}
      </main>

      {/* Modal: Crear Columna */}
      <Modal
        isOpen={isAddColumnOpen}
        onClose={() => !isSubmittingColumn && setIsAddColumnOpen(false)}
        title="Añadir Nueva Columna"
      >
        <form onSubmit={handleCreateColumn} noValidate>
          <Input
            label="Nombre de la Columna *"
            name="columnName"
            type="text"
            placeholder="ej. En Revisión, Bloqueado..."
            value={newColumnName}
            onChange={(e) => {
              setNewColumnName(e.target.value);
              if (columnError) setColumnError(null);
            }}
            error={columnError}
            disabled={isSubmittingColumn}
            autoFocus
          />

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '16px' }}>
            <Button
              variant="secondary"
              onClick={() => setIsAddColumnOpen(false)}
              disabled={isSubmittingColumn}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={isSubmittingColumn}
              loading={isSubmittingColumn}
            >
              {isSubmittingColumn ? 'Creando...' : 'Crear Columna'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal: Crear Ticket */}
      <Modal
        isOpen={isAddTicketOpen}
        onClose={() => !isSubmittingTicket && setIsAddTicketOpen(false)}
        title="Crear Nuevo Ticket"
      >
        <form onSubmit={handleCreateTicket} noValidate>
          {ticketFormErrors.general && (
            <div
              style={{
                backgroundColor: 'rgba(229, 62, 62, 0.1)',
                border: '1px solid var(--danger-color)',
                color: 'var(--danger-color)',
                padding: '8px 12px',
                borderRadius: 'var(--radius)',
                fontSize: '0.85rem',
                marginBottom: '12px',
              }}
            >
              {ticketFormErrors.general}
            </div>
          )}

          <Input
            label="Título de la Tarea *"
            name="title"
            type="text"
            placeholder="ej. Implementar endpoints de autenticación"
            value={ticketFormData.title}
            onChange={(e) => {
              setTicketFormData((prev) => ({ ...prev, title: e.target.value }));
              if (ticketFormErrors.title) {
                setTicketFormErrors((prev) => ({ ...prev, title: null }));
              }
            }}
            error={ticketFormErrors.title}
            disabled={isSubmittingTicket}
            autoFocus
          />

          <Input
            label="Descripción (opcional)"
            name="description"
            as="textarea"
            rows="3"
            placeholder="Detalles técnicos, requerimientos, notas..."
            value={ticketFormData.description}
            onChange={(e) =>
              setTicketFormData((prev) => ({ ...prev, description: e.target.value }))
            }
            disabled={isSubmittingTicket}
          />

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '16px' }}>
            <Button
              variant="secondary"
              onClick={() => setIsAddTicketOpen(false)}
              disabled={isSubmittingTicket}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={isSubmittingTicket}
              loading={isSubmittingTicket}
            >
              {isSubmittingTicket ? 'Creando...' : 'Guardar Ticket'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal: Detalle / Edición / Mover Ticket */}
      <Modal
        isOpen={Boolean(selectedTicket)}
        onClose={handleCloseTicketDetail}
        title="Detalles y Movimiento del Ticket"
      >
        {selectedTicket && (
          <form onSubmit={handleSaveTicketChanges} noValidate>
            {editTicketErrors.general && (
              <div
                style={{
                  backgroundColor: 'rgba(229, 62, 62, 0.1)',
                  border: '1px solid var(--danger-color)',
                  color: 'var(--danger-color)',
                  padding: '8px 12px',
                  borderRadius: 'var(--radius)',
                  fontSize: '0.85rem',
                  marginBottom: '12px',
                }}
              >
                {editTicketErrors.general}
              </div>
            )}

            <Input
              label="Título del Ticket *"
              name="title"
              type="text"
              value={editTicketData.title}
              onChange={(e) => {
                setEditTicketData((prev) => ({ ...prev, title: e.target.value }));
                if (editTicketErrors.title) {
                  setEditTicketErrors((prev) => ({ ...prev, title: null }));
                }
              }}
              error={editTicketErrors.title}
              disabled={isUpdatingTicket}
            />

            <Input
              label="Descripción"
              name="description"
              as="textarea"
              rows="4"
              value={editTicketData.description}
              onChange={(e) =>
                setEditTicketData((prev) => ({ ...prev, description: e.target.value }))
              }
              disabled={isUpdatingTicket}
            />

            {/* Mover a Columna */}
            <div style={{ marginBottom: '16px' }}>
              <label
                style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  color: 'var(--text-secondary)',
                  marginBottom: '4px',
                }}
              >
                Columna actual / Mover a:
              </label>
              <select
                value={editTicketData.targetColumnId}
                onChange={(e) =>
                  setEditTicketData((prev) => ({ ...prev, targetColumnId: e.target.value }))
                }
                disabled={isUpdatingTicket}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: 'var(--radius)',
                  border: '1px solid var(--border-color)',
                  backgroundColor: 'var(--surface-primary)',
                  color: 'var(--text-primary)',
                  outline: 'none',
                  fontSize: '0.95rem',
                }}
              >
                {columns.map((col) => {
                  const cId = col._id || col.id;
                  return (
                    <option key={cId} value={cId}>
                      {col.name || col.title} {cId === selectedTicketColumnId ? '(Actual)' : ''}
                    </option>
                  );
                })}
              </select>
              {editTicketData.targetColumnId !== selectedTicketColumnId && (
                <small
                  style={{
                    display: 'block',
                    marginTop: '4px',
                    color: 'var(--accent-color)',
                    fontSize: '0.78rem',
                  }}
                >
                  ⚡ Se aplicará actualización optimista al guardar.
                </small>
              )}
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '8px',
                marginTop: '20px',
              }}
            >
              <Button
                variant="secondary"
                onClick={handleCloseTicketDetail}
                disabled={isUpdatingTicket}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={isUpdatingTicket}
                loading={isUpdatingTicket}
              >
                {isUpdatingTicket ? 'Guardando...' : 'Guardar Cambios'}
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};
