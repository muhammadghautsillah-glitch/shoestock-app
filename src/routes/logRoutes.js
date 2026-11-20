const express = require('express');
const router = express.Router();
const logController = require('../controllers/logController');
const { requireRole } = require('../middleware/auth');

router.get('/logs', requireRole('admin'), logController.list);

module.exports = router;