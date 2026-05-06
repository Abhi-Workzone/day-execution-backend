const express = require('express');
const router = express.Router();
const routineController = require('../controllers/routineController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.post('/', routineController.createRoutine);
router.get('/', routineController.getRoutines);
router.put('/:id', routineController.updateRoutine);
router.delete('/:id', routineController.deleteRoutine);

module.exports = router;
