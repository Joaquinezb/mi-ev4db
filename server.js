const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const cors = require('cors');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// En server.js, justo después de app.use(express.json());
app.use((req, res, next) => {
  console.log(`📨 Petición recibida: ${req.method} ${req.url}`);
  next();
});

// 1. SERVIR ARCHIVOS ESTÁTICOS (PRIMERO)
app.use(express.static(path.join(__dirname, 'public')));

// 2. RUTAS API
app.use('/api/clientes', require('./routes/clientes'));
app.use('/api/productos', require('./routes/productos'));
app.use('/api/pedidos', require('./routes/pedidos'));

// 3. Ruta de prueba para API
app.get('/api/status', (req, res) => {
  res.json({ 
    message: 'API funcionando correctamente',
    database: 'mi-ev4db',
    status: 'online'
  });
});

// 4. MANEJO DE ERRORES
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({ error: 'Error interno del servidor' });
});

// 5. RUTA COMODÍN PARA FRONTEND (al final)
// Redirigir ruta raíz a login
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// Conexión a MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mi-ev4db')
  .then(() => {
    console.log('✅ Conectado a MongoDB');
    
    // Iniciar servidor
    app.listen(PORT, () => {
      console.log(`🚀 Servidor escuchando en http://localhost:${PORT}`);
      console.log(`📊 Base de datos: ${process.env.MONGODB_URI}`);
      console.log(`🌐 Frontend disponible en: http://localhost:${PORT}`);
    });
  })
  .catch(err => console.error('❌ Error al conectar a MongoDB:', err));

  