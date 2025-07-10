
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const cors = require('cors');
const session = require('express-session');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Sesiones para autenticación
app.use(session({
  secret: 'ev4-secret',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 } // 1 hora
}));

// Logger
app.use((req, res, next) => {
  console.log(`📨 Petición recibida: ${req.method} ${req.url}`);
  next();
});


// 1. RUTA DE LOGIN (antes de servir estáticos)
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (username === 'admin' && password === 'Xyz123') {
    req.session.user = 'admin';
    return res.json({ ok: true });
  }
  res.status(401).json({ error: 'Credenciales incorrectas' });
});

app.post('/logout', (req, res) => {
  req.session.destroy(() => {
    res.json({ ok: true });
  });
});

// Middleware de protección para recursos principales
function requireAuth(req, res, next) {
  // Permitir acceso a login.html, login, logout y archivos estáticos de login
  if (
    req.session.user === 'admin' ||
    req.path === '/login' ||
    req.path === '/logout' ||
    req.path === '/login.html' ||
    req.path.startsWith('/favicon')
  ) {
    return next();
  }
  // Proteger acceso a index.html y recursos principales
  if (req.path === '/' || req.path === '/index.html') {
    return req.session.user === 'admin'
      ? next()
      : res.redirect('/login.html');
  }
  // Permitir acceso a recursos estáticos (css, js, images)
  if (/\.(css|js|png|jpg|jpeg|gif|ico)$/i.test(req.path)) {
    return next();
  }
  // Proteger rutas API
  if (req.path.startsWith('/api/')) {
    return req.session.user === 'admin'
      ? next()
      : res.status(401).json({ error: 'No autenticado' });
  }
  next();
}
app.use(requireAuth);

// 2. SERVIR ARCHIVOS ESTÁTICOS
app.use(express.static(path.join(__dirname, 'public')));

// 3. RUTAS API
app.use('/api/clientes', require('./routes/clientes'));
app.use('/api/productos', require('./routes/productos'));
app.use('/api/pedidos', require('./routes/pedidos'));

// 4. Ruta de prueba para API
app.get('/api/status', (req, res) => {
  res.json({ 
    message: 'API funcionando correctamente',
    database: 'mi-ev4db',
    status: 'online'
  });
});

// 5. MANEJO DE ERRORES
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({ error: 'Error interno del servidor' });
});


// 6. RUTA COMODÍN PARA FRONTEND (redirigir raíz a index si autenticado, si no a login)
app.get('/', (req, res) => {
  if (req.session.user === 'admin') {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  } else {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
  }
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

  