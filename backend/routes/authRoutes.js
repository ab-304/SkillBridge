const express = require('express');
const router = express.Router();
const {
  registerStudent,
  registerCompany,
  login,
  getMe,
  changePassword,
  updatePreferences,
  deleteAccount,
  forgotPassword,
  verifyOtp,
  resetPassword,
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register/student', registerStudent);
router.post('/register/company', registerCompany);
router.post('/login', login);
router.get('/me', protect, getMe);

// Settings
router.put('/change-password', protect, changePassword);
router.put('/preferences', protect, updatePreferences);
router.delete('/account', protect, deleteAccount);

// Forgot Password OTP Flow (Public)
router.post('/forgot-password', forgotPassword);
router.post('/verify-otp', verifyOtp);
router.post('/reset-password', resetPassword);

module.exports = router;
