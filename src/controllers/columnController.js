const Column = require("../models/Column");

// Crear una columna dentro de un tablero
const createColumn = async (req, res, next) => {
    try {
        const { boardId } = req.params;
        const { name } = req.body;

        const newColumn = await Column.create({
            name,
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
        const { columnId } = req.params;

        const column = await Column.findById(columnId);

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