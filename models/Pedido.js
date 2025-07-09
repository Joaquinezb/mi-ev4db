const mongoose = require('mongoose');

const pedidoSchema = new mongoose.Schema({
  codigoPedido: { type: String }, // opcional, puedes usar _id
  clienteId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Cliente', 
    required: true 
  },
  productos: [{
    productoId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Producto',
      required: true
    },
    codigoProducto: { type: String },
    nombreProducto: { type: String },
    cantidad: { type: Number, required: true, min: 1 },
    precioUnitario: { type: Number },
    totalComprado: { type: Number }
  }],
  total: { type: Number, required: true },
  metodoPago: { type: String, required: false },
  estado: {
    type: String,
    enum: ['pendiente', 'procesando', 'completado', 'cancelado'],
    default: 'pendiente'
  },
  fechaPedido: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Pedido', pedidoSchema);