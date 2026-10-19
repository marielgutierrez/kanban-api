
const Ticket = require('../models/Ticket');
const Column = require('../models/Column');

// GET: listar tickets de una columna
const getTickets = async (req, res, next) => {
  try {
    const { columnId } = req.params;

    const tickets = await Ticket.find({ column: columnId }).sort({ position: 1 });

    return res.status(200).json(tickets);
  } catch (error) {
    next(error);
  }
};

// POST: crear un ticket dentro de una columna
const createTicket = async (req, res, next) => {
  try {
    const { boardId, columnId } = req.params;
    const { title, description, position } = req.body;

    // El título es obligatorio
    if (typeof title !== 'string' || !title.trim()) {
      return res.status(400).json({
        error: 'El título del ticket es obligatorio',
      });
    }

    const ticket = await Ticket.create({
      title: title.trim(),
      description: description ?? '',
      board: boardId,
      column: columnId,
      position: position ?? 0,
    });

    return res.status(201).json(ticket);
  } catch (error) {
    next(error);
  }
};

// PATCH: actualizar un ticket y, opcionalmente, moverlo
const updateTicket = async (req, res, next) => {
  try {
    const { boardId, columnId, ticketId } = req.params;
    const { title, description, position, columnId: destinationColumnId } = req.body;

    const updates = {};

    // Solo aceptamos los campos que se pueden modificar
    if (title !== undefined) {
      if (typeof title !== 'string' || !title.trim()) {
        return res.status(400).json({
          error: 'El título del ticket no puede estar vacío',
        });
      }

      updates.title = title.trim();
    }

    if (description !== undefined) {
      if (typeof description !== 'string') {
        return res.status(400).json({
          error: 'La descripción debe ser un texto',
        });
      }

      updates.description = description;
    }

    if (position !== undefined) {
      if (!Number.isInteger(position) || position < 0) {
        return res.status(400).json({
          error: 'La posición debe ser un entero mayor o igual a cero',
        });
      }

      updates.position = position;
    }

    // Si se envía una columna de destino, verificamos que exista
    // y que pertenezca al mismo tablero.
    if (destinationColumnId !== undefined) {
      const destinationColumn = await Column.findById(destinationColumnId);

      if (!destinationColumn) {
        return res.status(404).json({
          error: 'La columna de destino no existe',
        });
      }

      if (destinationColumn.board.toString() !== boardId) {
        return res.status(400).json({
          error: 'No se puede mover un ticket a otro tablero',
        });
      }

      updates.column = destinationColumn._id;
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        error: 'Debés enviar al menos un campo para actualizar',
      });
    }

    // Buscamos el ticket dentro del tablero indicado.
    // No exigimos que siga en la columna de la URL: así se puede
    // repetir el mismo PATCH después de haberlo movido.
    const ticket = await Ticket.findOneAndUpdate(
      { _id: ticketId, board: boardId },
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!ticket) {
      return res.status(404).json({
        error: 'El ticket no existe en este tablero',
      });
    }

    return res.status(200).json(ticket);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTickets,
  createTicket,
  updateTicket,
};

