const express = require('express');
const router = express.Router();
const { registerUser, verifyOTP, loginUser, getUserProfile } = require('../controllers/authController');
const { protectUser } = require('../middleware/userAuth');

router.post('/register', registerUser);
router.post('/verify-otp', verifyOTP);
router.post('/login', loginUser);
router.get('/me', protectUser, getUserProfile);

module.exports = router;
