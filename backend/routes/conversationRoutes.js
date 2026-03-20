const express = require('express');
const { verifyToken } = require('../middleware/jwt');
const { getConversations, createConversation, getSingleConversation, updateConversation } = require('../controllers/conversationController');

const router = express.Router();

router.get('/', verifyToken, getConversations);
router.post('/', verifyToken, createConversation);
router.get('/single/:id', verifyToken, getSingleConversation);
router.put('/:id', verifyToken, updateConversation);

module.exports = router;
