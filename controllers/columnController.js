const Board = require("../models/Board");
const Column = require("../models/Column");

// Crear una columna dentro de un tablero
const createColumn = async (req, res, next) => {
    try {
        const { boardId } = req.params;
        const { title } = req.body;

        const board = await Board.findById(boardId);

        if (!board) {
            return res.status(404).json({
                error: "El tablero no existe"
            });
        }

        const newColumn = await Column.create({
            title,
            board: boardId
        });

        res.status(201).json(newColumn);
    } catch (error) {
        next(error);
    }
};

// Eliminar una columna de un tablero
const deleteColumn = async (req, res, next) => {
    try {
        const { boardId, columnId } = req.params;

        const column = await Column.findOne({
            _id: columnId,
            board: boardId
        });

        if (!column) {
            return res.status(404).json({
                error: "La columna no existe en este tablero"
            });
        }

        await column.deleteOne();

        res.status(204).send();
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createColumn,
    deleteColumn
};