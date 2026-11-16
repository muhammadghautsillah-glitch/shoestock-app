const express = require('express');
const router = express.Router();
const stockController = require('../controllers/stockController');
const { requireLogin } = require('../middleware/auth');
const { stockRules } = require('../middleware/validators');

router.get('/stock', requireLogin, stockController.showForm);
router.post('/stock', requireLogin, stockRules, stockController.move);

module.exports = router;