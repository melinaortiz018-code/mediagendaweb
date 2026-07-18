const db = require('../db');

exports.renderDashboard = async (req, res) => {
    const medicoId = req.session.usuario.id;
    try {
        // Consultar todas las citas asignadas a este médico
        const [citas] = await db.query(
            `SELECT c.*, u.nombre AS paciente_nombre 
             FROM citas c 
             JOIN usuarios u ON c.paciente_id = u.id 
             WHERE c.medico_id = ? 
             ORDER BY c.fecha ASC, c.hora ASC`,
            [medicoId]
        );

        res.render('medico_dashboard', {
            usuario: req.session.usuario,
            citas,
            success: req.query.success || null,
            error: req.query.error || null
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al cargar la agenda médica.');
    }
};

exports.actualizarEstadoCita = async (req, res) => {
    const { cita_id, nuevo_estado } = req.body;
    try {
        // Actualizar el estado de la cita en tiempo real
        await db.query(
            'UPDATE citas SET estado = ? WHERE id = ?',
            [nuevo_estado, cita_id]
        );
        res.redirect('/dashboard/medico?success=Estado de la cita actualizado correctamente.');
    } catch (err) {
        console.error(err);
        res.redirect('/dashboard/medico?error=No se pudo actualizar el estado.');
    }
};
