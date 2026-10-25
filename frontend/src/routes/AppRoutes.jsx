import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from '../pages/LoginPage';
import { BoardsListPage } from '../pages/BoardsListPage';
import { BoardDetailPage } from '../pages/BoardDetailPage';
import { NotFoundPage } from '../pages/NotFoundPage';
import { ProtectedRoute } from './ProtectedRoute';

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Ruta Pública: /login */}
      <Route path="/login" element={<LoginPage />} />

      {/* Rutas Protegidas */}
      <Route
        path="/boards"
        element={
          <ProtectedRoute>
            <BoardsListPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/boards/:boardId"
        element={
          <ProtectedRoute>
            <BoardDetailPage />
          </ProtectedRoute>
        }
      />

      {/* Redirección por defecto */}
      <Route path="/" element={<Navigate to="/boards" replace />} />

      {/* Ruta 404 No Encontrado */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};
