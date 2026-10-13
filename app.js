const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const boardRoutes = require('./src/routes/boardRoutes');
const columnRoutes = require('./src/routes/columnRoutes');

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

// Rutas de tableros
app.use('/api/boards', boardRoutes);

// Rutas de columnas
app.use('/api/boards', columnRoutes);

// Middleware para rutas no encontradas (404)
app.use((req, res, next) => {
  res.status(404).json({
    error: 'Ruta no encontrada'
  });
});

// Middleware global para manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);

  res.status(err.status || 500).json({
    error: err.message || 'Error interno del servidor'
  });
});

module.exports = app;