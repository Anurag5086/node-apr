const express = require('express');
const { registerUser, verifyOtp, resendOtp } = require('../controllers/auth.controller');
const router = express.Router();

router.post('/register', registerUser);
// router.post('/login', loginUser);
router.post('/verify-otp', verifyOtp);
router.post('/resend-otp', resendOtp);

module.exports = router;