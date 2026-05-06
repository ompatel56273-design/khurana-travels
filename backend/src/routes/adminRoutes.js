const express = require('express');
const router = express.Router();
const { loginAdmin, getAdminProfile, seedAdmin } = require('../controllers/adminController');
const { protect } = require('../middleware/auth');

router.post('/login', loginAdmin);
router.get('/profile', protect, getAdminProfile);
router.post('/seed', seedAdmin);

module.exports = router;
