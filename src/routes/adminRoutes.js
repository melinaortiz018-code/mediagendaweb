const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const verificarRol = require('../config/authMiddleware');

router.get('/admin', verificarRol('Admin'), adminController.renderDashboard);
router.post('/admin/horario', verificarRol('Admin'), adminController.configurarHorario);

module.exports = router;
