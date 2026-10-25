import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { boardService } from '../api/boardService';
import { mockBoards } from '../api/mockData';
import { useToast } from '../hooks/useToast';
import { Navbar } from '../components/common/Navbar';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Modal } from '../components/common/Modal';

export const BoardsListPage = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [boards, setBoards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isUsingMocks, setIsUsingMocks] = useState(false);

  // Estado del Modal de Creación
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchBoards = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await boardService.getAll();
      setBoards(Array.isArray(data) ? data : []);
      setIsUsingMocks(false);
    } catch (err) {
      console.warn('Fallo al obtener tableros del backend:', err);
      // Fallback a mockData en caso de error de conexión / servidor no activo
      if (err.status === null || err.message?.includes('conexión') || err.message?.includes('Network')) {
        setBoards(mockBoards);
        setIsUsingMocks(true);
        showToast('Servidor no disponible. Mostrando datos de prueba (mocks).', 'info');
      } else {
        setError(err.message || 'Error al cargar los tableros.');
      }
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    let isMounted = true;

    async function initialFetch() {
      try {
        const data = await boardService.getAll();
        if (!isMounted) return;
        setBoards(Array.isArray(data) ? data : []);
        setIsUsingMocks(false);
      } catch (err) {
        if (!isMounted) return;
        console.warn('Fallo al obtener tableros del backend:', err);
        if (err.status === null || err.message?.includes('conexión') || err.message?.includes('Network')) {
          setBoards(mockBoards);
          setIsUsingMocks(true);
          showToast('Servidor no disponible. Mostrando datos de prueba (mocks).', 'info');
        } else {
          setError(err.message || 'Error al cargar los tableros.');
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    initialFetch();

    return () => {
      isMounted = false;
    };
  }, [showToast]);

  const handleOpenModal = () => {
    setFormData({ name: '', description: '' });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    if (isSubmitting) return;
    setIsModalOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) {
      errors.name = 'El nombre del tablero es obligatorio';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCreateBoard = async (e) => {
    e.preventDefault();

    if (isSubmitting) return;

    if (!validateForm()) {
      showToast('Por favor ingresa un nombre para el tablero', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      let newBoard;
      if (isUsingMocks) {
        // Simular creación localmente
        await new Promise((r) => setTimeout(r, 400));
        newBoard = {
          _id: 'mock_board_' + Date.now(),
          name: formData.name.trim(),
          description: formData.description.trim(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          columns: [],
        };
      } else {
        newBoard = await boardService.create({
          name: formData.name.trim(),
          description: formData.description.trim(),
        });
      }

      setBoards((prev) => [newBoard, ...prev]);
      showToast('Tablero creado con éxito', 'info');
      setIsModalOpen(false);
    } catch (err) {
      const errorMsg = err.message || 'Error al crear el tablero';
      showToast(errorMsg, 'error');
      setFormErrors((prev) => ({ ...prev, server: errorMsg }));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Límite Negativo: Navegación programática mediante useNavigate()
  const handleSelectBoard = (boardId) => {
    navigate(`/boards/${boardId}`);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-primary)' }}>
      <Navbar />

      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 24px' }}>
        {/* Banner informativo de Mocks si aplica */}
        {isUsingMocks && (
          <div
            style={{
              backgroundColor: 'var(--surface-primary)',
              border: '1px solid var(--accent-color)',
              color: 'var(--text-primary)',
              padding: '10px 16px',
              borderRadius: 'var(--radius)',
              marginBottom: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '0.85rem',
            }}
          >
            <span>
              ℹ️ <strong>Modo Mock Activo:</strong> Operando con datos de prueba sincronizados localmente.
            </span>
            <Button
              variant="secondary"
              onClick={fetchBoards}
              style={{ padding: '4px 8px', fontSize: '0.8rem' }}
            >
              Reintentar API
            </Button>
          </div>
        )}

        {/* Encabezado de la página */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '32px',
            flexWrap: 'wrap',
            gap: '16px',
          }}
        >
          <div>
            <h1 style={{ margin: '0 0 4px', color: 'var(--text-primary)', fontSize: '1.8rem' }}>
              Tableros de Trabajo
            </h1>
            <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
              Selecciona un tablero o crea uno nuevo para organizar tus tareas y columnas
            </p>
          </div>

          <Button variant="primary" onClick={handleOpenModal}>
            ➕ Nuevo Tablero
          </Button>
        </div>

        {/* Estado: Loading */}
        {loading && (
          <div
            style={{
              textAlign: 'center',
              padding: '60px 20px',
              color: 'var(--text-secondary)',
            }}
          >
            <div
              style={{
                display: 'inline-block',
                width: '36px',
                height: '36px',
                border: '3px solid var(--border-color)',
                borderTopColor: 'var(--accent-color)',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
                marginBottom: '16px',
              }}
            />
            <p style={{ margin: 0, fontSize: '1rem' }}>Cargando tableros...</p>
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
              padding: '24px',
              textAlign: 'center',
              color: 'var(--danger-color)',
              maxWidth: '500px',
              margin: '40px auto',
            }}
          >
            <h3 style={{ margin: '0 0 8px' }}>Ocurrió un error</h3>
            <p style={{ margin: '0 0 16px', fontSize: '0.9rem' }}>{error}</p>
            <Button variant="primary" onClick={fetchBoards}>
              Reintentar
            </Button>
          </div>
        )}

        {/* Estado: Empty */}
        {!loading && !error && boards.length === 0 && (
          <div
            style={{
              backgroundColor: 'var(--surface-primary)',
              border: '2px dashed var(--border-color)',
              borderRadius: 'var(--radius)',
              padding: '60px 20px',
              textAlign: 'center',
              maxWidth: '540px',
              margin: '40px auto',
            }}
          >
            <div style={{ fontSize: '3rem', marginBottom: '16px' }}>📋</div>
            <h3 style={{ margin: '0 0 8px', color: 'var(--text-primary)' }}>
              No hay tableros disponibles
            </h3>
            <p
              style={{
                margin: '0 0 24px',
                color: 'var(--text-secondary)',
                fontSize: '0.95rem',
              }}
            >
              Comienza creando tu primer tablero Kanban para organizar tus proyectos.
            </p>
            <Button variant="primary" onClick={handleOpenModal}>
              Crear mi primer tablero
            </Button>
          </div>
        )}

        {/* Estado: Data (Grilla de tableros) */}
        {!loading && !error && boards.length > 0 && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '20px',
            }}
          >
            {boards.map((board) => {
              const boardId = board._id || board.id;
              const formattedDate = board.createdAt
                ? new Date(board.createdAt).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })
                : null;

              return (
                <div
                  key={boardId}
                  onClick={() => handleSelectBoard(boardId)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      handleSelectBoard(boardId);
                    }
                  }}
                  style={{
                    backgroundColor: 'var(--surface-primary)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius)',
                    padding: '20px',
                    boxShadow: 'var(--shadow)',
                    cursor: 'pointer',
                    transition: 'transform 0.15s ease, border-color 0.15s ease',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    minHeight: '140px',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--accent-color)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border-color)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <div>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: '8px',
                      }}
                    >
                      <h3
                        style={{
                          margin: 0,
                          color: 'var(--text-primary)',
                          fontSize: '1.15rem',
                          wordBreak: 'break-word',
                        }}
                      >
                        {board.name}
                      </h3>
                      <span style={{ fontSize: '1.2rem', color: 'var(--accent-color)' }}>
                        →
                      </span>
                    </div>

                    <p
                      style={{
                        margin: 0,
                        color: 'var(--text-secondary)',
                        fontSize: '0.875rem',
                        lineHeight: '1.4',
                        wordBreak: 'break-word',
                      }}
                    >
                      {board.description || 'Sin descripción'}
                    </p>
                  </div>

                  {formattedDate && (
                    <div
                      style={{
                        marginTop: '16px',
                        paddingTop: '12px',
                        borderTop: '1px solid var(--border-color)',
                        fontSize: '0.75rem',
                        color: 'var(--text-secondary)',
                        display: 'flex',
                        justifyContent: 'space-between',
                      }}
                    >
                      <span>Creado: {formattedDate}</span>
                      <span style={{ color: 'var(--accent-color)', fontWeight: '600' }}>
                        Ver tablero
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Modal: Crear Tablero */}
      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title="Crear Nuevo Tablero">
        <form onSubmit={handleCreateBoard} noValidate>
          {formErrors.server && (
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
              {formErrors.server}
            </div>
          )}

          <Input
            label="Nombre del Tablero *"
            name="name"
            type="text"
            placeholder="ej. Sprint 1 - Frontend"
            value={formData.name}
            onChange={handleInputChange}
            error={formErrors.name}
            disabled={isSubmitting}
            autoFocus
          />

          <Input
            label="Descripción (opcional)"
            name="description"
            as="textarea"
            rows="3"
            placeholder="Objetivo o alcance de este tablero..."
            value={formData.description}
            onChange={handleInputChange}
            disabled={isSubmitting}
          />

          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '10px',
              marginTop: '20px',
            }}
          >
            <Button
              variant="secondary"
              onClick={handleCloseModal}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={isSubmitting}
              loading={isSubmitting}
            >
              {isSubmitting ? 'Creando...' : 'Crear Tablero'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
