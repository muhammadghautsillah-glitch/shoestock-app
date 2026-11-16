const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { requireLogin } = require('../middleware/auth');
const { productRules } = require('../middleware/validators');

router.get('/products', requireLogin, productController.list);
router.get('/products/new', requireLogin, productController.showCreate);
router.post('/products', requireLogin, productRules, productController.create);
router.get('/products/:id/edit', requireLogin, productController.showEdit);
router.post('/products/:id/edit', requireLogin, productRules, productController.update);
module.exports = router;