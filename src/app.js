
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const boardRoutes = require('./routes/boardRoutes');
const columnRoutes = require('./routes/columnRoutes');

const app = express();

// Middlewares globales
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Ruta de prueba / salud
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'Kanban API funcionando correctamente'
  });
});

// Rutas de tableros y columnas
app.use('/api/boards', boardRoutes);
app.use('/api/boards', columnRoutes);

// Middleware para rutas no encontradas
app.use((req, res) => {
  res.status(404).json({
    error: 'Ruta no encontrada'
  });
});

// Middleware global de errores (siempre después de las rutas)
app.use((err, req, res, next) => {
  console.error(err.message);

  // Errores de validación de Mongoose
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: err.message
    });
  }

  // Errores de formato de datos de Mongoose
  if (err.name === 'CastError') {
    return res.status(400).json({
      error: 'Formato de dato inválido'
    });
  }

  // Otros errores
  res.status(err.status || 500).json({
    error: err.message || 'Error interno del servidor'
  });
});

module.exports = app;
