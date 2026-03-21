const express = require('express');
const { verifyToken } = require('../middleware/jwt');
const { getUserReputation, getReputationLogs, updateReputation } = require('../controllers/reputationController');

const router = express.Router();

router.get('/:userId', getUserReputation);
router.get('/:userId/logs', getReputationLogs);
router.post('/update', verifyToken, updateReputation);

module.exports = router;
