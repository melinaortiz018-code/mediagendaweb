const express = require('express');
const session = require('express-session');
const path = require('path');

// 1. IMPORTACIONES CORREGIDAS (Quitamos el '/src' sobrante)
const authRoutes = require('./routes/authRoutes');
const pacienteRoutes = require('./routes/pacienteRoutes');
const medicoRoutes = require('./routes/medicoRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();

// 2. Middlewares para formularios
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// 3. Configuración de Sesiones
app.use(session({
    secret: process.env.SESSION_SECRET || 'secret-key-mediagenda',
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: process.env.NODE_ENV === 'production', 
        httpOnly: true 
    }
}));

// 4. CORRECCIÓN DE VISTAS (Como app.js está en /src, subimos un nivel con '..')
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); 

// 5. CORRECCIÓN DE ESTÁTICOS
app.use(express.static(path.join(__dirname, 'public'))); 

// 6. Inyección de URLs con prefijos individuales
app.use('/auth', authRoutes);
app.use('/paciente', pacienteRoutes); 
app.use('/medico', medicoRoutes);     
app.use('/admin', adminRoutes);       

// 7. Redirección automática al Login
app.get('/', (req, res) => {
    res.redirect('/auth/login');
});

// 8. Encendido del Servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor corriendo correctamente en el puerto ${PORT}`);
});
