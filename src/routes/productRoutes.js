const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { requireLogin } = require('../middleware/auth');
const { productRules } = require('../middleware/validators');

router.get('/products', requireLogin, productController.list);
router.get('/products/new', requireLogin, productController.showCreate);
router.post('/products', requireLogin, productRules, productController.create);

module.exports = router;