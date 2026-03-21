const express = require('express');
const { register, registerWithWallet, login, loginWithWallet, logout, refresh } = require('../controllers/authController');

const router = express.Router();

router.post('/register', register);
router.post('/register-wallet', registerWithWallet);
router.post('/login', login);
router.post('/login-wallet', loginWithWallet);
router.post('/logout', logout);
router.post('/refresh', refresh);

module.exports = router;
