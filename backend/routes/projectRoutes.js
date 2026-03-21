const express = require('express');
const { verifyToken } = require('../middleware/jwt');
const { createProject, getProjects, getProjectById, updateProjectStatus, deliverProject, acceptProject, rejectProject, approveDelivery, refundProject } = require('../controllers/projectController');

const router = express.Router();

router.post('/', verifyToken, createProject);
router.get('/', verifyToken, getProjects);
router.get('/:id', verifyToken, getProjectById);
router.put('/:id/status', verifyToken, updateProjectStatus);
router.post('/:id/deliver', verifyToken, deliverProject);
router.post('/:id/accept', verifyToken, acceptProject);
router.post('/:id/reject', verifyToken, rejectProject);
router.post('/:id/approve', verifyToken, approveDelivery);
router.post('/:id/refund', verifyToken, refundProject);

module.exports = router;
