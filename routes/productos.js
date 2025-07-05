const express = require('express');
const router = express.Router();
const Producto = require('../models/Producto'); 

// Crear
router.post('/', async (req, res) => {
  try {
    const nuevo = new Producto(req.body);       
    const producto = await nuevo.save();        
    res.json(producto); 
  } catch (error) {     
    res.status(400).json({ error: error.message });
  }
});

// Obtener todos        
router.get('/', async (req, res) => {
  try {
    const productos = await Producto.find();      
    res.json(productos);  
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Buscar por código   
router.get('/codigo/:codigo', async (req, res) => {
  try {
    const producto = await Producto.findOne({ codigo: req.params.codigo });
    res.json(producto || {});
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Actualizar
router.put('/:id', async (req, res) => {        
  try {
    const producto = await Producto.findByIdAndUpdate(req.params.id, req.body, { new: true });  
    res.json(producto); 
  } catch (error) {     
    res.status(400).json({ error: error.message });
  }
});

// Eliminar
router.delete('/:id', async (req, res) => {     
  try {
    await Producto.findByIdAndDelete(req.params.id);
    res.json({ mensaje: 'Eliminado' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;