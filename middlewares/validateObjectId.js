const mongoose = require("mongoose");

const validateObjectId = (req, res, next) => {
    const { boardId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(boardId)) {
        return res.status(400).json({
            error: "ID inválido"
        });
    }

    next();
};

module.exports = validateObjectId;