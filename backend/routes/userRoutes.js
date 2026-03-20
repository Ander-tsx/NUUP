const express = require('express');
const { verifyToken } = require('../middleware/jwt');
const { getUser, deleteUser } = require('../controllers/userController');

const router = express.Router();

router.delete('/:id', verifyToken, deleteUser);
router.get('/:id', getUser);

module.exports = router;
