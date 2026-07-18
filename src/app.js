const express = require('express');
const session = require('express-session');
const path = require('path');

// Importación de tus rutas (Ajustadas a la carpeta src)
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes'); 

const app = express();

// Configuración de Middlewares obligatorios
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Configuración de sesiones (si las usas para login)
app.use(session({
    secret: 'secret-key-mediagenda',
    resave: false,
    saveUninitialized: true
}));

// Configuración de vistas EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Configuración de archivos estáticos (CSS, imágenes)
app.use(express.static(path.resolve(__dirname, '../public')));

// Uso de tus rutas en el sistema
app.use('/', authRoutes);
app.use('/admin', adminRoutes); // Si tus rutas de admin empiezan con /admin

// Ruta de prueba inicial
app.get('/', (req, res) => {
    res.send('Servidor de MEDIAGENDA funcionando correctamente.');
});

// Iniciar Servidor (Siempre al final absoluto)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
