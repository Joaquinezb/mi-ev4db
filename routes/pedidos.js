const express = require('express');
const router = express.Router();
const Pedido = require('../models/Pedido');     
const Cliente = require('../models/Cliente');   

// Crear
router.post('/', async (req, res) => {
  try {
    const nuevo = new Pedido(req.body);
    const pedido = await nuevo.save();
    res.json(pedido);   
  } catch (error) {     
    res.status(400).json({ error: error.message });
  }
});

// Obtener todos        
router.get('/', async (req, res) => {
  try {
    const pedidos = await Pedido.find().populate('clienteId', 'nombre');  
    res.json(pedidos);    
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Obtener pedidos por cliente
router.get('/cliente/:clienteId', async (req, res) => {
  try {
    const pedidos = await Pedido.find({ clienteId: req.params.clienteId });
    res.json(pedidos);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;