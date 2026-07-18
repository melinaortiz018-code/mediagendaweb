const db = require('../db');

exports.renderDashboard = async (req, res) => {
    try {
        // 1. Obtener lista de todos los médicos registrados en el sistema
        const [medicos] = await db.query('SELECT id, nombre FROM usuarios WHERE rol_id = 2');

        // 2. Obtener los horarios de atención actuales ya configurados
        const [horarios] = await db.query(
            `SELECT h.*, u.nombre AS medico_nombre 
             FROM horarios_trabajo h 
             JOIN usuarios u ON h.medico_id = u.id`
        );

        // 3. ESTADÍSTICAS: Total de citas agendadas este mes
        const [totalCitasMes] = await db.query(
            `SELECT COUNT(*) AS total FROM citas 
             WHERE MONTH(fecha) = MONTH(CURRENT_DATE()) AND YEAR(fecha) = YEAR(CURRENT_DATE())`
        );

        // 4. ESTADÍSTICAS: Porcentaje de cancelaciones globales
        const [cancelaciones] = await db.query(
            `SELECT 
                COUNT(*) AS total,
                SUM(CASE WHEN estado = 'Cancelado' THEN 1 ELSE 0 END) AS canceladas
             FROM citas`
        );
        
        let porcentajeCancelaciones = 0;
        if (cancelaciones[0].total > 0) {
            porcentajeCancelaciones = Math.round((cancelaciones[0].canceladas / cancelaciones[0].total) * 100);
        }

        // 5. ESTADÍSTICAS: Médico más solicitado (Ranking)
        const [medicoTop] = await db.query(
            `SELECT u.nombre, COUNT(c.id) AS total_citas 
             FROM citas c 
             JOIN usuarios u ON c.medico_id = u.id 
             GROUP BY c.medico_id 
             ORDER BY total_citas DESC LIMIT 3`
        );

        res.render('admin_dashboard', {
            usuario: req.session.usuario,
            medicos,
            horarios,
            estadisticas: {
                totalMes: totalCitasMes[0].total,
                porcentajeCanceladas: porcentajeCancelaciones,
                rankingMedicos: medicoTop
            },
            success: req.query.success || null,
            error: req.query.error || null
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al compilar el panel administrativo.');
    }
};

exports.configurarHorario = async (req, res) => {
    const { medico_id, dia_semana, hora_inicio, hora_fin } = req.body;
    try {
        // Registrar bloque exacto de atención médica
        await db.query(
            `INSERT INTO horarios_trabajo (medico_id, dia_semana, hora_inicio, hora_fin) 
             VALUES (?, ?, ?, ?)`
        , [medico_id, dia_semana, hora_inicio, hora_fin]);

        res.redirect('/dashboard/admin?success=Bloque de horario establecido de manera correcta.');
    } catch (err) {
        console.error(err);
        res.redirect('/dashboard/admin?error=No se pudo guardar el bloque de horario.');
    }
};
