const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { registerRules } = require('../middleware/validators');
const { loginLimiter } = require('../middleware/rateLimit');
router.get('/register', authController.showRegister);
router.post('/register', registerRules, authController.register);

router.get('/login', authController.showLogin);
router.post('/login', loginLimiter, authController.login);
router.post('/logout', authController.logout);
module.exports = router;