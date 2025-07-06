const express = require('express');
const router = express.Router();
const Pedido = require('../models/Pedido');
const Producto = require('../models/Producto');

// Crear pedido
router.post('/', async (req, res) => {
  try {
    // Calcular total basado en productos
    let total = 0;
    for (const item of req.body.productos) {
      const producto = await Producto.findById(item.productoId);
      total += producto.precio * item.cantidad;
    }

    const nuevoPedido = new Pedido({
      ...req.body,
      total
    });
    
    const pedidoGuardado = await nuevoPedido.save();
    res.status(201).json(pedidoGuardado);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Obtener todos los pedidos con detalles
router.get('/', async (req, res) => {
  try {
    const pedidos = await Pedido.find()
      .populate('clienteId', 'nombre')
      .populate('productos.productoId', 'nombre precio');
      
    res.json(pedidos);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Obtener pedidos por cliente (mejorado)
router.get('/cliente/:clienteId', async (req, res) => {
  try {
    const pedidos = await Pedido.find({ clienteId: req.params.clienteId })
      .populate('productos.productoId', 'nombre precio codigo');
      
    res.json(pedidos);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;