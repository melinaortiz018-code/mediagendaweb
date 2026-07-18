const express = require('express');
const session = require('express-session');
const path = require('path');

// 1. Importaciones de todos tus módulos de rutas construidos
const authRoutes = require('./src/routes/authRoutes');
const pacienteRoutes = require('./src/routes/pacienteRoutes');
const medicoRoutes = require('./src/routes/medicoRoutes');
const adminRoutes = require('./src/routes/adminRoutes');

const app = express();

// 2. Configuración de Middlewares para formularios
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// 3. Configuración de Sesiones
app.use(session({
    secret: 'secret-key-mediagenda',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Mapeo seguro para Render
}));

// 4. Configuración del motor de vistas EJS (Ruta corregida hacia src/views)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src', 'views'));

// 5. Configuración de archivos estáticos CSS/Imágenes (Ruta corregida hacia src/public)
app.use(express.static(path.join(__dirname, 'src', 'public')));

// 6. Inyección y mapeo de las URLs de los paneles de control
app.use('/auth', authRoutes);
app.use('/dashboard', pacienteRoutes);
app.use('/dashboard', medicoRoutes);
app.use('/dashboard', adminRoutes);

// 7. Redirección automática al Login cuando entras a la raíz del sitio
app.get('/', (req, res) => {
    res.redirect('/auth/login');
});

// 8. Encendido del Servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo correctamente en el puerto ${PORT}`);
});