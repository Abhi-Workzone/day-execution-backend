const express = require('express');
const router = express.Router();
const summaryController = require('../controllers/summaryController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.post('/', summaryController.createSummary);
router.get('/:date', summaryController.getSummary);
router.get('/', summaryController.getSummaries);

module.exports = router;
