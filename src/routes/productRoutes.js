const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { requireLogin } = require('../middleware/auth');

router.get('/products', requireLogin, productController.list);

module.exports = router;