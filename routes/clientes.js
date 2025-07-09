const express = require('express');
const router = express.Router();
const Cliente = require('../models/Cliente');

// Crear cliente
router.post('/', async (req, res) => {
  try {
    // Adaptar req.body para soportar direccion y apellidos
    const { nombre, apellidos, telefono, ciudad, calle, numero } = req.body;
    const nuevo = new Cliente({
      nombre,
      apellidos,

      telefono,
      direccion: {
        calle,
        numero,
        ciudad
      }
    });
    const cliente = await nuevo.save();
    res.json(cliente);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Obtener todos        
router.get('/', async (req, res) => {
  try {
    const clientes = await Cliente.find();        
    res.json(clientes);   
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Actualizar
router.put('/:id', async (req, res) => {        
  try {
    const { nombre, apellidos, telefono, ciudad, calle, numero } = req.body;
    const update = {
      nombre,
      apellidos,
      telefono,
      direccion: {
        calle,
        numero,
        ciudad
      }
    };
    const cliente = await Cliente.findByIdAndUpdate(req.params.id, update, { new: true });
    res.json(cliente);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Eliminar
router.delete('/:id', async (req, res) => {     
  try {
    await Cliente.findByIdAndDelete(req.params.id);
    res.json({ mensaje: 'Eliminado' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Buscar por ciudad    
router.get('/ciudad/:ciudad', async (req, res) => {
  try {
    const clientes = await Cliente.find({ ciudad: req.params.ciudad });   
    res.json(clientes);   
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Buscar por fecha     
router.get('/fecha/:fecha', async (req, res) => {
  try {
    const fecha = new Date(req.params.fecha);     
    const siguiente = new Date(fecha);
    siguiente.setDate(siguiente.getDate() + 1);   
    const clientes = await Cliente.find({
      fechaRegistro: { $gte: fecha, $lt: siguiente }
    });
    res.json(clientes);   
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;