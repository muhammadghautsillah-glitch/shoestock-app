const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const { requireLogin } = require('../middleware/auth');

router.get('/reports', requireLogin, reportController.dashboard);
router.get('/reports/export.csv', requireLogin, reportController.exportCsv);
module.exports = router;