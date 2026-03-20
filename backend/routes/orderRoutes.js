const express = require('express');
const { verifyToken } = require('../middleware/jwt');
const { getOrders, createOrder } = require('../controllers/orderController');

const router = express.Router();

router.get('/', verifyToken, getOrders);
router.post('/:gigId', verifyToken, createOrder);

module.exports = router;
