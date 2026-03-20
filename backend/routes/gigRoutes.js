const express = require('express');
const { verifyToken } = require('../middleware/jwt');
const { createGig, deleteGig, getGig, getGigs } = require('../controllers/gigController');

const router = express.Router();

router.post('/', verifyToken, createGig);
router.delete('/:id', verifyToken, deleteGig);
router.get('/:id', getGig);
router.get('/', getGigs);

module.exports = router;
