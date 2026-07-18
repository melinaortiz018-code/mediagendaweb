const express = require('express');
const session = require('express-session');
const path = require('path');

// 1. Importaciones de módulos
const authRoutes = require('./src/routes/authRoutes');
const pacienteRoutes = require('./src/routes/pacienteRoutes');
const medicoRoutes = require('./src/routes/medicoRoutes');
const adminRoutes = require('./src/routes/adminRoutes');

const app = express();

// 2. Middlewares para formularios
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// 3. Configuración de Sesiones (Optimizado para producción)
app.use(session({
    secret: process.env.SESSION_SECRET || 'secret-key-mediagenda',
    resave: false,
    saveUninitialized: false, // Mejor rendimiento y privacidad
    cookie: { 
        secure: process.env.NODE_ENV === 'production', // true si está en Render (HTTPS)
        httpOnly: true 
    }
}));

// 4. Configuración del motor de vistas EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src', 'views'));

// 5. Configuración de archivos estáticos
app.use(express.static(path.join(__dirname, 'src', 'public')));

// 6. Inyección de URLs con prefijos individuales (CORREGIDO)
app.use('/auth', authRoutes);
app.use('/paciente', pacienteRoutes); // Cambio: /paciente en vez de /dashboard
app.use('/medico', medicoRoutes);     // Cambio: /medico en vez de /dashboard
app.use('/admin', adminRoutes);       // Cambio: /admin en vez de /dashboard

// 7. Redirección automática al Login
app.get('/', (req, res) => {
    res.redirect('/auth/login');
});

// 8. Encendido del Servidor (Optimizado con host para Render)
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor corriendo correctamente en el puerto ${PORT}`);
});
