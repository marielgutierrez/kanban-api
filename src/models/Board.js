const mongoose = require('mongoose');

const boardSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'El nombre del tablero es obligatorio'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Cascada: al borrar un tablero, se eliminan todas sus columnas y tickets asociados
boardSchema.pre('deleteOne', { document: true, query: false }, async function () {
  const Ticket = mongoose.model('Ticket');
  const Column = mongoose.model('Column');
  await Ticket.deleteMany({ board: this._id });
  await Column.deleteMany({ board: this._id });
});

module.exports = mongoose.model('Board', boardSchema);
