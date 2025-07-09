const mongoose = require('mongoose');

const clienteSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  apellidos: { type: String, required: true },
  direccion: {
    calle: { type: String, required: true },
    numero: { type: String, required: true },
    ciudad: { type: String, required: true }
  },
  telefono: { type: String, required: true, unique: true },
  fechaRegistro: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Cliente', clienteSchema);