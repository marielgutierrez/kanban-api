
const express = require('express');
const router = express.Router();

const ticketController = require('../controllers/ticketController');
const validateObjectId = require('../middlewares/validateObjectId');
const parentCheck = require('../middlewares/parentCheck');
const validateBoardColumn = require('../middlewares/validateBoardColumn');

// GET: listar tickets de una columna
router.get(
  '/:boardId/columns/:columnId/tickets',
  validateObjectId('boardId'),
  validateObjectId('columnId'),
  parentCheck,
  validateBoardColumn,
  ticketController.getTickets
);

// POST: crear un ticket
router.post(
  '/:boardId/columns/:columnId/tickets',
  validateObjectId('boardId'),
  validateObjectId('columnId'),
  parentCheck,
  validateBoardColumn,
  ticketController.createTicket
);

// PATCH: actualizar o mover un ticket
router.patch(
  '/:boardId/columns/:columnId/tickets/:ticketId',
  validateObjectId('boardId'),
  validateObjectId('columnId'),
  validateObjectId('ticketId'),
  parentCheck,
  validateBoardColumn,
  ticketController.updateTicket
);

module.exports = router;
