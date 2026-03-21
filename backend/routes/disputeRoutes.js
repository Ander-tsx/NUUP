const express = require('express');
const { verifyToken } = require('../middleware/jwt');
const { openDispute, getDisputes, getDisputeById, resolveDispute, submitEvidence } = require('../controllers/disputeController');

const router = express.Router();

router.post('/', verifyToken, openDispute);
router.get('/', verifyToken, getDisputes);
router.get('/:id', verifyToken, getDisputeById);
router.post('/:id/resolve', verifyToken, resolveDispute);
router.post('/:id/evidence', verifyToken, submitEvidence);

module.exports = router;
