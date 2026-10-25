import React, { useState } from 'react';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';
import { useToast } from '../hooks/useToast';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';

export const LoginPage = () => {
  const { isAuthenticated, login } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    identifier: '',
    password: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Si ya está autenticado, redirigir
  if (isAuthenticated) {
    return <Navigate to="/boards" replace />;
  }

  const from = location.state?.from?.pathname || '/boards';

  const validate = () => {
    const newErrors = {};
    const trimmedId = formData.identifier.trim();

    if (!trimmedId) {
      newErrors.identifier = 'El usuario o correo electrónico es obligatorio';
    } else if (trimmedId.length < 3) {
      newErrors.identifier = 'Debe tener al menos 3 caracteres';
    }

    if (!formData.password) {
      newErrors.password = 'La contraseña es obligatoria';
    } else if (formData.password.length < 4) {
      newErrors.password = 'La contraseña debe tener al menos 4 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting) return;

    if (!validate()) {
      showToast('Por favor completa los campos requeridos', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      await login(formData);
      showToast('Sesión iniciada correctamente', 'info');
      navigate(from, { replace: true });
    } catch (err) {
      const errorMsg = err.message || 'Error al iniciar sesión';
      showToast(errorMsg, 'error');
      setErrors((prev) => ({ ...prev, general: errorMsg }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: 'var(--bg-primary)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '24px',
        position: 'relative',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
        }}
      >
        <Button variant="secondary" onClick={toggleTheme}>
          {theme === 'dark' ? '☀️ Modo Claro' : '🌙 Modo Oscuro'}
        </Button>
      </div>

      <div
        style={{
          width: '100%',
          maxWidth: '420px',
          backgroundColor: 'var(--surface-primary)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius)',
          boxShadow: 'var(--shadow)',
          padding: '36px 32px',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div
            style={{
              display: 'inline-block',
              backgroundColor: 'var(--accent-color)',
              color: '#FFF',
              borderRadius: '8px',
              padding: '6px 14px',
              fontWeight: '700',
              fontSize: '1.2rem',
              marginBottom: '12px',
            }}
          >
            KB
          </div>
          <h1
            style={{
              margin: '0 0 8px',
              fontSize: '1.6rem',
              color: 'var(--text-primary)',
            }}
          >
            Iniciar Sesión
          </h1>
          <p
            style={{
              margin: 0,
              fontSize: '0.9rem',
              color: 'var(--text-secondary)',
            }}
          >
            Ingresa a tu tablero Kanban y gestiona tus tareas
          </p>
        </div>

        {errors.general && (
          <div
            style={{
              backgroundColor: 'rgba(229, 62, 62, 0.1)',
              border: '1px solid var(--danger-color)',
              color: 'var(--danger-color)',
              padding: '10px 14px',
              borderRadius: 'var(--radius)',
              fontSize: '0.85rem',
              marginBottom: '16px',
            }}
          >
            {errors.general}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <Input
            label="Usuario o Correo Electrónico"
            name="identifier"
            type="text"
            placeholder="ej. nacho@devboard.io o desarrollador"
            value={formData.identifier}
            onChange={handleChange}
            error={errors.identifier}
            disabled={isSubmitting}
            autoFocus
          />

          <Input
            label="Contraseña"
            name="password"
            type="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            disabled={isSubmitting}
          />

          <div style={{ marginTop: '20px' }}>
            <Button
              type="submit"
              variant="primary"
              disabled={isSubmitting}
              loading={isSubmitting}
              style={{
                width: '100%',
                padding: '10px 16px',
                fontSize: '1rem',
              }}
            >
              {isSubmitting ? 'Iniciando sesión...' : 'Ingresar'}
            </Button>
          </div>
        </form>

        <div
          style={{
            marginTop: '24px',
            paddingTop: '16px',
            borderTop: '1px solid var(--border-color)',
            fontSize: '0.8rem',
            color: 'var(--text-secondary)',
            textAlign: 'center',
          }}
        >
          💡 <em>Demo rápida:</em> Podés ingresar cualquier usuario y contraseña (ej. demo / 1234).
        </div>
      </div>
    </div>
  );
};
