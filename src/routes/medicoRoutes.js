const express = require('express');
const router = express.Router();
const medicoController = require('../controllers/medicoController');
const verificarRol = require('../config/authMiddleware');

router.get('/medico', verificarRol('Medico'), medicoController.renderDashboard);
router.post('/medico/cambiar-estado', verificarRol('Medico'), medicoController.actualizarEstadoCita);

module.exports = router;
