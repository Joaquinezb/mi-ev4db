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
app.use(express.static(path.join(__dirname, 'public')));

// Conexión a MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mi-ev4db')
.then(() => console.log('✅ Conectado a MongoDB'))
.catch(err => console.error('❌ Error al conectar a MongoDB:', err));

// Verificar si los archivos de rutas existen antes de importarlos
const fs = require('fs');

// Ruta de prueba principal
app.get('/', (req, res) => {
    res.json({ 
        message: 'API Tienda funcionando correctamente',
        timestamp: new Date().toISOString(),
        database: 'mi-ev4db'
    });
});

// Importar rutas solo si los archivos existen
try {
    if (fs.existsSync('./routes/clientes.js')) {
        app.use('/api/clientes', require('./routes/clientes'));
        console.log('✅ Rutas de clientes cargadas');
    } else {
        console.log('⚠️  Archivo routes/clientes.js no encontrado');
    }
} catch (error) {
    console.log('❌ Error cargando rutas de clientes:', error.message);
}

try {
    if (fs.existsSync('./routes/productos.js')) {
        app.use('/api/productos', require('./routes/productos'));
        console.log('✅ Rutas de productos cargadas');
    } else {
        console.log('⚠️  Archivo routes/productos.js no encontrado');
    }
} catch (error) {
    console.log('❌ Error cargando rutas de productos:', error.message);
}

try {
    if (fs.existsSync('./routes/pedidos.js')) {
        app.use('/api/pedidos', require('./routes/pedidos'));
        console.log('✅ Rutas de pedidos cargadas');
    } else {
        console.log('⚠️  Archivo routes/pedidos.js no encontrado');
    }
} catch (error) {
    console.log('❌ Error cargando rutas de pedidos:', error.message);
}

// Ruta de prueba para API
app.get('/api', (req, res) => {
    res.json({ message: 'API funcionando correctamente' });
});

// Manejo de errores
app.use((err, req, res, next) => {
    console.error('Error:', err.stack);
    res.status(500).json({ error: 'Error interno del servidor' });
});

// Ruta comodín para frontend (solo si existe la carpeta public)
if (fs.existsSync('./public')) {
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, 'public', 'index.html'));
    });
}

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor escuchando en http://localhost:${PORT}`);
    console.log(`📊 Base de datos: ${process.env.MONGODB_URI}`);
});