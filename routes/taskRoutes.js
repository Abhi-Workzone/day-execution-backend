const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.post('/', taskController.createTask);
router.get('/', taskController.getTasks);
router.get('/completed', taskController.getCompletedTasks);
router.put('/:id', taskController.updateTask);
router.delete('/:id', taskController.deleteTask);

module.exports = router;
