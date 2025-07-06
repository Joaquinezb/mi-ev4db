const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const cors = require('cors');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Configuración CORS mejorada
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Middleware para parsear JSON (DEBE ESTAR ANTES DE LAS RUTAS)
app.use(express.json());

// Middleware para archivos estáticos (DEBE IR PRIMERO)
app.use(express.static(path.join(__dirname, 'public')));

// Cargar rutas
// Luego las rutas de la API
app.use('/api/clientes', require('./routes/clientes'));
app.use('/api/productos', require('./routes/productos'));
app.use('/api/pedidos', require('./routes/pedidos'));
console.log('✅ Todas las rutas cargadas');

// Ruta de prueba principal
app.get('/', (req, res) => {
  res.json({ 
    message: 'API Tienda funcionando correctamente',
    timestamp: new Date().toISOString(),
    database: 'mi-ev4db',
    status: 'Operativo'
  });
});

// // Ruta de prueba para API
// app.get('/api', (req, res) => {
//   res.json({ 
//     message: 'API funcionando correctamente',
//     endpoints: [
//       '/api/clientes',
//       '/api/productos',
//       '/api/pedidos'
//     ]
//   });
// });

// Servir archivos estáticos (DEBE ESTAR DESPUÉS DE LAS RUTAS API)
app.use(express.static(path.join(__dirname, 'public')));

// Middleware para rutas no encontradas (404)
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// Manejo de errores centralizado
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.stack);
  
  // Manejar errores de validación de Mongoose
  if (err.name === 'ValidationError') {
    return res.status(400).json({ 
      error: 'Error de validación',
      details: Object.values(err.errors).map(e => e.message) 
    });
  }
  
  // Manejar errores de duplicados
  if (err.code === 11000) {
    return res.status(400).json({ 
      error: 'Dato duplicado',
      field: Object.keys(err.keyPattern)[0]
    });
  }
  
  res.status(500).json({ error: 'Error interno del servidor' });
});

// Conexión a MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mi-ev4db', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('✅ Conectado a MongoDB');
  
  // Iniciar servidor
  app.listen(PORT, () => {
    console.log(`🚀 Servidor escuchando en http://localhost:${PORT}`);
    console.log(`📊 Base de datos: ${mongoose.connection.host}/${mongoose.connection.name}`);
  });
})
.catch(err => {
  console.error('❌ Error al conectar a MongoDB:', err.message);
  process.exit(1);
});


// Ruta comodín para SPA (al final)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
