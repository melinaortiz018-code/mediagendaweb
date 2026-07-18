const db = require('../db');
const bcrypt = require('bcryptjs');

exports.renderLogin = (req, res) => {
    res.render('login', { error: null });
};

exports.renderRegister = (req, res) => {
    res.render('register', { error: null, success: null });
};

exports.register = async (req, res) => {
    const { nombre, correo, password, rol_id } = req.body;
    try {
        // Verificar si el correo ya está registrado
        const [existe] = await db.query('SELECT * FROM usuarios WHERE correo = ?', [correo]);
        if (existe.length > 0) {
            return res.render('register', { error: 'El correo ya está registrado.', success: null });
        }

        // Encriptar la contraseña de forma segura
        const hashedPassword = await bcrypt.hash(password, 10);

        // Guardar el usuario
        await db.query(
            'INSERT INTO usuarios (nombre, correo, password, rol_id) VALUES (?, ?, ?, ?)',
            [nombre, correo, hashedPassword, rol_id]
        );

        res.render('register', { error: null, success: 'Usuario registrado con éxito. Ya puedes iniciar sesión.' });
    } catch (err) {
        console.error(err);
        res.render('register', { error: 'Error interno en el servidor.', success: null });
    }
};

exports.login = async (req, res) => {
    const { correo, password } = req.body;
    try {
        // Buscar al usuario y obtener el nombre de su rol
        const [usuarios] = await db.query(
            `SELECT u.*, r.nombre AS rol_nombre 
             FROM usuarios u 
             JOIN roles r ON u.rol_id = r.id 
             WHERE u.correo = ?`, 
            [correo]
        );

        if (usuarios.length === 0) {
            return res.render('login', { error: 'Credenciales incorrectas.' });
        }

        const usuario = usuarios[0];

        // Validar contraseña
        const match = await bcrypt.compare(password, usuario.password);
        if (!match) {
            return res.render('login', { error: 'Credenciales incorrectas.' });
        }

        // Crear la sesión del usuario
        req.session.usuario = {
            id: usuario.id,
            nombre: usuario.nombre,
            rol: usuario.rol_nombre
        };

        // Redireccionar según su Rol de control
        if (usuario.rol_nombre === 'Admin') return res.redirect('/dashboard/admin');
        if (usuario.rol_nombre === 'Medico') return res.redirect('/dashboard/medico');
        return res.redirect('/dashboard/paciente');

    } catch (err) {
        console.error(err);
        res.render('login', { error: 'Error interno en el servidor.' });
    }
};

exports.logout = (req, res) => {
    req.session.destroy(() => {
        res.redirect('/auth/login');
    });
};
