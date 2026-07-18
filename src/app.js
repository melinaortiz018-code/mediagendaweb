const express = require('express');
const session = require('express-session');
const path = require('path');
const app = express();

// Configuración de Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Configuración de Sesiones Seguras
app.use(session({
    secret: 'mediagenda_secret_key_12345',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // Cambiar a true si usas HTTPS en producción
}));

// Servir archivos estáticos (CSS, Imágenes, JS del cliente)
app.use(express.static(path.join(__dirname, 'src', 'public')));

// Configuración del Motor de Plantillas (Views)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src', 'views'));

// Ruta Inicial de Prueba
app.get('/', (req, res) => {
    res.send('Servidor de MEDIAGENDA funcionando correctamente.');
});

// Iniciar Servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
