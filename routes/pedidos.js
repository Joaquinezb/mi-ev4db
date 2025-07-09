const express = require('express');
const router = express.Router();
const Pedido = require('../models/Pedido');
const Producto = require('../models/Producto');

// Crear pedido
router.post('/', async (req, res) => {
  try {
    // Calcular total y armar productos con info extra
    let total = 0;
    const productosDetallados = [];
    for (const item of req.body.productos) {
      const producto = await Producto.findById(item.productoId);
      if (!producto) throw new Error('Producto no encontrado');
      const precioUnitario = producto.precio;
      const totalComprado = precioUnitario * item.cantidad;
      total += totalComprado;
      productosDetallados.push({
        productoId: item.productoId,
        codigoProducto: producto.codigo,
        nombreProducto: producto.nombre,
        cantidad: item.cantidad,
        precioUnitario,
        totalComprado
      });
    }
    const nuevoPedido = new Pedido({
      ...req.body,
      productos: productosDetallados,
      total,
      fechaPedido: new Date()
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


// Actualizar pedido
router.put('/:id', async (req, res) => {
  try {
    // Calcular total actualizado y armar productos con info extra
    let total = 0;
    const productosDetallados = [];
    for (const item of req.body.productos) {
      const producto = await Producto.findById(item.productoId);
      if (!producto) throw new Error('Producto no encontrado');
      const precioUnitario = producto.precio;
      const totalComprado = precioUnitario * item.cantidad;
      total += totalComprado;
      productosDetallados.push({
        productoId: item.productoId,
        codigoProducto: producto.codigo,
        nombreProducto: producto.nombre,
        cantidad: item.cantidad,
        precioUnitario,
        totalComprado
      });
    }
    const pedidoActualizado = await Pedido.findByIdAndUpdate(
      req.params.id,
      { ...req.body, productos: productosDetallados, total },
      { new: true }
    );
    res.json(pedidoActualizado);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Eliminar pedido
router.delete('/:id', async (req, res) => {
  try {
    await Pedido.findByIdAndDelete(req.params.id);
    res.json({ mensaje: 'Pedido eliminado' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;