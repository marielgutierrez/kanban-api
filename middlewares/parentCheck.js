const Board = require("../models/Board");
const parentCheck = async (req, res, next) => {
    try {
        const board = await Board.findById(req.params.boardId);

        if (!board) {
            return res.status(404).json({
                error: "El tablero no existe"
            });
        }

        next();
    } catch (error) {
        next(error);
    }
};

module.exports = parentCheck;