const mongoose = require('mongoose');

const productoSchema = new mongoose.Schema({
  codigo: { type: String, required: true, unique: true },
  nombre: { type: String, required: true },
  precio: { type: Number, required: true },
  descripcion: { type: String },
  stock: { type: Number, default: 0 },
  estado: { type: String, enum: ['activo', 'inactivo', 'descontinuado'], default: 'activo' }
});

module.exports = mongoose.model('Producto', productoSchema);
