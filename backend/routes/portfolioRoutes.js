const express = require('express');
const router = express.Router();
const { getPortfolio, updatePortfolio } = require('../controllers/portfolioController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', getPortfolio);
router.put('/', protect, updatePortfolio);

module.exports = router;
