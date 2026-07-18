const express = require('express');
const router = express.Router();
const pacienteController = require('../controllers/pacienteController');
const verificarRol = require('../config/authMiddleware');

router.get('/paciente', verificarRol('Paciente'), pacienteController.renderDashboard);
router.post('/paciente/agendar', verificarRol('Paciente'), pacienteController.agendarCita);

module.exports = router;
