module.exports = (rolRequerido) => {
    return (req, res, next) => {
        if (!req.session.usuario) {
            return res.redirect('/auth/login');
        }
        if (req.session.usuario.rol !== rolRequerido) {
            return res.status(403).send('Acceso no autorizado para tu rol.');
        }
        next();
    };
};
