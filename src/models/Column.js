const mongoose = require('mongoose');

const columnSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'El nombre de la columna es obligatorio'],
      trim: true,
    },
    board: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Board',
      required: [true, 'El tablero asociado es obligatorio'],
    },
    position: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Cascada: al borrar una columna, se eliminan todos sus tickets asociados
columnSchema.pre('deleteOne', { document: true, query: false }, async function () {
  const Ticket = mongoose.model('Ticket');
  await Ticket.deleteMany({ column: this._id });
});

module.exports = mongoose.model('Column', columnSchema);
