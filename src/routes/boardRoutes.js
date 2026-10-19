
const express = require("express");
const router = express.Router();

const {
    getBoards,
    createBoard,
    getBoard
} = require("../controllers/boardController");

const validateObjectId = require("../middlewares/validateObjectId");

// GET /api/boards
router.get("/", getBoards);

// POST /api/boards
router.post("/", createBoard);

// GET /api/boards/:boardId
router.get("/:boardId", validateObjectId("boardId"), getBoard);

module.exports = router;
