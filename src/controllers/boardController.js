const Board = require("../models/Board");
const Column = require("../models/Column");

// Listar todos los tableros
const getBoards = async (req, res, next) => {
    try {
        const boards = await Board.find().sort({ createdAt: -1 });

        res.status(200).json(boards);
    } catch (error) {
        next(error);
    }
};

// Crear un tablero
const createBoard = async (req, res, next) => {
    try {
        const { name, description } = req.body;

        const newBoard = await Board.create({
            name,
            description
        });

        res.status(201).json(newBoard);
    } catch (error) {
        next(error);
    }
};

// Obtener un tablero con sus columnas
const getBoard = async (req, res, next) => {
    try {
        const { boardId } = req.params;
//busca el tablero por el ID que viene en la URL.
        const board = await Board.findById(boardId);

        if (!board) {
            return res.status(404).json({
                error: "El tablero no existe"
            });
        }
//encuentra las columnas que tienen asociado ese tablero
        const columns = await Column.find({ board: boardId });

        res.status(200).json({
            //copia los datos del tablero y columns agrega la lista de columnas a la respuesta.
            ...board.toObject(),
            columns
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getBoards,
    createBoard,
    getBoard
};