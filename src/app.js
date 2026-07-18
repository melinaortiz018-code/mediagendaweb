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

// Configuración de archivos estáticos (Ruta absoluta ultra segura)
app.use(express.static(path.join(__dirname, 'src', 'public')));
app.use('/icons', express.static(path.join(__dirname, 'node_modules', 'bootstrap-icons', 'font')));

// 6. Inyección de URLs con prefijos individuales
app.use('/auth', authRoutes);
app.use('/paciente', pacienteRoutes); 
app.use('/medico', medicoRoutes);     
app.use('/admin', adminRoutes);       

app.get('/', (req, res) => {
    res.render('index');
});


// 8. Encendido del Servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor corriendo correctamente en el puerto ${PORT}`);
});
