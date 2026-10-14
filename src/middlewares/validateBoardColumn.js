
const Column = require("../models/Column");

const validateBoardColumn = async (req, res, next) => {
    try {
        const { boardId, columnId } = req.params;

        const column = await Column.findById(columnId);

        if (!column) {
            return res.status(404).json({
                error: "La columna no existe"
            });
        }

        if (column.board.toString() !== boardId) {
            return res.status(404).json({
                error: "La columna no pertenece a este tablero"
            });
        }

        next();
    } catch (error) {
        next(error);
    }
};

module.exports = validateBoardColumn;
