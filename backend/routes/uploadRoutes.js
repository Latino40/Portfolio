const express = require('express');
const router = express.Router();
const { uploadProfile, uploadProject, uploadCV } = require('../controllers/uploadController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.post('/profile', protect, upload.single('image'), uploadProfile);
router.post('/project', protect, upload.single('image'), uploadProject);
router.post('/cv', protect, upload.single('cv'), uploadCV);

module.exports = router;
