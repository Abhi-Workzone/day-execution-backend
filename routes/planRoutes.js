const express = require('express');
const router = express.Router();
const planController = require('../controllers/planController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/today', planController.getTodayPlan);
router.post('/', planController.savePlan);
router.put('/:planId/task/:taskId', planController.updateTaskExecution);

module.exports = router;
