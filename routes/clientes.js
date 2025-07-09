const express = require('express');
const router = express.Router();
const Cliente = require('../models/Cliente');

// Crear cliente
router.post('/', async (req, res) => {
  try {
    // Adaptar req.body para soportar direccion anidada o campos planos
    let { nombre, apellidos, telefono, direccion } = req.body;
    if (!direccion) {
      direccion = {
        calle: req.body['direccion[calle]'] || '',
        numero: req.body['direccion[numero]'] || '',
        ciudad: req.body['direccion[ciudad]'] || ''
      };
    }
    // Validar formato de teléfono: solo números, puede iniciar con +, hasta 13 caracteres
    const telefonoValido = /^\+?\d{1,12}$/.test(telefono) && telefono.length <= 13;
    if (!telefonoValido) {
      return res.status(400).json({ error: 'El teléfono debe contener solo números y opcionalmente un "+" al inicio, máximo 13 caracteres.' });
    }
    const nuevo = new Cliente({
      nombre,
      apellidos,
      telefono,
      direccion
    });
    const cliente = await nuevo.save();
    res.json(cliente);
  } catch (error) {
    if (error.code === 11000 && error.keyPattern && error.keyPattern.telefono) {
      res.status(400).json({ error: 'Ya existe un cliente con ese teléfono.' });
    } else {
      res.status(400).json({ error: error.message });
    }
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
    let { nombre, apellidos, telefono, direccion } = req.body;
    if (!direccion) {
      direccion = {
        calle: req.body['direccion[calle]'] || '',
        numero: req.body['direccion[numero]'] || '',
        ciudad: req.body['direccion[ciudad]'] || ''
      };
    }
    // Validar formato de teléfono: solo números, puede iniciar con +, hasta 13 caracteres
    const telefonoValido = /^\+?\d{1,12}$/.test(telefono) && telefono.length <= 13;
    if (!telefonoValido) {
      return res.status(400).json({ error: 'El teléfono debe contener solo números y opcionalmente un "+" al inicio, máximo 13 caracteres.' });
    }
    const update = {
      nombre,
      apellidos,
      telefono,
      direccion
    };
    const cliente = await Cliente.findByIdAndUpdate(req.params.id, update, { new: true });
    res.json(cliente);
  } catch (error) {
    if (error.code === 11000 && error.keyPattern && error.keyPattern.telefono) {
      res.status(400).json({ error: 'Ya existe un cliente con ese teléfono.' });
    } else {
      res.status(400).json({ error: error.message });
    }
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
    const clientes = await Cliente.find({ 'direccion.ciudad': req.params.ciudad });
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