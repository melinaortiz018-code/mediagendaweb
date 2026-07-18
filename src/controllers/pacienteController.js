const db = require('../db');

exports.renderDashboard = async (req, res) => {
    const pacienteId = req.session.usuario.id;
    try {
        // 1. Obtener Especialidades para el filtro
        const [especialidades] = await db.query('SELECT * FROM especialidades');

        // 2. Obtener Médicos del sistema
        const [medicos] = await db.query(
            `SELECT u.id, u.nombre, e.nombre AS especialidad 
             FROM usuarios u
             JOIN medicos_detalle md ON u.id = md.usuario_id
             JOIN especialidades e ON md.especialidad_id = e.id 
             WHERE u.rol_id = 2`
        );

        // 3. Obtener Citas del Paciente
        const [citas] = await db.query(
            `SELECT c.*, u.nombre AS medico_nombre 
             FROM citas c 
             JOIN usuarios u ON c.medico_id = u.id 
             WHERE c.paciente_id = ? ORDER BY c.fecha DESC, c.hora DESC`,
            [pacienteId]
        );

        // 4. Obtener Historial Clínico
        const [historial] = await db.query(
            `SELECT h.*, u.nombre AS medico_nombre 
             FROM historial_clinico h 
             JOIN usuarios u ON h.medico_id = u.id 
             WHERE h.paciente_id = ? ORDER BY h.fecha DESC`,
            [pacienteId]
        );

        res.render('paciente_dashboard', {
            usuario: req.session.usuario,
            especialidades,
            medicos,
            citas,
            historial,
            error: req.query.error || null,
            success: req.query.success || null
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error interno al cargar el panel.');
    }
};

exports.agendarCita = async (req, res) => {
    const pacienteId = req.session.usuario.id;
    const { medico_id, fecha, hora } = req.body;

    try {
        // Bloqueo de Doble Agenda: Verificar si el médico ya tiene cita ese día a esa hora
        const [existeCita] = await db.query(
            'SELECT * FROM citas WHERE medico_id = ? AND fecha = ? AND hora = ? AND estado != "Cancelado"',
            [medico_id, fecha, hora]
        );

        if (existeCita.length > 0) {
            return res.redirect('/dashboard/paciente?error=El médico ya tiene una cita agendada en ese horario. Elige otra hora.');
        }

        // Insertar la nueva cita
        await db.query(
            'INSERT INTO citas (paciente_id, medico_id, fecha, hora, estado) VALUES (?, ?, ?, ?, "En espera")',
            [pacienteId, medico_id, fecha, hora]
        );

        res.redirect('/dashboard/paciente?success=Tu cita ha sido agendada con éxito. Notificación enviada en pantalla.');
    } catch (err) {
        console.error(err);
        res.redirect('/dashboard/paciente?error=Error al procesar el agendamiento.');
    }
};
