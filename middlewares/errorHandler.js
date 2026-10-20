
const errorHandler = (err, req, res, next) => {
    console.error(err);

    // Error de validación de Mongoose
    if (err.name === "ValidationError" || err.name === "CastError") {
        return res.status(400).json({
            error: err.message
        });
    }

    res.status(err.status || 500).json({
        error: err.message || "Error interno del servidor"
    });
};

module.exports = errorHandler;
